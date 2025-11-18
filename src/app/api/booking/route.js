import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import { getTokenValue } from "@/utils/tokenHandler";
import InvoiceModel from "@/../models/Invoice";
import { sendInvoiceToWhatsAppWithPaymentUrl } from "@/utils/sendToWhatsApp";
import UnitModel from "../../../../models/Unit";
import { BookingStatus, InvoiceStatus, RentAmountType, RentFrequency, UnitStatus, SubscritptionStatus, PropertyStatus } from "@/utils/contants";
import { calculateDueDate, calculateNextBillingdate } from "@/utils/functions";
import { OrganisationModel } from "../../../../models/Organisation";
import UserModel from "../../../../models/User";

// Helper to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET bookings (optionally filter by propertyId and/or unitId)
export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (bookingId) {
      const bookings = await BookingModel.findById(bookingId).populate("userId");

      return NextResponse.json(bookings);
    }


    const propertyId = searchParams.get("propertyId");
    const unitId = searchParams.get("unitId");

    let filter = {
      organisationId: user?.organisationId,
      disabled: false,
      deleted: false
    };
    if (propertyId) {
      if (!isValidObjectId(propertyId)) {
        return NextResponse.json({ message: "Invalid propertyId" }, { status: 400 });
      }
      filter.propertyId = propertyId;
    }
    if (unitId) {
      if (!isValidObjectId(unitId)) {
        return NextResponse.json({ message: "Invalid unitId" }, { status: 400 });
      }
      filter.unitId = unitId;
    }

    const bookings = await BookingModel.find(filter)
    // .populate("property")
    // .populate("unit");
    return NextResponse.json(bookings);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch bookings", details: err.message },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    const user = getTokenValue(request);
    if (!user?.organisationId&&body.type!=="public") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!isValidObjectId(body.unitId)) {
      return NextResponse.json({ message: "Invalid unitId" }, { status: 400 });
    }

    const unit = await UnitModel.findById(body.unitId).populate("propertyId")

    if (!unit) {
      return NextResponse.json({ message: "Unit not found for the given property" }, { status: 404 });
    }

    if (unit.propertyId?.status !== PropertyStatus.ACTIVE) {
      return NextResponse.json({ message: "Property not active state" }, { status: 404 });
    }

    if (unit.propertyId?.disabled) {
      return NextResponse.json({ message: "Property disabled, please contact rentities team" }, { status: 404 });
    }
    if (unit.propertyId?.deleted) {
      return NextResponse.json({ message: "Property deleted, please contact rentities team" }, { status: 404 });
    }

    if (!unit.status || (unit.status !== UnitStatus.AVAILABLE && unit.status !== UnitStatus.PARTIALLY_BOOKED)) {
      return NextResponse.json({ message: "Unit already booked" }, { status: 404 });
    }

    const organisation = await OrganisationModel.findById(unit.organisationId);
    if (!organisation?.subscription || organisation?.subscription?.status === SubscritptionStatus.EXPIRED) {
      return NextResponse.json({ message: "Organisation subscription expired" }, { status: 403 });
    }

    let nextBillingDate = null;

    if (body.status === BookingStatus.CHECKED_IN && unit.frequency) {
      const checkInDate = new Date(body.checkIn);
      const checkOutDate = body?.checkOut ? new Date(body.checkOut) : null;
      nextBillingDate = calculateNextBillingdate(checkInDate, unit.frequency);
      if (checkOutDate && checkOutDate < nextBillingDate) {
        nextBillingDate = undefined;
      }
    }

    function generateRandomCode() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    async function generateUniqueCode() {
      let code;
      let exists = true;

      while (exists) {
        code = generateRandomCode();
        exists = await BookingModel.exists({ code });
      }

      return code;
    }
    const code = await generateUniqueCode();

    const userData = await UserModel.findById(body.userId);

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 1️⃣ Create booking
    const booking = await BookingModel.create({
      ...body,
      propertyId: unit?.propertyId?._id,
      nextBillingDate,
      frequency: unit.frequency,
      organisationId: unit.organisationId,
      code,
      userId: userData._id,
    });

    

    const dueDate = calculateDueDate(booking?.frequency)
    console.log("dueDate", dueDate, booking?.frequency, unit.frequency);


    // 2️⃣ Generate invoices for this booking
    const invoices = [];

    // --- Advance Payment Invoice ---
    if (booking.advanceAmount && booking.advanceAmount > 0) {

      let invoiceId = `INV-${booking?.code}-01-ADV`
      invoices.push({
        organisationId: unit.organisationId,
        bookingId: booking._id,
        propertyId: booking.propertyId,
        unitId: booking.unitId,
        invoiceId: invoiceId, // generate ID
        amount: booking.advanceAmount,
        balance: booking.advanceAmount,
        type: RentAmountType.ADVANCE,
        status: InvoiceStatus.PENDING,
        dueDate: dueDate || new Date(),
      });

    }

    // --- First Rent Invoice ---
    if (booking.amount && booking.amount > 0) {
      let invoiceId = `INV-${booking?.code}-02-RENT`

      invoices.push({
        organisationId: unit.organisationId,
        bookingId: booking._id,
        propertyId: booking.propertyId,
        unitId: booking.unitId,
        invoiceId: invoiceId, // generate ID
        amount: booking.amount,
        balance: booking.amount,
        type: RentAmountType.RENT,
        status: InvoiceStatus.PENDING,
        dueDate: dueDate || new Date(),
      });

    }

    if (invoices.length > 0) {
      const res = await InvoiceModel.insertMany(invoices);
      res?.map(i => {
        sendInvoiceToWhatsAppWithPaymentUrl({...booking, userId: userData}, booking.amount, i.invoiceId, dueDate);
      })
    }

    await BookingModel.findByIdAndUpdate(booking._id, {
      lastInvoiceId: invoices[invoices.length - 1]._id
    })

    if (unit.noOfSlots >= 1 && unit.currentBooking < unit.noOfSlots && (booking.status === BookingStatus.CHECKED_IN || booking.status === BookingStatus.BOOKED)) {
      await UnitModel.findByIdAndUpdate(booking.unitId,
        {
          $inc: { currentBooking: 1 },
          $addToSet: { Bookings: booking._id },
          status: unit.noOfSlots === 1 ? UnitStatus.BOOKED : unit.currentBooking + 1 === unit.noOfSlots ? UnitStatus.BOOKED : UnitStatus.PARTIALLY_BOOKED,
        });
    }

    return NextResponse.json(
      { message: "Booking & invoices created", booking, invoices },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to add booking", details: err.message },
      { status: 400 }
    );
  }
}

// PUT update booking
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid booking ID" }, { status: 400 });
    }

    await connectMongoDB();

    const body = await request.json();

    const existingBooking = await BookingModel.findById(id).populate("unitId")

    if (!existingBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const unit = existingBooking?.unitId

    body.nextBillingDate = null;

    if (body.status === BookingStatus.CHECKED_IN && unit.frequency) {
      const checkInDate = new Date(body.checkIn);
      const checkOutDate = body?.checkOut ? new Date(body.checkOut) : null;
      body.nextBillingDate = calculateNextBillingdate(checkInDate, unit.frequency);
      if (checkOutDate && checkOutDate < body.nextBillingDate) {
        body.nextBillingDate = undefined;
      }
    }

    const updatedBooking = await BookingModel.findByIdAndUpdate(id, body, { new: true });

    if (!updatedBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    if (unit.noOfSlots > 1 && updatedBooking.status === BookingStatus.CHECKED_OUT) {
      await UnitModel.findByIdAndUpdate(updatedBooking.unitId,
        {
          $inc: { currentBooking: -1 },
          $pull: { Bookings: updatedBooking._id },
          status: unit.currentBooking - 1 === 0 ? UnitStatus.AVAILABLE : UnitStatus.PARTIALLY_BOOKED
        });
    }

    if (unit.noOfSlots === 1 && updatedBooking.status === BookingStatus.CHECKED_OUT) {
      await UnitModel.findByIdAndUpdate(updatedBooking.unitId, {
        status: UnitStatus.AVAILABLE,
        $inc: { currentBooking: -1 },
        $pull: { Bookings: updatedBooking._id }
      });
    }


    return NextResponse.json({ message: "Booking updated", updatedBooking });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to update booking", details: err.message },
      { status: 400 }
    );
  }
}

// DELETE booking
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid booking ID" }, { status: 400 });
    }

    await connectMongoDB();
    const deleted = await BookingModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking deleted" });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to delete booking", details: err.message },
      { status: 500 }
    );
  }
}

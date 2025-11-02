import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import { getTokenValue } from "@/utils/tokenHandler";
import InvoiceModel from "@/../models/Invoice";
import { sendInvoiceToWhatsAppWithPaymentUrl, sendInvoiceToWhatsAppWithSelfBank } from "@/utils/sendToWhatsApp";
import RoomModel from "../../../../models/Room";
import { BookingStatus, InvoiceStatus, RentAmountType, RentFrequency, RoomStatus, SubscritptionStatus } from "@/utils/contants";
import { calculateDueDate, calculateNextBillingdate } from "@/utils/functions";
import { OrganisationModel } from "../../../../models/Organisation";
import { SelfRecieveBankOrUpiModel } from "../../../../models/SelfRecieveBankOrUpi";

// Helper to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET bookings (optionally filter by propertyId and/or roomId)
export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (bookingId) {
      const bookings = await BookingModel.findById(bookingId)

      return NextResponse.json(bookings);
    }


    const propertyId = searchParams.get("propertyId");
    const roomId = searchParams.get("roomId");

    let filter = {
      organisationId:user?.organisationId
    };
    if (propertyId) {
      if (!isValidObjectId(propertyId)) {
        return NextResponse.json({ error: "Invalid propertyId" }, { status: 400 });
      }
      filter.propertyId = propertyId;
    }
    if (roomId) {
      if (!isValidObjectId(roomId)) {
        return NextResponse.json({ error: "Invalid roomId" }, { status: 400 });
      }
      filter.roomId = roomId;
    }

    const bookings = await BookingModel.find(filter)
    // .populate("property")
    // .populate("room");
    return NextResponse.json(bookings);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: err.message },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isValidObjectId(body.roomId)) {
      return NextResponse.json({ error: "Invalid roomId" }, { status: 400 });
    }

    const room = await RoomModel.findById(body.roomId).populate("organisationId").populate("propertyId")



    if (!room) {
      return NextResponse.json({ error: "Room not found for the given property" }, { status: 404 });
    }
    if (!room.status || (room.status !== RoomStatus.AVAILABLE && room.status !== RoomStatus.PARTIALLY_BOOKED)) {
      return NextResponse.json({ error: "Room already booked" }, { status: 404 });
    }


    const organisation = await OrganisationModel.findById(user.organisationId)
    if (!organisation?.subscription || organisation?.subscription?.status === SubscritptionStatus.EXPIRED) {
      return NextResponse.json({ error: "Organisation subscription expired" }, { status: 403 });
    }

    const bookings_list = await BookingModel.find({ organisationId: user.organisationId })
    if (organisation?.usageLimits?.bookings < (bookings_list?.length ?? 0) + 1) {
      return NextResponse.json({ error: "Booking limit reached. Please upgrade your subscription." }, { status: 403 });
    }

    let nextBillingDate = null;
    console.log(body.status, BookingStatus.CHECKED_IN, room.frequency, body.checkOut);

    if (body.status === BookingStatus.CHECKED_IN && room.frequency) {
      const checkInDate = new Date(body.checkIn);
      const checkOutDate = body?.checkOut ? new Date(body.checkOut) : null;
      nextBillingDate = calculateNextBillingdate(checkInDate, room.frequency);
      if (checkOutDate && checkOutDate < nextBillingDate) {
        nextBillingDate = undefined;
      }
    }

    // 1️⃣ Create booking
    const booking = await BookingModel.create({
      ...body,
      propertyId: room?.propertyId?._id,
      nextBillingDate,
      frequency: room.frequency,
      organisationId: user.organisationId,
    });


    let selected_bank
    if (room?.organisationId?.is_paymentRecieveSelf) {
      selected_bank = await SelfRecieveBankOrUpiModel.findById(room.propertyId?.selctedSelfRecieveBankOrUpi)
    }

    const dueDate = calculateDueDate(booking?.frequency)
    console.log("dueDate", dueDate, booking?.frequency, room.frequency);


    // 2️⃣ Generate invoices for this booking
    const invoices = [];

    // --- Advance Payment Invoice ---
    if (booking.advanceAmount && booking.advanceAmount > 0) {

      let invoiceId = `INV-${booking._id?.toString()?.slice(-6, -1)}-01-ADV`
      let paymentUrl = "SELF RECEIVE";
      let paymentGateway = "manual"
      if (room?.organisationId?.is_paymentRecieveSelf === false) {
        paymentUrl = await generateRazorpayLinkForInvoice(invoiceId, amount, booking?.fullName, booking);
        paymentGateway = "razorpay"
      }
      invoices.push({
        organisationId: user.organisationId,
        bookingId: booking._id,
        propertyId: booking.propertyId,
        roomId: booking.roomId,
        invoiceId: invoiceId, // generate ID
        amount: booking.advanceAmount,
        balance: booking.advanceAmount,
        type: RentAmountType.ADVANCE,
        status: InvoiceStatus.PENDING,
        dueDate: dueDate || new Date(),
        paymentGateway,
        paymentUrl
      });
      if (room?.organisationId?.is_paymentRecieveSelf) {
        sendInvoiceToWhatsAppWithSelfBank(booking, booking.advanceAmount, invoiceId, selected_bank, dueDate);
      } else {
        sendInvoiceToWhatsAppWithPaymentUrl(booking, booking.advanceAmount, invoiceId, paymentUrl, dueDate);
      }
    }

    // --- First Rent Invoice ---
    if (booking.amount && booking.amount > 0) {
      let invoiceId = `INV-${booking._id?.toString()?.slice(-6, -1)}-02-RENT`
      let paymentUrl_2 = "SELF RECEIVE";
      let paymentGateway = "manual"
      if (room?.organisationId?.is_paymentRecieveSelf === false) {
        paymentUrl_2 = await generateRazorpayLinkForInvoice(invoiceId, amount, booking?.fullName, booking);
        paymentGateway = "razorpay"
      }

      invoices.push({
        organisationId: user.organisationId,
        bookingId: booking._id,
        propertyId: booking.propertyId,
        roomId: booking.roomId,
        invoiceId: invoiceId, // generate ID
        amount: booking.amount,
        balance: booking.amount,
        type: RentAmountType.ADVANCE,
        status: InvoiceStatus.PENDING,
        dueDate: dueDate || new Date(),
        paymentGateway,
        paymentUrl: paymentUrl_2
      });

      if (room?.organisationId?.is_paymentRecieveSelf) {
        sendInvoiceToWhatsAppWithSelfBank(booking, booking.amount, invoiceId, selected_bank, dueDate);
      } else {
        sendInvoiceToWhatsAppWithPaymentUrl(booking, booking.amount, invoiceId, paymentUrl_2, dueDate);
      }
    }

    if (invoices.length > 0) {
      await InvoiceModel.insertMany(invoices);
    }

    if (room.noOfSlots >= 1 && room.currentBooking < room.noOfSlots && (booking.status === BookingStatus.CHECKED_IN || booking.status === BookingStatus.BOOKED)) {
      await RoomModel.findByIdAndUpdate(booking.roomId,
        {
          $inc: { currentBooking: 1 },
          $addToSet: { Bookings: booking._id },
          status: room.noOfSlots === 1 ? RoomStatus.BOOKED : room.currentBooking + 1 === room.noOfSlots ? RoomStatus.BOOKED : RoomStatus.PARTIALLY_BOOKED,
        });
    }

    return NextResponse.json(
      { message: "Booking & invoices created", booking, invoices },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add booking", details: err.message },
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
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    await connectMongoDB();

    const body = await request.json();

    const existingBooking = await BookingModel.findById(id).populate("roomId")

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const room = existingBooking?.roomId

    body.nextBillingDate = null;

    if (body.status === BookingStatus.CHECKED_IN && room.frequency) {
      const checkInDate = new Date(body.checkIn);
      const checkOutDate = body?.checkOut ? new Date(body.checkOut) : null;
      body.nextBillingDate = calculateNextBillingdate(checkInDate, room.frequency);
      if (checkOutDate && checkOutDate < body.nextBillingDate) {
        body.nextBillingDate = undefined;
      }
    }

    const updatedBooking = await BookingModel.findByIdAndUpdate(id, body, { new: true });

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (room.noOfSlots > 1 && updatedBooking.status === BookingStatus.CHECKED_OUT) {
      await RoomModel.findByIdAndUpdate(updatedBooking.roomId,
        {
          $inc: { currentBooking: -1 },
          $pull: { Bookings: updatedBooking._id },
          status: room.currentBooking - 1 === 0 ? RoomStatus.AVAILABLE : RoomStatus.PARTIALLY_BOOKED
        });
    }

    if (room.noOfSlots === 1 && updatedBooking.status === BookingStatus.CHECKED_OUT) {
      await RoomModel.findByIdAndUpdate(updatedBooking.roomId, {
        status: RoomStatus.AVAILABLE,
        $inc: { currentBooking: -1 },
        $pull: { Bookings: updatedBooking._id }
      });
    }


    return NextResponse.json({ message: "Booking updated", updatedBooking });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update booking", details: err.message },
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
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    await connectMongoDB();
    const deleted = await BookingModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking deleted" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete booking", details: err.message },
      { status: 500 }
    );
  }
}

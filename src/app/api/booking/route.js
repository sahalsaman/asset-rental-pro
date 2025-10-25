import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import { getTokenValue } from "@/utils/tokenHandler";
import InvoiceModel from "@/../models/Invoice";
import { sendInvoiceToWhatsAppWithPaymentUrl, sendInvoiceToWhatsAppWithSelfBank } from "@/utils/sendToWhatsApp";
import RoomModel from "../../../../models/Room";
import { BookingStatus, InvoiceStatus, RentAmountType, RentFrequency, RoomStatus, SubscritptionStatus } from "@/utils/contants";
import { OrgSubscriptionModel } from "../../../../models/Organisation";
import { generateRazorpayLinkForInvoice } from "@/utils/razerPay";
import { calculateNextBillingdate } from "@/utils/functions";

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

    if (bookingId) {
      const bookings = await BookingModel.findById(bookingId)

      return NextResponse.json(bookings);
    }


    const propertyId = searchParams.get("propertyId");
    const roomId = searchParams.get("roomId");

    let filter = {};
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

    if (!isValidObjectId(body.propertyId)) {
      const roomData = await RoomModel.findById(body.roomId)
      if (!roomData?.propertyId) {
        return NextResponse.json({ error: "Invalid propertyId" }, { status: 400 });
      }
      body.propertyId = roomData?.propertyId
    }

    const room = await RoomModel.findOne({
      _id: body.roomId,
      propertyId: body.propertyId,
    }).populate("propertyId");

    if (!room) {
      return NextResponse.json({ error: "Room not found for the given property" }, { status: 404 });
    }
    if (!room.status || (room.status !== RoomStatus.AVAILABLE && room.status !== RoomStatus.PARTIALLY_BOOKED)) {
      return NextResponse.json({ error: "Room not found for the given property" }, { status: 404 });
    }

    const org = await OrgSubscriptionModel.findOne({ organisationId: user.organisationId })
    const bookings_list = await BookingModel.find({ organisationId: user.organisationId })

    if (org?.status === SubscritptionStatus.EXPIRED) {
      return NextResponse.json({ error: "Organisation subscription expired" }, { status: 403 });
    }

    if (org?.usageLimits?.property == bookings_list?.length + 1) {
      return NextResponse.json({ error: "Booking limit reached. Please upgrade your subscription." }, { status: 403 });
    }

    let dueDate = calculateDueDate(booking?.frequency)

    let nextBillingDate = null;

    if (booking.status === BookingStatus.CHECKED_IN && body.frequency) {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = body?.checkOut ? new Date(body.checkOut) : null;
      nextBillingDate = calculateNextBillingdate(checkInDate, body?.frequency)

    }


    // 1️⃣ Create booking
    const booking = await BookingModel.create({
      ...body,
      nextBillingDate,
      organisationId: user.organisationId,
    });

    // 2️⃣ Generate invoices for this booking
    const invoices = [];

    // --- Advance Payment Invoice ---
    if (booking.advanceAmount && booking.advanceAmount > 0) {

      let invoiceId = `INV-${booking._id}-01-ADV`
      let paymentUrl = "SELF RECEIVE";
      let paymentGateway = "manual"
      // if (room?.propertyId?.is_paymentRecieveSelf === false) {
      //   paymentUrl = await generateRazorpayLinkForInvoice(invoiceId, amount, booking?.fullName, booking);
      //     //let paymentGateway="razorpay"
      // }
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
        dueDate: booking.checkIn || new Date(),
        paymentGateway,
        paymentUrl
      });
      // if (room?.propertyId?.is_paymentRecieveSelf === false) {
      //   sendInvoiceToWhatsAppWithPaymentUrl(booking, booking.advanceAmount, invoiceId, paymentLink);
      // } else {
      //   sendInvoiceToWhatsAppWithSelfBank(booking, booking.advanceAmount, invoiceId, room.propertyId?.selectedBank);
      // }
    }

    // --- First Rent Invoice ---
    if (booking.amount && booking.amount > 0) {
      let invoiceId = `INV-${booking._id}-02-RENT`
      let paymentUrl_2 = "SELF RECEIVE";
      let paymentGateway = "manual"
      // if (room?.propertyId?.is_paymentRecieveSelf === false) {
      //   paymentUrl_2 = await generateRazorpayLinkForInvoice(invoiceId, amount, booking?.fullName, booking);
      //let paymentGateway="razorpay"
      // }

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
        dueDate: booking.checkIn || new Date(),
        paymentGateway,
        paymentUrl: paymentUrl_2
      });

      if (room?.propertyId?.is_paymentRecieveSelf === false) {
        sendInvoiceToWhatsAppWithPaymentUrl(booking, booking.amount, invoiceId, paymentLink_2);
      } else {
        sendInvoiceToWhatsAppWithSelfBank(booking, booking.amount, invoiceId, room.propertyId?.selectedBank);
      }
    }

    if (invoices.length > 0) {
      await InvoiceModel.insertMany(invoices);
    }

    if (room.noOfSlots > 1 && room.currentBooking < room.noOfSlots && (booking.status === BookingStatus.CHECKED_IN || booking.status === BookingStatus.BOOKED)) {
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
    const updated = await BookingModel.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (room.noOfSlots > 1 && booking.status === BookingStatus.CHECKED_OUT) {
      await RoomModel.findByIdAndUpdate(booking.roomId,
        {
          $inc: { currentBooking: -1 },
          $pull: { Bookings: booking._id },
          status: room.currentBooking - 1 === 0 ? RoomStatus.AVAILABLE : RoomStatus.PARTIALLY_BOOKED
        });
    }

    if (room.noOfSlots === 1 && booking.status === BookingStatus.CHECKED_OUT) {
      await RoomModel.findByIdAndUpdate(booking.roomId, {
        status: RoomStatus.AVAILABLE,
        $inc: { currentBooking: -1 },
        $pull: { Bookings: booking._id }
      });
    }


    return NextResponse.json({ message: "Booking updated", updated });
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

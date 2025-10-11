import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import { getTokenValue } from "@/utils/tokenHandler";
import InvoiceModel from "@/../models/Invoice";
import { sendInvoiceToWhatsApp } from "@/utils/sendToWhatsApp";
import RoomModel from "../../../../models/Room";
import { BookingStatus, RoomStatus } from "@/utils/contants";
import { OrgSubscriptionModel } from "../../../../models/Organisation";
import { generateRazorpayLinkForInvoice } from "@/utils/razerPay";

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
    if (!room.status || room.status !== RoomStatus.AVAILABLE) {
      return NextResponse.json({ error: "Room not found for the given property" }, { status: 404 });
    }

    const org = await OrgSubscriptionModel.findOne({ organisationId: user.organisationId })
    const bookings_list = await BookingModel.find({ organisationId: user.organisationId })
    if (org?.usageLimits?.property == bookings_list?.length + 1) {
      return NextResponse.json({ error: "Booking limit reached. Please upgrade your subscription." }, { status: 403 });
    }


    // 1️⃣ Create booking
    const booking = await BookingModel.create({
      ...body,
      organisationId: user.organisationId,
    });

    // 2️⃣ Generate invoices for this booking
    const invoices = [];

    // --- Advance Payment Invoice ---
    if (booking.advanceAmount && booking.advanceAmount > 0) {

      let invoiceId = `INV-${booking._id}-01-ADV`
      let paymentLink = null;
      if (room.is_paymentRecieveSelf === false) {
          paymentLink = await generateRazorpayLinkForInvoice(invoiceId, amount, booking?.fullName);
        }
        invoices.push({
          organisationId: user.organisationId,
          bookingId: booking._id,
          propertyId: booking.propertyId,
          roomId: booking.roomId,
          invoiceId: invoiceId, // generate ID
          amount: booking.advanceAmount,
          balance: booking.advanceAmount,
          type: "Advance",
          dueDate: booking.checkIn || new Date(),
          paymentUrl: paymentLink ?? "SELF REVEIVE"
        });
        sendInvoiceToWhatsApp(booking.whatsappNumber, invoiceId, booking.advanceAmount, booking?.fullName, paymentLink);
      }

      // --- First Rent Invoice ---
      if (booking.amount && booking.amount > 0) {
        let invoiceId = `INV-${booking._id}-02-RENT`
        let paymentLink = null;
        if (room.is_paymentRecieveSelf === false) {
            paymentLink = await generateRazorpayLinkForInvoice(invoiceId, amount, booking?.fullName);
          }

          invoices.push({
            organisationId: user.organisationId,
            bookingId: booking._id,
            propertyId: booking.propertyId,
            roomId: booking.roomId,
            invoiceId: invoiceId, // generate ID
            amount: booking.amount,
            balance: booking.amount,
            type: "Rent",
            dueDate: booking.checkIn || new Date(),
            paymentUrl: paymentLink ?? "SELF RECEIVE"
          });

          sendInvoiceToWhatsApp(booking.whatsappNumber, invoiceId, booking.amount, booking?.fullName, paymentLink);
        }


        if (invoices.length > 0) {
          await InvoiceModel.insertMany(invoices);
        }

        if (room.noOfSlots > 1 && room.currentBooking < room.noOfSlots && (booking.status === BookingStatus.CHECKED_IN || booking.status === BookingStatus.CONFIRMED)) {
          await RoomModel.findByIdAndUpdate(booking.roomId,
            {
              $inc: { currentBooking: 1 },
              $addToSet: { Bookings: booking._id },
              status: room.currentBooking + 1 === room.noOfSlots ? RoomStatus.BOOKED : RoomStatus.PARTIALLY_BOOKED
            });
        }

        if (room.noOfSlots === 1 && (booking.status === BookingStatus.CHECKED_IN || booking.status === BookingStatus.CONFIRMED)) {
          await RoomModel.findByIdAndUpdate(booking.roomId, {
            status: RoomStatus.BOOKED,
            $inc: { currentBooking: 1 },
            $addToSet: { Bookings: booking._id }
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

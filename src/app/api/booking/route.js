import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";

// Helper to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET bookings (optionally filter by propertyId and/or spaceId)
export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const spaceId = searchParams.get("spaceId");

    let filter = {};
    if (propertyId) {
      if (!isValidObjectId(propertyId)) {
        return NextResponse.json({ error: "Invalid propertyId" }, { status: 400 });
      }
      filter.propertyId = propertyId;
    }
    if (spaceId) {
      if (!isValidObjectId(spaceId)) {
        return NextResponse.json({ error: "Invalid spaceId" }, { status: 400 });
      }
      filter.spaceId = spaceId;
    }

    const bookings = await BookingModel.find(filter)
      .populate("propertyId")
      .populate("spaceId");
    return NextResponse.json(bookings);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: err.message },
      { status: 500 }
    );
  }
}

// POST new booking
export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    if (!isValidObjectId(body.propertyId)) {
      return NextResponse.json({ error: "Invalid propertyId" }, { status: 400 });
    }
    if (!isValidObjectId(body.spaceId)) {
      return NextResponse.json({ error: "Invalid spaceId" }, { status: 400 });
    }

    const booking = await BookingModel.create(body);
    return NextResponse.json({ message: "Booking added", booking }, { status: 201 });
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

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/../database/db";
import InvoiceModel from "@/../models/Invoice";

// Helper to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET invoices (optionally filter by bookingId, propertyId, spaceId)
export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    const propertyId = searchParams.get("propertyId");
    const spaceId = searchParams.get("spaceId");

    let filter= {};
    if (bookingId) {
      if (!isValidObjectId(bookingId)) {
        return NextResponse.json({ error: "Invalid bookingId" }, { status: 400 });
      }
      filter.bookingId = bookingId;
    }
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

    const invoices = await InvoiceModel.find(filter)
      .populate("bookingId")
      .populate("propertyId")
      .populate("spaceId");

    return NextResponse.json(invoices);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch invoices", details: err.message },
      { status: 500 }
    );
  }
}

// POST new invoice
export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    if (!isValidObjectId(body.bookingId)) {
      return NextResponse.json({ error: "Invalid bookingId" }, { status: 400 });
    }
    if (!isValidObjectId(body.propertyId)) {
      return NextResponse.json({ error: "Invalid propertyId" }, { status: 400 });
    }
    if (!isValidObjectId(body.spaceId)) {
      return NextResponse.json({ error: "Invalid spaceId" }, { status: 400 });
    }

    const invoice = await InvoiceModel.create(body);
    return NextResponse.json({ message: "Invoice added", invoice }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add invoice", details: err.message },
      { status: 400 }
    );
  }
}

// PUT update invoice
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
    }

    await connectMongoDB();
    const body = await request.json();
    const updated = await InvoiceModel.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Invoice updated", updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update invoice", details: err.message },
      { status: 400 }
    );
  }
}

// DELETE invoice
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
    }

    await connectMongoDB();
    const deleted = await InvoiceModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Invoice deleted" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete invoice", details: err.message },
      { status: 500 }
    );
  }
}

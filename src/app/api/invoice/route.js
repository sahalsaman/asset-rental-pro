import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/../database/db";
import InvoiceModel from "@/../models/Invoice";
import { getTokenValue } from "@/utils/tokenHandler";
import { InvoiceStatus } from "@/utils/contants";

// Helper to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET invoices (optionally filter by bookingId, propertyId, unitId)
export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    const propertyId = searchParams.get("propertyId");
    const unitId = searchParams.get("unitId");

    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let filter = {
      organisationId: user?.organisationId,
      disabled: false,
      deleted: false
    };
    if (bookingId) {
      filter.bookingId = bookingId;
    }
    if (propertyId) {
      filter.propertyId = propertyId;
    }
    if (unitId) {
      filter.unitId = unitId;
    }

    const invoices = await InvoiceModel.find(filter)
      .populate({
        path: "bookingId",
        populate: {
          path: "userId",
          model: "User",
        },
      })
      .sort({ createdAt: -1 })
      .lean(false);


    return NextResponse.json(invoices);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch invoices", details: err.message },
      { status: 500 }
    );
  }
}

// POST new invoice
// export async function POST(request) {
//   try {
//     await connectMongoDB();
//     const body = await request.json();

//     if (!isValidObjectId(body.bookingId)) {
//       return NextResponse.json({ message: "Invalid bookingId" }, { status: 400 });
//     }
//     if (!isValidObjectId(body.propertyId)) {
//       return NextResponse.json({ message: "Invalid propertyId" }, { status: 400 });
//     }
//     if (!isValidObjectId(body.unitId)) {
//       return NextResponse.json({ message: "Invalid unitId" }, { status: 400 });
//     }

//     const invoice = await InvoiceModel.create(body);
//     return NextResponse.json({ message: "Invoice added", invoice }, { status: 201 });
//   } catch (err) {
//     return NextResponse.json(
//       { message: "Failed to add invoice", details: err.message },
//       { status: 400 }
//     );
//   }
// }

// PUT update invoice


export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid invoice ID" }, { status: 400 });
    }

    await connectMongoDB();
    const body = await request.json();
    body.paidAt = new Date()
    const updated = await InvoiceModel.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Invoice updated", updated });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to update invoice", details: err.message },
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
      return NextResponse.json({ message: "Invalid invoice ID" }, { status: 400 });
    }

    await connectMongoDB();
    const deleted = await InvoiceModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Invoice deleted" });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to delete invoice", details: err.message },
      { status: 500 }
    );
  }
}

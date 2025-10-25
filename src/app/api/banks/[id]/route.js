import { NextResponse } from "next/server";
import { SelfRecieveBankOrUpiModel } from "../../../../../models/SelfRecieveBankOrUpi";
import connectMongoDB from "../../../../../database/db";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const bank = await SelfRecieveBankOrUpiModel.findById(params.id);
    if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
    return NextResponse.json(bank);
  } catch (error) {
    console.error("GET /banks/:id error:", error);
    return NextResponse.json({ error: "Failed to fetch bank" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const updated = await SelfRecieveBankOrUpiModel.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /banks/:id error:", error);
    return NextResponse.json({ error: "Failed to update bank" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();
    await SelfRecieveBankOrUpiModel.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Bank deleted successfully" });
  } catch (error) {
    console.error("DELETE /banks/:id error:", error);
    return NextResponse.json({ error: "Failed to delete bank" }, { status: 500 });
  }
}

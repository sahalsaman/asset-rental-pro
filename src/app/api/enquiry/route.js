import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import EnquiryModel from "@/../models/enquiry";

export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();

    const enquiry = await EnquiryModel.create(body);

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json({ success: false, message: "Failed to create enquiry" }, { status: 500 });
  }
}

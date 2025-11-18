import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import EnquiryModel from "@/../models/enquiry";
import { UserRoles } from "@/utils/contants";
import { getTokenValue } from "@/utils/tokenHandler";

export async function GET(request) {
  try {
    await connectMongoDB();
    const user = getTokenValue(request);

    if (user.role != UserRoles.ADMIN) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const enquiries = await EnquiryModel.find().sort({ createdAt: -1 });

    return NextResponse.json(enquiries, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();

    const body = await request.json();

    const enquiry = await EnquiryModel.create(body);

    return NextResponse.json(enquiry, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

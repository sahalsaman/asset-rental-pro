import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import LeadModel from "@/../models/Lead";
import { UserRoles } from "@/utils/contants";
import { getTokenValue } from "@/utils/tokenHandler";

export async function GET(request) {
  try {
    await connectMongoDB();
    const user = getTokenValue(request);

    if (user.role != UserRoles.ADMIN) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const leads = await LeadModel.find().sort({ createdAt: -1 });

    return NextResponse.json(leads, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();
    const user = getTokenValue(request);

    const body = await request.json();

    const newLead = await LeadModel.create(body);

    return NextResponse.json(newLead, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



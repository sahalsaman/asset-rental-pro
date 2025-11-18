import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import LeadModel from "../../../../../../models/Lead";

export async function PUT(req, { params }) {
  await connectMongoDB();

  const { id } = params;
  const body = await req.json();

  const lead = await LeadModel.findByIdAndUpdate(id, body, { new: true });

  if (!lead) {
    return new NextResponse(JSON.stringify({ message: "Lead not found" }), {
      status: 404,
    });
  }

  return NextResponse.json(lead);
}




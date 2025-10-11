import { NextResponse } from "next/server";
import { getTokenValue, IPayload } from "@/utils/tokenHandler";
import connectMongoDB from "../../../../database/db";
import { BankDetailnModel } from "../../../../models/BankDetail";

export async function GET(req) {
  try {
    await connectMongoDB();
    const user = getTokenValue(req);
    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const banks = await BankDetailnModel.find({ organisation: user?.organisationId }).sort({ isPrimary: -1 });
    return NextResponse.json(banks);
  } catch (error) {
    console.error("GET /banks error:", error);
    return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongoDB();
    const user = getTokenValue(req);
    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const newBank = await BankDetailnModel.create({
      ...body,
      organisation: user.organisationId,
    });

    return NextResponse.json(newBank, { status: 201 });
  } catch (error) {
    console.error("POST /banks error:", error);
    return NextResponse.json({ error: "Failed to add bank" }, { status: 500 });
  }
}

// app/api/managers/route.ts
import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import UserModel from "@/../models/User";
import OrganisationModel from "@/../models/Organisation";
import { getTokenValue } from "@/utils/tokenHandler";

// GET all managers for current org
export async function GET(request) {
  try {
    await connectMongoDB();
    const user = getTokenValue(request);
  if (!user?.organisationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


    const managers = await UserModel.find({ organisationId:user.organisationId, role: "manager" })
      .populate("properties");

    return NextResponse.json(managers);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST (Add Manager)
export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();
    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const organisationId=user.organisationId
    const { firstName, lastName, phone } = body;
    if (!firstName || !phone || !organisationId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newManager = await UserModel.create({
      firstName,
      lastName,
      phone,
      organisationId,
      role: "manager",
    });

    await OrganisationModel.findByIdAndUpdate(organisationId, {
      $addToSet: { managers: newManager._id },
    });

    return NextResponse.json(newManager, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

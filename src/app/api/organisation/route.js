import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { OrganisationModel } from "@/../models/Organisation";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionStatus, UserRoles } from "@/utils/contants";

export async function GET(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== UserRoles.OWNER) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    let organisation = await OrganisationModel.findById(user.organisationId).lean();

    return NextResponse.json(organisation, { status: 200 });
  } catch (error) {
    console.error("Error fetching organisation:", error);
    return NextResponse.json(
      { message: "Failed to fetch organisation" },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  await connectMongoDB();

  const user = getTokenValue(request);
  if (!user?.organisationId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== UserRoles.OWNER) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const id = user.organisationId;
  const body = await request.json();

  const updated = await OrganisationModel.findByIdAndUpdate(id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

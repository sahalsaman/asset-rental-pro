import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { OrganisationModel } from "@/../models/Organisation";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionStatus, UserRoles } from "@/utils/contants";

export async function GET(request) {
  try {

    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectMongoDB();

    if (user.role == UserRoles.ADMIN) {
      let organisations = await OrganisationModel.find().populate('owner', 'firstName lastName countryCode phone _id').lean();
      return NextResponse.json(organisations, { status: 200 });
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

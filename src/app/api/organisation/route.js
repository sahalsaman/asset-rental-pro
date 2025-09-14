import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import OrganisationModel from "@/../models/Organisation";
import { getTokenValue } from "@/utils/tokenHandler";

export async function GET(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organisations = await OrganisationModel.findById(user.organisationId);

    return NextResponse.json(organisations, { status: 200 });
  } catch (error) {
    console.error("Error fetching organisations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organisations" },
      { status: 500 }
    );
  }
}


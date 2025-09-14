import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import UserModel from "@/../models/User";
import { getTokenValue } from "@/utils/tokenHandler";

export async function GET(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);
    
    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await UserModel.findById(user.id);

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}


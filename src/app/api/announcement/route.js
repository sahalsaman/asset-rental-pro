import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import AnnouncementModel from "@/../models/Announcement";
import { getTokenValue } from "@/utils/tokenHandler";

export async function GET(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);
    if (!user?.businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const announcements = await AnnouncementModel.find({
      businessId: user.businessId,
    });

    return NextResponse.json(announcements, { status: 200 });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { message: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);
    if (!user?.businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const newAnnouncement = new AnnouncementModel({
      ...body,
      businessId: user.businessId,
      createdBy: user.id,
    });

    await newAnnouncement.save();

    // add whatsapp message

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { message: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

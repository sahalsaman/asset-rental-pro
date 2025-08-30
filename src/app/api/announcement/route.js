import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import AnnouncementModel from "@/../models/Announcement";
import { getTokenValue } from "@/utils/tokenHandler";

export async function GET(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const announcements = await AnnouncementModel.find({
      organisationId: user.organisationId,
    });

    return NextResponse.json(announcements, { status: 200 });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();



    const newAnnouncement = new AnnouncementModel({
      ...body,
      organisationId: user.organisationId,
      createdBy: user.id,
    });

    await newAnnouncement.save();

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

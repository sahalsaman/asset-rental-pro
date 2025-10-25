import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import RoomModel from "@/../models/Room";
import BookingModel from "@/../models/Booking";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionStatus } from "@/utils/contants";
import { OrganisationModel } from "../../../../models/Organisation";


export async function GET(request) {
  const user = getTokenValue(request);
  if (!user?.organisationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const propertyId = url.searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
  }

  const roomId = url.searchParams.get("roomId");

  await connectMongoDB();

  if (roomId) {
    const room = await RoomModel.findOne({
      _id: roomId,
      propertyId,
    });

    if (!room) {
      return NextResponse.json(null);
    }

    return NextResponse.json({ ...room.toObject(), bookingsCount: 0 });
  }

  const rooms = await RoomModel.find({ propertyId });

  const roomsWithCounts = await Promise.all(
    rooms.map(async (room) => {
      const bookingsCount = await BookingModel.countDocuments({
        roomId: room._id,
      });
      if (bookingsCount) {
        return { ...room.toObject(), bookingsCount };
      } else {
        return { ...room.toObject(), bookingsCount: 0 };
      }
    })
  );

  return NextResponse.json(roomsWithCounts);
}


// POST new room
export async function POST(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  await connectMongoDB();
  const rooms_list = await RoomModel.find({ organisationId: user.organisationId })

  const organisation = await OrganisationModel.findById(user.organisationId)
  if (!organisation?.subscription || organisation?.subscription?.status === SubscritptionStatus.EXPIRED) {
    return NextResponse.json({ error: "Organisation subscription expired" }, { status: 403 });
  }

  if (body.isMultipleRoom) {
    if (body.numberOfRooms && organisation?.subscription?.usageLimits?.rooms < rooms_list?.length + body.numberOfRooms) {
      return NextResponse.json({ error: "Room limit reached. Please upgrade your subscription." }, { status: 403 });
    }

    const newRooms = [];
    for (let i = 0; i < (body.numberOfRooms || 1); i++) {
      const roomData = { ...body, organisationId: user.organisationId, name: `Room - ${i + 1}` };
      delete roomData.isMultipleRoom;
      delete roomData.numberOfRooms;
      const room = await RoomModel.create(roomData);
      newRooms.push(room);
    }
    return NextResponse.json(newRooms, { status: 201 });

  }

  if (organisation?.subscription?.usageLimits?.rooms < (rooms_list?.length ?? 0) + 1) {
    return NextResponse.json({ error: "Room limit reached. Please upgrade your subscription." }, { status: 403 });
  }

  const room = await RoomModel.create({ ...body, organisationId: user.organisationId });
  return NextResponse.json(room, { status: 201 });
}

// PUT update room
export async function PUT(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  const body = await request.json();
  await connectMongoDB();
  const updated = await RoomModel.findOneAndUpdate({ _id: id, organisationId: user.organisationId }, body, { new: true });
  return NextResponse.json(updated);
}

// DELETE room
export async function DELETE(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  await connectMongoDB();
  await RoomModel.findOneAndDelete({ _id: id, organisationId: user.organisationId });
  return NextResponse.json({ message: "Room deleted" });
}

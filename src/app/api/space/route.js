import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import SpaceModel from "@/../models/Space";
import BookingModel from "@/../models/Booking";
import { getTokenValue } from "@/utils/tokenHandler";


export async function GET(request) {
  const user = getTokenValue(request);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const propertyId = url.searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
  }

  const spaceId = url.searchParams.get("spaceId");

  await connectMongoDB();

  if (spaceId) {
    const space = await SpaceModel.findOne({
      _id: spaceId,
      propertyId,
    });

    if (!space) {
      return NextResponse.json(null);
    }

    const bookingsCount = await BookingModel.countDocuments({
      spaceId: space._id,
    });
    
    if (bookingsCount) {
    return NextResponse.json({ ...space.toObject(), bookingsCount:bookingsCount });
    }

    return NextResponse.json({ ...space.toObject(), bookingsCount: 0 });
  }

  const spaces = await SpaceModel.find({ propertyId });

  const spacesWithCounts = await Promise.all(
    spaces.map(async (space) => {
      const bookingsCount = await BookingModel.countDocuments({
        spaceId: space._id,
      });
      if( bookingsCount) {  
        return { ...space.toObject(), bookingsCount };
      }else {
        return { ...space.toObject(), bookingsCount: 0 };
      }
    })
  );

  return NextResponse.json(spacesWithCounts);
}


// POST new space
export async function POST(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  await connectMongoDB();
  const space = await SpaceModel.create({ ...body, userId: user.id });
  return NextResponse.json(space, { status: 201 });
}

// PUT update space
export async function PUT(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  const body = await request.json();
  await connectMongoDB();
  const updated = await SpaceModel.findOneAndUpdate({ _id: id, userId: user.id }, body, { new: true });
  return NextResponse.json(updated);
}

// DELETE space
export async function DELETE(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  await connectMongoDB();
  await SpaceModel.findOneAndDelete({ _id: id, userId: user.id });
  return NextResponse.json({ message: "Space deleted" });
}

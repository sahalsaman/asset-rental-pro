import { NextRequest, NextResponse } from "next/server";

import connectMongoDB from "@/../database/db";
import PropertyModel from "@/../models/Property";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";



// GET all properties for logged-in user
export async function GET(request) {
  try {
    const user = getTokenValue(request);

    if (!user.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const propertyId = new URL(request.url).searchParams.get("propertyId");

    await connectMongoDB();
    if (propertyId) {
      const property = await PropertyModel.find({ _id: propertyId, organisationId: user.organisationId });
      return NextResponse.json(property[0] || null);
    } else {
      if (user.role === UserRoles.MANAGER) {
        const properties = await PropertyModel.find({
          organisationId: user.organisationId,
          managers: user.id,
          deleted: false,
          disabled: false
        })
        return NextResponse.json(properties);
      } else {
        const properties = await PropertyModel.find({ organisationId: user.organisationId });
        return NextResponse.json(properties);
      }

    }
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch properties", details: err.message },
      { status: 500 }
    );
  }
}

// POST new property
export async function POST(request) {
  const user = getTokenValue(request);
  if (!user?.organisationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();
  const body = await request.json();
  try {
    const property = await PropertyModel.create({
      ...body,
      organisationId: user.organisationId,
    });
    return NextResponse.json(
      { message: "Property added", property },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add property", details: err.message },
      { status: 400 }
    );
  }
}

// PUT update property by id (only if owned by user)
export async function PUT(request) {
  const user = getTokenValue(request);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
  }

  await connectMongoDB();
  const body = await request.json();
  try {
    const updated = await PropertyModel.findOneAndUpdate(
      { _id: id, organisationId: user.organisationId }, // ensure ownership
      body,
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }
    return NextResponse.json({ message: "Property updated", updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update property", details: err.message },
      { status: 400 }
    );
  }
}

// DELETE property by id (only if owned by user)
export async function DELETE(request) {
  const user = getTokenValue(request);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
  }

  try {
    await connectMongoDB();
    const deleted = await PropertyModel.findOneAndDelete({
      _id: id,
      organisationId: user.organisationId, // ensure ownership
    });
    if (!deleted) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }
    return NextResponse.json({ message: "Property deleted" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete property", details: err.message },
      { status: 500 }
    );
  }
}

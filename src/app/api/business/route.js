import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { BusinessModel } from "@/../models/Business";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionStatus, UserRoles } from "@/utils/contants";

export async function GET(request) {
  try {

    const user = getTokenValue(request);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== UserRoles.ADMIN && !user.businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectMongoDB();

    if (user.role == UserRoles.ADMIN) {
      let business_list = await BusinessModel.find().populate('owner', 'firstName lastName countryCode phone _id').lean();
      return NextResponse.json(business_list, { status: 200 });
    }

    if (user.role !== UserRoles.OWNER) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    let business = await BusinessModel.findById(user.businessId).lean();

    return NextResponse.json(business, { status: 200 });
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { message: "Failed to fetch business" },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    let targetId = user.businessId;

    if (user.role === UserRoles.ADMIN) {
      if (!id) {
        return NextResponse.json({ message: "Business ID is required for admin updates" }, { status: 400 });
      }
      targetId = id;
    } else if (user.role !== UserRoles.OWNER) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!targetId) {
      return NextResponse.json({ message: "No business ID found" }, { status: 400 });
    }

    const updated = await BusinessModel.findByIdAndUpdate(targetId, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json({ message: "Failed to update business" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);
    if (!user || user.role !== UserRoles.ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Business ID is required" }, { status: 400 });
    }

    const deleted = await BusinessModel.findByIdAndUpdate(id, { deleted: true }, { new: true });

    if (!deleted) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Business deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting business:", error);
    return NextResponse.json({ message: "Failed to delete business" }, { status: 500 });
  }
}

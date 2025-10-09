// app/api/managers/route.ts
import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import UserModel from "@/../models/User";
import { OrganisationModel } from "@/../models/Organisation";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";
import PropertyModel from "../../../../models/Property";

// 📍 GET all managers for current org
export async function GET(request) {
  try {
    await connectMongoDB();
    const user = getTokenValue(request);

    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role == UserRoles.MANAGER) {
    return NextResponse.json({role:UserRoles.MANAGER});
    }

    const managers = await UserModel.find({
      organisationId: user.organisationId,
      role: UserRoles.MANAGER,
    }).populate('properties');

    return NextResponse.json({managers:managers,role:UserRoles.OWNER});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📍 POST (Add Manager)
export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();
    const user = getTokenValue(request);

    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organisationId = user.organisationId;
    const { firstName, lastName, phone, properties, countryCode } = body;

    if (!firstName || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newManager = await UserModel.create({
      firstName,
      lastName,
      phone,
      countryCode: countryCode || "+91",
      organisationId,
      properties: properties || [],
      role: UserRoles.MANAGER,
    });

    if (properties && properties.length > 0) {
      properties.forEach(async (propertyId) => {
        await PropertyModel.findByIdAndUpdate(propertyId, {
          $addToSet: { managers: newManager._id },
        });
      })
    }


    return NextResponse.json(newManager, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📍 PUT (Update Manager)
export async function PUT(request) {
  try {
    await connectMongoDB();
    const user = getTokenValue(request);

    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { managerId, firstName, lastName, phone, properties, countryCode } = body;

    if (!managerId) {
      return NextResponse.json({ error: "Manager ID is required" }, { status: 400 });
    }

    const existingManager = await UserModel.findOne({
      _id: managerId,
      organisationId: user.organisationId,
      role: UserRoles.MANAGER,
    });

    if (!existingManager) {
      return NextResponse.json({ error: "Manager not found or unauthorized" }, { status: 404 });
    }

    // ✅ Update allowed fields
    if (firstName !== undefined) existingManager.firstName = firstName;
    if (lastName !== undefined) existingManager.lastName = lastName;
    if (phone !== undefined) existingManager.phone = phone;
    if (countryCode !== undefined) existingManager.countryCode = countryCode;
    if (properties !== undefined) existingManager.properties = properties;
    if (properties && properties.length > 0) {
      properties.forEach(async (propertyId) => {
        await PropertyModel.findByIdAndUpdate(propertyId, {
          $addToSet: { managers: existingManager._id },
        });
      })
    }

    await existingManager.save();

    return NextResponse.json(
      { message: "Manager updated successfully", manager: existingManager },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

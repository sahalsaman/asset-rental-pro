// app/api/managers/route.ts
import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import UserModel from "@/../models/User";
import { BusinessModel } from "@/../models/Business";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";
import PropertyModel from "../../../../models/Property";
import { defaultData } from "@/utils/data";

// 📍 GET all managers for current business
export async function GET(request) {
  try {
    await connectMongoDB();
    const user = getTokenValue(request);

    if (!user?.businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role == UserRoles.MANAGER) {
      return NextResponse.json({ role: UserRoles.MANAGER });
    }

    const managers = await UserModel.find({
      businessId: user.businessId,
      role: UserRoles.MANAGER,
    }).populate('properties');

    return NextResponse.json({ managers: managers, role: UserRoles.OWNER });
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

    if (!user?.businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const businessId = user.businessId;
    const { firstName, lastName, phone, properties, countryCode } = body;

    if (!firstName || !phone) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newManager = await UserModel.create({
      firstName,
      lastName,
      phone,
      countryCode: countryCode || defaultData.countryCodes,
      businessId,
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

    if (!user?.businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { managerId, firstName, lastName, phone, properties, countryCode } = body;

    if (!managerId) {
      return NextResponse.json({ message: "Manager ID is required" }, { status: 400 });
    }

    const existingManager = await UserModel.findOne({
      _id: managerId,
      businessId: user.businessId,
      role: UserRoles.MANAGER,
    });

    if (!existingManager) {
      return NextResponse.json({ message: "Manager not found or unauthorized" }, { status: 404 });
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

// app/api/admin/user/route.js
import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import UserModel from "@/../models/User";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

// 📍 GET all users for admin
export async function GET(request) {
  try {
    await connectMongoDB();
    const user = getTokenValue(request);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== UserRoles.ADMIN) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await UserModel.find().select("-password").sort({ createdAt: -1 }).lean();
    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📍 UPDATE user status
export async function PUT(request) {
  try {
    await connectMongoDB();
    const user = getTokenValue(request);

    if (!user || user.role !== UserRoles.ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const updated = await UserModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📍 DELETE user
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
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const deleted = await UserModel.findByIdAndUpdate(id, { deleted: true }, { new: true });

    if (!deleted) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
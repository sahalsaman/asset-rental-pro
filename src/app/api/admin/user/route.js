// app/api/managers/route.ts
import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import UserModel from "@/../models/User";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

// 📍 GET all managers for current org
export async function GET(request) {
  try {
    await connectMongoDB();
    const user = getTokenValue(request);

    if (!user?.organisationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role != UserRoles.ADMIN) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await UserModel.find()

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

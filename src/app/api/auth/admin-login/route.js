import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { setTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";
import { OrganisationModel } from "../../../../../models/Organisation";

export async function POST(req) {
  await connectMongoDB();

  const { username, password } = await req.json();

  const user = await UserModel.findOne({ username, password })
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (user.role != UserRoles.ADMIN) {
    return NextResponse.json({ message: "User have not access" }, { status: 403 });
  }

  if (user.disabled) {
    return NextResponse.json({ message: "User account disabled, please contact super admin " }, { status: 403 });
  }

  if (user.deleted) {
    return NextResponse.json({ message: "User account deleted, please contact super admin " }, { status: 403 });
  }


  const org = await OrganisationModel.findById(user.organisationId);
  user.organisationId = org;

  const token = setTokenValue(user);

  return new NextResponse(JSON.stringify({ message: "Login successful", role: user.role }), {
    status: 200,
    headers: {
      "Set-Cookie": `ARP_Token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
    },
  });
}


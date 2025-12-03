import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { setTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";
import { OrganisationModel } from "../../../../../models/Organisation";

export async function POST(req) {
  await connectMongoDB();

  const { phone, otp, countryCode } = await req.json();

  const user = await UserModel.findOne({ phone, countryCode })
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (user.disabled) {
    return NextResponse.json({ message: "User account disabled, please contact rentities team " }, { status: 403 });
  }

  if (user.deleted) {
    return NextResponse.json({ message: "User account deleted, please contact rentities team " }, { status: 403 });
  }

  const isOtpExpired = new Date() > new Date(user.otpExpireTime || 0);
  if (isOtpExpired) {
    return NextResponse.json({ message: "OTP Expired" }, { status: 400 });
  }

  if (user.role !== UserRoles.OWNER && user.role !== UserRoles.MANAGER && user.role !== UserRoles.ADMIN) {
    return NextResponse.json(
      { message: "User does not have access to the app. Please sign up with a different phone number" },
      { status: 403 }
    );
  }

  if (user.otp !== otp && otp !== "111111") { // TEST MODE
    return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
  }

  const org=await OrganisationModel.findById(user.organisationId);
   user.organisationId=org;

  const token = setTokenValue(user);

  return new NextResponse(JSON.stringify({ message: "Login successful", role: user.role }), {
    status: 200,
    headers: {
      "Set-Cookie": `ARP_Token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
    },
  });
}


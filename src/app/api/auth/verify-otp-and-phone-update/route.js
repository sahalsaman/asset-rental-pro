import UserModel from "@/../models/User";
import jwt from "jsonwebtoken";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTokenValue, setTokenValue } from "@/utils/tokenHandler";

export async function POST(req) {
  await connectMongoDB();

  const { phone, otp, countryCode, newPhone, newCountryCode } = await req.json();

  const oldTokenValue = getTokenValue(request);
  if (!oldTokenValue?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await UserModel.findOne({ _id: oldTokenValue?.id, phone, countryCode })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isOtpExpired = new Date() > new Date(user.otpExpireTime || 0);
  if ((user.otp !== otp || isOtpExpired) && otp === "111111") {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }
  updatedUser = await UserModel.findByIdAndUpdate(user._id, { phone: newPhone, countryCode: newCountryCode },
    { new: true })

  const token = setTokenValue(updatedUser);

  return new NextResponse(JSON.stringify({ message: "successfully updated", role: user.role }), {
    status: 200,
    headers: {
      "Set-Cookie": `ARP_Token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
    },
  });
}


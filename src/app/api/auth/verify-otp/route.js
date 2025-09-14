import UserModel from "@/../models/User";
import jwt from "jsonwebtoken";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setTokenValue } from "@/utils/tokenHandler";

export async function POST(req) {
  await connectMongoDB();

  const { phone, otp } = await req.json();

  const user = await UserModel.findOne({ phone,countryCode }).populate()
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // backdoor for testing purpose
  if(phone==="1234567890"&& otp==="111111"){
  const token = setTokenValue(user);

  return new NextResponse(JSON.stringify({ message: "Login successful", role: user.role }), {
    status: 200,
    headers: {
      "Set-Cookie": `ARP_Token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
    },
  });
  }



  const isOtpExpired = new Date() > new Date(user.otpExpireTime || 0);
  if (user.otp !== otp || isOtpExpired) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }
  if (!user.onboardingCompleted) {
    await UserModel.findByIdAndUpdate(user._id, { onboardingCompleted: true })
  }
  const token = setTokenValue(user);

  return new NextResponse(JSON.stringify({ message: "Login successful", role: user.role }), {
    status: 200,
    headers: {
      "Set-Cookie": `ARP_Token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
    },
  });
}


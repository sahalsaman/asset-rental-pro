import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { setTokenValue } from "@/utils/tokenHandler";

export async function POST(req) {
  await connectMongoDB();

  const { phone, otp,countryCode } = await req.json();

  const user = await UserModel.findOne({ phone,countryCode }).populate()
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isOtpExpired = new Date() > new Date(user.otpExpireTime || 0);
  if ((user.otp !== otp || isOtpExpired) &&otp!=="111111") { // TEST MODE
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }
  const token = setTokenValue(user);

  return new NextResponse(JSON.stringify({ message: "Login successful", role: user.role }), {
    status: 200,
    headers: {
      "Set-Cookie": `ARP_Token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
    },
  });
}


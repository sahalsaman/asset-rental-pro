import AuthModel from "@/../models/Auth";
import jwt from "jsonwebtoken";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  await connectMongoDB();

  const { phone, otp } = await req.json();

  const auth = await AuthModel.findOne({ phone }).populate("userId");

  if (!auth) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  console.log(auth, phone, otp);


  const isOtpExpired = new Date() > new Date(auth.otpExpireTime || 0);
  if (auth.otp !== otp || isOtpExpired) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }

  const payload = {
    id: auth._id,
    userId: auth.userId?._id || null,
    phone: auth.phone,
    role: auth.role,
  };


  // const token = jwt.sign(payload, process.env.JWT_SECRET ?? "arp_authTokenKey", {
  //   expiresIn: "7d",
  // });
  const token = 'mock-jwt-token';
  const role = 'user'; // or admin, owner

  cookies().set('token', token, { httpOnly: true, path: '/' });
  cookies().set('role', role, { httpOnly: true, path: '/' });

  return new NextResponse(JSON.stringify({ message: "Login successful", role: auth.role }), {
    status: 200,
    headers: {
      "Set-Cookie": `ARP_Token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
    },
  });
}


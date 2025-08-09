import AuthModel from "@/../models/Auth";
import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectMongoDB();

  const body = await request.json(); 
  const { phone, name } = body;

  if (!phone || !name) {
    return NextResponse.json({ error: "Phone and name are required" }, { status: 400 });
  }

  const existingUser = await AuthModel.findOne({ phone });
  if (existingUser) {
    return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const user = await UserModel.create({
    firstName: name,
    disabled: false,
  });

  await AuthModel.create({
    phone,
    otp,
    otpExpireTime,
    role: "owner",
    disabled: false,
    userId: user._id,
  });

  console.log(`✅ OTP for ${phone}: ${otp}`);

  return NextResponse.json({ message: "OTP sent successfully" }, { status: 201 });
}

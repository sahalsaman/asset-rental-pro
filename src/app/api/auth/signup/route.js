import AuthModel from "@/../models/Auth";
import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  
  await connectMongoDB();

  const { phone, name } = await req.json();
  console.log( "POST /api/auth/signup",phone,name);

  if (!phone || !name) {
    return Response.json({ error: "Phone and name are required" }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ phone });
  if (existingUser) {
    return Response.json({ error: "Phone number already registered" }, { status: 409 });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Create user
  const user = await UserModel.create({
    phone,
    firstName: name,
    // lastName: "",
    // email: "",
    role: "owner",
    disabled: false,
  });

  // Create auth record
  const auth = await AuthModel.create({
    phone,
    otp,
    otpExpireTime,
    role: "owner",
    disabled: false,
    userId: user._id,
  });

  // TODO: Send OTP via SMS gateway
  console.log(`✅ OTP for ${phone}: ${otp}`);

  return NextResponse.json({ message: "OTP sent successfully" }, { status: 201 });
}

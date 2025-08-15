import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectMongoDB();

  const body = await request.json(); 
  const { phone, name } = body;

  if (!name) {
    return NextResponse.json({ error: "User Name is required" }, { status: 400 });
  }

    if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  const existingUser = await UserModel.findOne({ phone });
  if (existingUser) {
    return NextResponse.json({ error: "Phone number already exist" }, { status: 409 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await UserModel.create({    
    firstName: name,
    phone,
    otp,
    otpExpireTime,
    role: "owner",
    disabled: false,
  });

  console.log(`✅ OTP for ${phone}: ${otp}`);

  return NextResponse.json({ message: "OTP sent successfully" }, { status: 201 });
}

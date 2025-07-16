import AuthModel from "@/../models/Auth"; // If you have DB connection helper
import connectMongoDB from "../../../../../database/db"; // Ensure you have a DB connection utility
import { NextResponse } from "next/server";


export async function POST(req) {
  const { phone } = await req.json();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  await connectMongoDB()
  
  let user = await AuthModel.findOne({ phone });

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });

  }
  
  if (user.disabled) {
    return Response.json({ message: "User is disabled" }, { status: 403 });
  }

  user.otp = otp;
  user.otpExpireTime = otpExpireTime;
  await user.save();
  console.log(`🔄 OTP updated for ${phone}: ${otp}`);

  return NextResponse.json({ message: "OTP sent" });
}

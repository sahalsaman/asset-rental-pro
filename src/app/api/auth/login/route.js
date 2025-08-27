import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }

    await connectMongoDB();

    const user = await UserModel.findOne({ phone });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.disabled) {
      return NextResponse.json({ message: "User is disabled" }, { status: 403 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpireTime = new Date(Date.now() + 5 * 60 * 1000);

    await UserModel.findByIdAndUpdate(user._id, {
      $set: {
        otp,
        otpExpireTime,
        lastLogin: new Date(),
      },
    });

    console.log(`🔄 OTP updated for ${phone}: ${otp}`);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ OTP generation error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

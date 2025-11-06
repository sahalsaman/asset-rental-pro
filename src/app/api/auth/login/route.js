import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { sendOTPText } from "@/utils/sendToWhatsApp";

export async function POST(req) {
  try {
    const { phone, countryCode } = await req.json();

    if (!phone) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }
    if (!countryCode) {
      return NextResponse.json({ message: "Country code is required" }, { status: 400 });
    }

    await connectMongoDB();

    const user = await UserModel.findOne({ phone, countryCode });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.disabled) {
      return NextResponse.json({ message: "User accound disabled, please contact rentities team " }, { status: 403 });
    }

    if (user.deleted) {
      return NextResponse.json({ message: "User accound deleted, please contact rentities team " }, { status: 403 });
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await UserModel.findByIdAndUpdate(user._id, {
      $set: {
        otp,
        otpExpireTime,
        lastLogin: new Date(),
      },
    });

    console.log(`🔄 OTP updated for ${phone}: ${otp}`);
    const result = await sendOTPText(countryCode, phone, otp, `${user?.firstName} ${user?.lastName}`)

    return NextResponse.json({
      message: "OTP sent successfully", data: {
        countryCode: countryCode,
        phone: phone,
      }
    }, { status: 201 });
  } catch (err) {
    console.error("❌ OTP generation error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

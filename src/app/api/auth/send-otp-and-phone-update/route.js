import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone, countryCode, newPhone, newCountryCode } = await req.json();

    if (!phone || !newPhone) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }
    if (!countryCode || !newCountryCode) {
      return NextResponse.json({ message: "Country code is required" }, { status: 400 });
    }

    await connectMongoDB();

    const oldTokenValue = getTokenValue(request);
    if (!oldTokenValue?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findOne({ _id: oldTokenValue?.id, phone, countryCode })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    console.log(`🔄 OTP updated for ${newPhone}: ${otp}`);
    // const result = await sendOTPText(countryCode,phone,otp,user?.firstName)

    return NextResponse.json({
      message: "OTP sent successfully", data: {
        countryCode: newCountryCode,
        phone: newPhone,
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

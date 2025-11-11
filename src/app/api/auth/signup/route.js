import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { OrganisationModel } from "../../../../../models/Organisation";
import { SubscriptionBillingCycle, SubscritptionStatus, UserRoles } from "@/utils/contants";
import { subscription_plans } from "@/utils/data";
import { sendOTPText } from "@/utils/sendToWhatsApp";

export async function POST(request) {
  await connectMongoDB();

  const body = await request.json();
  const { phone, countryCode, name, organisationName, lastName } = body;

  if (!name) {
    return NextResponse.json({ message: "User Name is required" }, { status: 400 });
  }

  if (!phone) {
    return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
  }

  if (!countryCode) {
    return NextResponse.json({ message: "Country code is required" }, { status: 400 });
  }

  if (!organisationName) {
    return NextResponse.json({ message: "Organisation Name is required" }, { status: 400 });
  }

  const existingUser = await UserModel.findOne({ phone });
  if (existingUser) {
    return NextResponse.json({ message: "Phone number already exist" }, { status: 409 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const newUser = await UserModel.create({
    firstName: name,
    lastName: lastName,
    phone,
    countryCode,
    otp,
    otpExpireTime,
    role: UserRoles.OWNER,
    disabled: false,
  });

  const selected_plan = subscription_plans.find((i) => i.id === "arp_subscription_trial");

  const startDate = new Date();
  // const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const subscription = {
    plan: selected_plan.plan,
    planId: selected_plan.id,
    status: SubscritptionStatus.FREE,
    startDate,
    // endDate,
    billingCycle: selected_plan.billingCycle || SubscriptionBillingCycle.MONTHLY,
    unitPrice: selected_plan.amount,
    paymentMethod: "free",
  };


  const org = await OrganisationModel.create({
    name: organisationName,
    owner: newUser._id,
    subscription,
  });

  await UserModel.findByIdAndUpdate(newUser._id, { organisationId: org?._id })

  console.log(`✅ OTP for ${countryCode + phone}: ${otp}`);
  await sendOTPText(countryCode, phone, otp, newUser?.firstName + " " + newUser?.lastName)

  return NextResponse.json({
    message: "OTP sent successfully", data: {
      countryCode: countryCode,
      phone: phone,
    }
  }, { status: 201 });
}

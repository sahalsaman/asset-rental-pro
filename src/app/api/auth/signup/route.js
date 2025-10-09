import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { OrganisationModel } from "../../../../../models/Organisation";
import { UserRoles } from "@/utils/contants";

export async function POST(request) {
  await connectMongoDB();

  const body = await request.json(); 
  const { phone,countryCode, name ,organisationName, lastName} = body;

  if (!name) {
    return NextResponse.json({ error: "User Name is required" }, { status: 400 });
  }

    if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  if (!countryCode) {
    return NextResponse.json({ error: "Country code is required" }, { status: 400 });
  }

  if (!organisationName) {
    return NextResponse.json({ error: "Organisation Name is required" }, { status: 400 });
  }

  const existingUser = await UserModel.findOne({ phone });
  if (existingUser) {
    return NextResponse.json({ error: "Phone number already exist" }, { status: 409 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const newUser=await UserModel.create({    
    firstName: name,
    lastName:lastName,
    phone,
    countryCode,
    otp,
    otpExpireTime,
    role: UserRoles.OWNER,
    disabled: false,
  });

  const org=await OrganisationModel.create({    
    name: organisationName,
    owner: newUser._id
  });

  await UserModel.findByIdAndUpdate(newUser._id,{organisationId:org?._id})

  console.log(`✅ OTP for ${countryCode+phone}: ${otp}`);
      // const result = await sendOTPText(countryCode,phone,otp,user?.firstName)

  return NextResponse.json({ message: "OTP sent successfully",data:{
    otp: otp,
    countryCode: countryCode,
    phone: phone,
  } }, { status: 201 });
}

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/../database/db";
import { getTokenValue } from "@/utils/tokenHandler";
import UserModel from "../../../../../models/User";

// Helper to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}



export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    // const user = getTokenValue(request);
    // if (!user?.organisationId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    if (!body.phone) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({
      phone: body.phone,
      deleted: false,
      disabled: false
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this phone number already exists", user: existingUser },
        { status: 200 }
      );
    }

    

    const userData = await UserModel.create({
      ...body,
    });

    return NextResponse.json(
      { message: "User created", userData },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to add booking", details: err.message },
      { status: 400 }
    );
  }
}


export async function PUT(request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    // const user = getTokenValue(request);
    // if (!user?.organisationId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    if (!body.phone) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }


    const userData = await UserModel.findOneAndUpdate({ phone: body.phone }, {
      ...body,
    });

    return NextResponse.json(
      { message: "User created", userData },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to add booking", details: err.message },
      { status: 400 }
    );
  }
}
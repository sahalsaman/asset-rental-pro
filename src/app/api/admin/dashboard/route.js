import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import {OrganisationModel} from "../../../../../models/Organisation";
import BookingModel from "../../../../../models/Booking";
import UserModel from "../../../../../models/User";
import PropertyModel from "../../../../../models/Property";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

export async function GET(request) {
  try {
    const user = getTokenValue(request);

    if (!user?.organisationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const organisationCount = await OrganisationModel.countDocuments({
      disabled: false,
      deleted: false,
    });

    const vendorCount = await UserModel.countDocuments({
      disabled: false,
      deleted: false,
      role: UserRoles.OWNER
    });

    const userCount = await UserModel.countDocuments({
      disabled: false,
      deleted: false,
      role: UserRoles.USER
    });

    const propertyCount = await PropertyModel.countDocuments({
      disabled: false,
      deleted: false,
    });

    const bookingCount = await BookingModel.countDocuments({
      disabled: false,
      deleted: false,
    });


    return NextResponse.json({
      organisationCount,
      vendorCount,
      userCount,
      propertyCount,
      bookingCount,
      subcriptionPaymentLastMonth: {
        total: 0,
        count: 0
      }
    });
  } catch (err) {
    // console.log(err);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data", details: err.message },
      { status: 500 }
    );
  }
}

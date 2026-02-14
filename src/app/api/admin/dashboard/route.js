import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { BusinessModel } from "../../../../../models/Business";
import BookingModel from "../../../../../models/Booking";
import UserModel from "../../../../../models/User";
import PropertyModel from "../../../../../models/Property";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

export async function GET(request) {
  try {
    const user = getTokenValue(request);

    if (!user || user.role !== UserRoles.ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const businessCount = await BusinessModel.countDocuments({
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

    // --- Growth Trends (Last 6 Months) ---
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const businessTrends = await BusinessModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          deleted: false
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const userTrends = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          deleted: false,
          role: UserRoles.USER
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    return NextResponse.json({
      businessCount,
      vendorCount,
      userCount,
      propertyCount,
      bookingCount,
      subcriptionPaymentLastMonth: {
        total: 0,
        count: 0
      },
      trends: {
        business: businessTrends,
        users: userTrends
      }
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch dashboard data", details: err.message },
      { status: 500 }
    );
  }
}

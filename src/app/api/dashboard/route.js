import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import RoomModel from "@/../models/Room";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import { getTokenValue } from "@/utils/tokenHandler";
import { BookingStatus, RoomStatus } from "@/utils/contants";

export async function GET(request) {
  try {
    const user = getTokenValue(request);

    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const roomCount = await RoomModel.countDocuments({
      organisationId: user.organisationId,
    });

    const availableRoomsCount = await RoomModel.countDocuments({
      organisationId: user.organisationId,
      status:RoomStatus.AVAILABLE
    });

    const enrollmentsCount = await BookingModel.countDocuments({
      organisationId: user.organisationId,
      status:BookingStatus.CHECKED_IN
    });


    // Get the start and end of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // e.g., 2025-09-01 00:00:00
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1); // e.g., 2025-10-01 00:00:00

    // Total Invoice Amount (This Month)
    const totalInvoiceAmount = await InvoiceModel.aggregate([
      {
        $match: {
          organisationId: user.organisationId,
          deleted: false,
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }, // Sum the 'amount' field
        },
      },
    ]);

    // Total Received Amount (This Month)
    const totalReceivedAmount = await InvoiceModel.aggregate([
      {
        $match: {
          organisationId: user.organisationId,
          deleted: false,
          'payments.date': {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $unwind: '$payments', // Unwind the payments array
      },
      {
        $match: {
          'payments.date': {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$payments.amount' }, // Sum the payment amounts
        },
      },
    ]);




    return NextResponse.json({
      total_rooms: roomCount,
      available_rooms: availableRoomsCount,
      enrollments: enrollmentsCount,
      totalInvoiceAmount: totalInvoiceAmount,
      totalReceivedAmount: totalReceivedAmount
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data", details: err.message },
      { status: 500 }
    );
  }
}

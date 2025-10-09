import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import RoomModel from "@/../models/Room";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import { getTokenValue } from "@/utils/tokenHandler";
import { BookingStatus, InvoiceStatus, RoomStatus } from "@/utils/contants";

export async function GET(request) {
  try {
    const user = getTokenValue(request);

    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prop = request.nextUrl.searchParams.get("prop");

    if (!prop) {
      return NextResponse.json({ error: "Select valid property" }, { status: 404 });
    }

    await connectMongoDB();

    const roomCount = await RoomModel.countDocuments({
      organisationId: user.organisationId,
      propertyId: prop
    });

    const availableRoomsCount = await RoomModel.countDocuments({
      organisationId: user.organisationId,
      status: RoomStatus.AVAILABLE,
      propertyId: prop
    });

    const enrollmentsCount = await BookingModel.countDocuments({
      organisationId: user.organisationId,
      status: BookingStatus.CHECKED_IN,
      propertyId: prop
    });

    const noticePeriod = await BookingModel.countDocuments({
      organisationId: user.organisationId,
      status: BookingStatus.CHECKED_IN,
      checkOut: { $gt: new Date() },
      propertyId: prop
    });


    // Get the start and end of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // e.g., 2025-09-01 00:00:00
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1); // e.g., 2025-10-01 00:00:00

    // Total Invoice Amount (This Month)
    const totalInvoices = await InvoiceModel.find(
      {
        organisationId: user.organisationId,
        propertyId: prop,
        deleted: false,
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },

      },

    );

    const { totalInvoiceAmount, totalReceivedAmount } = totalInvoices.reduce(
      (acc, inv) => {
        acc.totalInvoiceAmount += inv.amount;
        if (inv.status === InvoiceStatus.PAID) acc.totalReceivedAmount += inv.amount;
        return acc;
      },
      { totalInvoiceAmount: 0, totalReceivedAmount: 0 }
    );



    return NextResponse.json({
      total_rooms: roomCount,
      available_rooms: availableRoomsCount,
      enrollments: enrollmentsCount,
      totalInvoiceAmount: totalInvoiceAmount,
      totalReceivedAmount: totalReceivedAmount,
      noticePeriod: noticePeriod
    });
  } catch (err) {
    // console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data", details: err.message },
      { status: 500 }
    );
  }
}

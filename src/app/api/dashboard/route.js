import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import PropertyModel from "@/../models/Property";
import RoomModel from "@/../models/Room";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import { getTokenValue } from "@/utils/tokenHandler";
import { BookingStatus, InvoiceStatus, PropertyStatus, RoomStatus } from "@/utils/contants";

export async function GET(request) {
  try {
    const user = getTokenValue(request);

    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const propertiesCount = await PropertyModel.countDocuments({
      organisationId: user.organisationId,
      status:PropertyStatus.ACTIVE
    });

    const availableRoomsCount = await RoomModel.countDocuments({
      organisationId: user.organisationId,
      status:RoomStatus.AVAILABLE
    });

    const partiallyAvailable = await RoomModel.countDocuments({
      organisationId: user.organisationId,
      status:RoomStatus.PARTIALLYOCCUPIED
    });

    const enrollmentsCount = await BookingModel.countDocuments({
      organisationId: user.organisationId,
      status:BookingStatus.CHECKED_IN
    });

    // Calculate monthly received (sum of invoices paid in current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyInvoices = await InvoiceModel.aggregate([
      {
        $match: {
          organisationId: user.organisationId,
          status: InvoiceStatus.PAID,
          createdAt: { $gte: firstDay, $lte: lastDay },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$amount" } },
      },
    ]);

    const monthlyReceived =
      monthlyInvoices.length > 0 ? monthlyInvoices[0].total : 0;

    return NextResponse.json({
      properties: propertiesCount,
      availableRooms: availableRoomsCount,
      enrollments: enrollmentsCount,
      monthlyReceived,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data", details: err.message },
      { status: 500 }
    );
  }
}

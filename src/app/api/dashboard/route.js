import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import connectMongoDB from "@/../database/db";
import UnitModel from "@/../models/Unit";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import { getTokenValue } from "@/utils/tokenHandler";
import { BookingStatus, InvoiceStatus, UnitStatus } from "@/utils/contants";

export async function GET(request) {
  try {
    const user = getTokenValue(request);

    if (!user?.businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const prop = request.nextUrl.searchParams.get("prop");

    if (!prop) {
      return NextResponse.json({ message: "Select valid property" }, { status: 404 });
    }

    await connectMongoDB();

    const unitCount = await UnitModel.countDocuments({
      businessId: user.businessId,
      propertyId: prop
    });

    const availableUnitsCount = await UnitModel.countDocuments({
      businessId: user.businessId,
      status: UnitStatus.AVAILABLE,
      propertyId: prop
    });

    const enrollmentsCount = await BookingModel.countDocuments({
      businessId: user.businessId,
      status: BookingStatus.CHECKED_IN,
      propertyId: prop
    });

    const noticePeriod = await BookingModel.countDocuments({
      businessId: user.businessId,
      status: BookingStatus.CHECKED_IN,
      checkOut: { $gt: new Date() },
      propertyId: prop
    });


    // Get the start and end of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Total Invoice Amount (This Month)
    const totalInvoicesMonth = await InvoiceModel.find({
      businessId: user.businessId,
      propertyId: prop,
      deleted: false,
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const { totalInvoiceAmount, totalReceivedAmount } = totalInvoicesMonth.reduce(
      (acc, inv) => {
        acc.totalInvoiceAmount += inv.amount;
        if (inv.status === InvoiceStatus.PAID) acc.totalReceivedAmount += inv.amount;
        return acc;
      },
      { totalInvoiceAmount: 0, totalReceivedAmount: 0 }
    );

    // --- Chart Data Aggregation (Last 6 Months) ---
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Monthly Revenue
    const revenueDataRaw = await InvoiceModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(user.businessId),
          propertyId: new Types.ObjectId(prop),
          status: InvoiceStatus.PAID,
          deleted: false,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Monthly Bookings
    const bookingDataRaw = await BookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(user.businessId),
          propertyId: new Types.ObjectId(prop),
          deleted: false,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const monthLabel = monthNames[d.getMonth()];

      const rev = revenueDataRaw.find(r => r._id.year === year && r._id.month === month)?.total || 0;
      const bks = bookingDataRaw.find(b => b._id.year === year && b._id.month === month)?.count || 0;

      chartData.push({
        name: monthLabel,
        revenue: rev,
        bookings: bks
      });
    }

    // --- Recent Activities ---
    const recentBookings = await BookingModel.find({
      businessId: user.businessId,
      propertyId: prop,
      deleted: false
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");

    const recentInvoices = await InvoiceModel.find({
      businessId: user.businessId,
      propertyId: prop,
      deleted: false
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = [
      ...recentBookings.map(b => ({
        id: b._id,
        type: "booking",
        title: `New Booking: ${b.code}`,
        description: `Booking for unit ${b.unitId} by ${b.userId?.name || "Guest"}`,
        amount: b.amount,
        date: b.createdAt
      })),
      ...recentInvoices.map(inv => ({
        id: inv._id,
        type: "invoice",
        title: `Invoice ${inv.invoiceId}`,
        description: `Invoice status: ${inv.status}`,
        amount: inv.amount,
        date: inv.createdAt
      }))
    ]
      .sort((a, b) => b.date - a.date)
      .slice(0, 8);


    return NextResponse.json({
      total_units: unitCount,
      available_units: availableUnitsCount,
      enrollments: enrollmentsCount,
      totalInvoiceAmount: totalInvoiceAmount,
      totalReceivedAmount: totalReceivedAmount,
      noticePeriod: noticePeriod,
      chartData: chartData,
      activities: activities
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data", details: err.message },
      { status: 500 }
    );
  }
}

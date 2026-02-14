import { NextRequest, NextResponse } from "next/server";

import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import { getTokenValue } from "../../../utils/tokenHandler"
import InvoiceModel from "../../../../models/Invoice";
import { UserRoles } from "@/utils/contants";

export async function GET(request) {
  try {
    const user = getTokenValue(request);

    if (!user || (user.role !== UserRoles.ADMIN && !user.businessId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const propertyId = searchParams.get("propertyId");
    const status = searchParams.get("status");

    await connectMongoDB();

    let filter = { deleted: false };

    // Only filter by businessId if the user is not an Admin
    if (user.role !== UserRoles.ADMIN) {
      filter.businessId = user.businessId;
    }

    if (propertyId) {
      filter.propertyId = propertyId;
    }

    if (status) {
      filter.status = status;
    }


    if (page === "booking") {
      const bookings = await BookingModel.find(filter).populate("userId").sort({ createdAt: -1 });
      return NextResponse.json(bookings);
    } else if (page === "invoice") {
      const invoices = await InvoiceModel.find(filter)
        .populate({
          path: "bookingId",
          populate: [
            { path: "userId" },
          ],
        })
        .sort({ createdAt: -1 })
        .lean(false);
      return NextResponse.json(invoices);
    }

    return NextResponse.json();
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch bookings", details: err.message },
      { status: 500 }
    );
  }
}

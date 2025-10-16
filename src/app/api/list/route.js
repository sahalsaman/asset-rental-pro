import { NextRequest, NextResponse } from "next/server";

import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import { getTokenValue } from "../../../utils/tokenHandler"
import InvoiceModel from "../../../../models/Invoice";
import { InvoiceStatus } from "@/utils/contants";


export async function GET(request) {
  try {

    const user = getTokenValue(request);

    if (!user.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const organisationId = user.organisationId;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const propertyId = searchParams.get("propertyId");
      const status = searchParams.get("status")

    await connectMongoDB();
    let filter = {
      organisationId,
      propertyId,
    };

    if(status?.length){
      filter.status=status
    }


    if (page === "booking") {
      const bookings = await BookingModel.find(filter).sort({ createdAt: -1 });
      return NextResponse.json(bookings);
    } else if (page === "invoice") {
      const invoices = await InvoiceModel.find(filter)
        .populate("bookingId")
        .sort({ createdAt: -1 })
        .lean(false);
      return NextResponse.json(invoices);
    }

    return NextResponse.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: err.message },
      { status: 500 }
    );
  }
}

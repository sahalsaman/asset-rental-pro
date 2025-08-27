import { NextRequest, NextResponse } from "next/server";

import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import PropertyModel from "@/../models/Property";
import  {getTokenValue}  from "../../../utils/tokenHandler"
import InvoiceModel from "../../../../models/Invoice";


export async function GET(request) {
    try {
  
       const user = getTokenValue(request);
  
      if (!user.organisationId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const organisationId = user.organisationId;
  
      const { searchParams } = new URL(request.url);
      const page = searchParams.get("page");
  
      await connectMongoDB();
      let filter = {};
      if (page === "booking") {
        const bookings = await BookingModel.find({organisationId})
        return NextResponse.json(bookings);
      }else if (page === "invoice") {
        const invoices = await InvoiceModel.find({organisationId})
        return NextResponse.json(invoices);
      }
  
      // Fetch bookings with populated data
  
      return NextResponse.json();
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to fetch bookings", details: err.message },
        { status: 500 }
      );
    }
  }
  
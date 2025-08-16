import { NextRequest, NextResponse } from "next/server";

import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import PropertyModel from "@/../models/Property";
import  {getTokenValue}  from "../../../utils/tokenHandler"


export async function GET(request) {
    try {
  
       const user = getTokenValue(request);
      console.log(user);
  
      if (!user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const userId = user.id;
  
      const { searchParams } = new URL(request.url);
      const page = searchParams.get("page");
  
      await connectMongoDB();
      let filter = {};
      if (page === "booking") {
        // Get properties owned by the logged-in user
        const properties = await PropertyModel.find({ userId }).select("_id");
        const propertyIds = properties.map((p) => p._id);
        filter.propertyId = { $in: propertyIds };
      }
  
  
      // Fetch bookings with populated data
      const bookings = await BookingModel.find(filter)
  
      return NextResponse.json(bookings);
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to fetch bookings", details: err.message },
        { status: 500 }
      );
    }
  }
  
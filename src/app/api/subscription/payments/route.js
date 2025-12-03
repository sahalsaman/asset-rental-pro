import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import {  SubscriptionPaymentModel } from "@/../models/Organisation";

export async function GET(req) {
  try {

    const { searchParams } = new URL(req.url);

    const propertyId = searchParams.get("propertyId");
    const year = Number(searchParams.get("year"))?? new Date().getFullYear();

    if (!propertyId ||!year) {
      return NextResponse.json(
        { error: "Missing propertyId OR year" },
        { status: 400 }
      );
    }

    // Date range filter
    const start = new Date(year, 0, 1);      // Jan 1
    const end = new Date(year + 1, 0, 1);


    await connectMongoDB();

    const data = await SubscriptionPaymentModel.find({
      organisationId: propertyId,
      startDate: { $gte: start, $lt: end },
    }).sort({ startDate: -1 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

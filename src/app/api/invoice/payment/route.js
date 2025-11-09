import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectMongoDB from "@/../database/db";
import InvoiceModel from "@/../models/Invoice";
import { env } from "../../../../../environment";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { invoiceId } = await req.json();

    const invoice = await InvoiceModel.findById(invoiceId)

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: invoice.amount * 100, // amount in paise
      currency: "INR",
      receipt: invoice.invoiceId,
      notes: {
        organisationId: invoice.organisationId,
        propertyId: invoice.propertyId,
        bookingId: invoice.bookingId,
        unitId: invoice.unitId.toString(),
        invoiceId: invoice._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: invoice.amount,
      invoiceId: invoice._id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


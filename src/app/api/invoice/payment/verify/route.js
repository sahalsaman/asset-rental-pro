import { NextResponse } from "next/server";
import crypto from "crypto";
import connectMongoDB from "@/../database/db";
import InvoiceModel from "@/../models/Invoice";
import { env } from "../../../../../../environment";

export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId } = body;

    const generated_signature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await InvoiceModel.findByIdAndUpdate(invoiceId, {
      status: "paid",
      paymentId: razorpay_payment_id,
      paidAt: new Date(),
      paymentGateway: "razorpay",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

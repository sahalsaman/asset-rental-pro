import { NextResponse } from "next/server";
import crypto from "crypto";
import connectMongoDB from "@/../database/db";
import InvoiceModel from "@/../models/Invoice";
import { InvoiceStatus } from "@/utils/contants";
import { env } from "../../../../../environment";
import { OrganisationModel } from "../../../../../models/Organisation";

export async function POST(req) {
  try {
    await connectMongoDB();

    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ message: "Missing signature" }, { status: 400 });
    }

    // 🔐 Verify signature using your Razorpay webhook secret
    const secret = env.RAZORPAY_WEBHOOK_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid Razorpay signature!");
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    const data = JSON.parse(body);
    const { event, payload, payment, notes } = data;

    if (event === "payment_link.paid") {
      const invoiceId = payload.payment_link.entity.receipt;
      const { organisationId } = notes;

      // ✅ Update invoice as PAID
      await InvoiceModel.findOneAndUpdate(
        { invoiceId, organisationId },
        {
          status: InvoiceStatus.PAID,
          balance: 0,
          paidAt: new Date(),
          paymentId: payment.id,

        }
      );
      // await OrganisationModel.findByIdAndUpdate(organisationId, {
      //   $inc: { pendingPayout: payment.amount / 100 },
      // });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Razorpay will make POST requests to this endpoint

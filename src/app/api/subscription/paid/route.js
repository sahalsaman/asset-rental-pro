import { NextResponse } from "next/server";
import crypto from "crypto";
import connectMongoDB from "@/../database/db";
import { OrganisationModel, SubscriptionPaymentModel } from "@/../models/Organisation";
import { env } from "../../../../../environment";
import { subscription_plans } from "@/utils/data";
import { SubscritptionBillingCycle, SubscritptionStatus } from "@/utils/contants";

export async function PUT(req) {
  try {
    await connectMongoDB();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      organisationId,
      plan,
    } = await req.json();

    const generated_signature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

    const selected_plan = subscription_plans.find((i) => i.id === plan);
    if (!selected_plan)
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const startDate = new Date();
    const endDate = new Date();
    if (selected_plan.billingCycle === SubscritptionBillingCycle.YEARLY)
      endDate.setFullYear(endDate.getFullYear() + 1);
    else endDate.setMonth(endDate.getMonth() + 1);

    const org = await OrganisationModel.findById(organisationId);
    if (!org) return NextResponse.json({ error: "Organisation not found" }, { status: 404 });

    org.subscription = {
      plan: selected_plan.name,
      status: SubscritptionStatus.ACTIVE,
      startDate,
      endDate,
      billingCycle: selected_plan.billingCycle || SubscritptionBillingCycle.MONTHLY,
      amount: selected_plan.amount,
      paymentMethod: "razorpay",
      lastPaymentDate: startDate,
      nextBillingDate: endDate,
      trialCompleted: true,
      usageLimits: {
        property: selected_plan.total_properties || 0,
        rooms: selected_plan.total_rooms || 0,
        bookings: selected_plan.total_bookings || 0,
      },
    };

    await org.save();

    await SubscriptionPaymentModel.create({
      organisationId,
      subscriptionId: organisationId,
      plan: selected_plan.name,
      status: SubscritptionStatus.ACTIVE,
      startDate,
      endDate,
      amount: selected_plan.amount,
      paymentMethod: "razorpay",
      razorpay_orderId: razorpay_order_id,
      razorpay_paymentId: razorpay_payment_id,
      razorpay_signature,
      razorpay_status: "captured",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /subscription error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

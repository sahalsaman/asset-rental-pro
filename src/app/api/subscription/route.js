import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectMongoDB from "@/../database/db";
import { OrganisationModel, SubscriptionPaymentModel } from "@/../models/Organisation";
import { env } from "../../../../environment";
import { subscription_plans } from "@/utils/data";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionBillingCycle, SubscritptionPaymentStatus, SubscritptionStatus } from "@/utils/contants";
import { generateRazorpayLinkForSubscription } from "@/utils/razerPay";

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

// 🔹 Get current subscription
export async function GET(req) {
  await connectMongoDB();
  const user = getTokenValue(req);

  if (!user?.organisationId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await OrganisationModel.findById(user.organisationId);
  return NextResponse.json(org?.subscription || { message: "Not Activated" });
}

// 🔹 Update subscription
export async function POST(req) {
  try {
    await connectMongoDB();
    const user = getTokenValue(req);

    if (!user?.organisationId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json();
    const selected_plan = subscription_plans.find((i) => i.id === plan);
    if (!selected_plan) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const startDate = new Date();
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const subscription = {
      plan: selected_plan.name,
      planId: selected_plan.id,
      status: selected_plan=="arp_subcription_trial"?SubscritptionStatus.TRIAL:SubscritptionStatus.PENDING,
      startDate,
      endDate,
      billingCycle: selected_plan.billingCycle || SubscritptionBillingCycle.MONTHLY,
      amount: selected_plan.amount,
      paymentMethod: "razorpay",
      usageLimits: {
        property: selected_plan.total_properties || 0,
        units: selected_plan.total_units || 0,
        bookings: selected_plan.total_bookings || 0,
      },
    };

    await OrganisationModel.findByIdAndUpdate(
      user.organisationId,
      { subscription },
      { new: true }
    );

    // Skip Razorpay for trial
    if (selected_plan.id === "arp_subcription_trial") {
      return NextResponse.json({ success: true, subscription });
    }

    // Razorpay order
    const order = await generateRazorpayLinkForSubscription(
      selected_plan.amount,
      user.organisationId
    );

    await SubscriptionPaymentModel.create({
      organisationId: user.organisationId,
      subscriptionId: user.organisationId,
      plan: selected_plan.name,
      status: SubscritptionPaymentStatus.PENDING,
      startDate,
      amount: selected_plan.amount,
      paymentMethod: "razorpay",
      razorpay_orderId: order.id,
    });

    return NextResponse.json({
      orderId: order.id,
      key: razorpay.key_id,
      subscription,
    });
  } catch (error) {
    console.error("POST /subscription error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { OrganisationModel } from "@/../models/Organisation";
import { env } from "../../../../environment";
import { subscription_plans } from "@/utils/data";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscriptionBillingCycle, SubscritptionStatus, TransactionType } from "@/utils/contants";


// 🔹 Get current subscription
export async function GET(req) {
  await connectMongoDB();
  const user = getTokenValue(req);

  if (!user?.organisationId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const org = await OrganisationModel.findById(user.organisationId);
  return NextResponse.json(org?.subscription || { message: "Not Activated" });
}

// 🔹 Update subscription
export async function PUT(req) {
  try {
    await connectMongoDB();
    const user = getTokenValue(req);

    if (!user?.organisationId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json();
    const selected_plan = subscription_plans.find((i) => i.id === plan);
    if (!selected_plan) return NextResponse.json({ message: "Invalid plan" }, { status: 400 });

    const startDate = new Date();

    const subscription = {
      plan: selected_plan.name,
      planId: selected_plan.id,
      status: selected_plan=="arp_subscription_trial"?SubscritptionStatus.FREE:SubscritptionStatus.ACTIVE,
      startDate,
      billingCycle: selected_plan.billingCycle || SubscriptionBillingCycle.MONTHLY,
      unitPrice: selected_plan.amount,
      paymentMethod: TransactionType.RAZORPAY,
    };

    await OrganisationModel.findByIdAndUpdate(
      user.organisationId,
      { subscription },
      { new: true }
    );

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("POST /subscription error:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}

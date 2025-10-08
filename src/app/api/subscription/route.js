import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { OrgSubscriptionModel } from "@/../models/Organisation";
import connectMongoDB from "@/../database/db";
import { razorpay_config } from "../../../utils/config";
import { subscription_plans } from "../../../utils/mock-data";
import { SubscritptionStatus, SubscritptionBillingCycle } from "../../../utils/contants";
import { getTokenValue } from "@/utils/tokenHandler";

const razorpay = new Razorpay({
    key_id: razorpay_config.RAZORPAY_KEY_ID,
    key_secret: razorpay_config.RAZORPAY_KEY_SECRET,
});


export async function GET(req) {
    await connectMongoDB();
    const user = getTokenValue(req);

    if (!user?.organisationId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeSub = await OrgSubscriptionModel.findOne({
        organisation: user.organisationId,
        // status: SubscritptionStatus.ACTIVE,
    }).sort({ createdAt: -1 });

    return NextResponse.json(activeSub || null);
}


export async function POST(req) {
    try {
        await connectMongoDB();
        const user = getTokenValue(req);

        if (!user?.organisationId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { plan } = await req.json();
        const selected_plan = subscription_plans.find((i) => i.id === plan);
        if (!selected_plan) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // 🔍 Check if a pending or trial subscription already exists
        const existingSub = await OrgSubscriptionModel.findOne({
            organisation: user.organisationId,
            status: { $in: [SubscritptionStatus.PENDING, SubscritptionStatus.TRIAL] },
        });

        let subscription = existingSub;

        // 🧾 Create Razorpay order
        const order = await razorpay.orders.create({
            amount: selected_plan.amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        if (existingSub) {
            // 🔁 Update existing pending subscription
            subscription.plan = selected_plan.name;
            subscription.billingCycle =
                selected_plan.billingCycle || SubscritptionBillingCycle.MONTHLY;
            subscription.amount = selected_plan.amount;
            subscription.paymentMethod = "razorpay";
            subscription.razorpay_orderId = order.id;
            subscription.status = SubscritptionStatus.PENDING;
            subscription.usageLimits = {
                property: selected_plan.total_properties || 0,
                rooms: selected_plan.total_rooms || 0,
                bookings: selected_plan.total_bookings || 0,
            };
            await subscription.save();
        } else {
            // 🆕 Create a new subscription record
            subscription = await OrgSubscriptionModel.create({
                organisation: user.organisationId,
                plan: selected_plan.name,
                status: SubscritptionStatus.PENDING,
                startDate: new Date(),
                billingCycle:
                    selected_plan.billingCycle || SubscritptionBillingCycle.MONTHLY,
                amount: selected_plan.amount,
                paymentMethod: "razorpay",
                razorpay_orderId: order.id,
                trialDays:14,
                trialStarted:new Date(),
                trialendDate:new Date(),
                usageLimits: {
                    property: selected_plan.total_properties || 0,
                    rooms: selected_plan.total_rooms || 0,
                    bookings: selected_plan.total_bookings || 0,
                },
            });
        }

        return NextResponse.json({
            orderId: order.id,
            key: razorpay_config.RAZORPAY_KEY_ID,
            subscriptionId: subscription._id,
        });
    } catch (error) {
        console.error("POST /subscription error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}



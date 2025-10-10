import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectMongoDB from "@/../database/db";

import { OrganisationModel, OrgSubscriptionModel, SubscriptionPaymentModel } from "@/../models/Organisation";

import { razorpay_config } from "../../../utils/config";
import { subscription_plans } from "../../../utils/mock-data";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionBillingCycle, SubscritptionStatus } from "@/utils/contants";

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
    }).sort({ createdAt: -1 });

    return NextResponse.json(activeSub || { message: "Not Activated" });
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

        // Check if there's already a pending/trial subscription
        let subscription = await OrgSubscriptionModel.findOne({
            organisation: user.organisationId,
        });

        let freeTrialParams = {};

        if (selected_plan.id == "arp_subcription_trial") {
            if (subscription) {
                subscription.trialDays = 14;
                subscription.trialStarted = new Date();
                subscription.trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14-day trial
                subscription.status = SubscritptionStatus.TRIAL;
            } else {
                freeTrialParams = {
                    trialDays: 14,
                    trialStarted: new Date(),
                    trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
                    status: SubscritptionStatus.TRIAL,
                }
            }
        }

        if (subscription) {
            // Update existing pending subscription
            subscription.plan = selected_plan.name;
            subscription.billingCycle =
                selected_plan.billingCycle || SubscritptionBillingCycle.MONTHLY;
            subscription.amount = selected_plan.amount;
            subscription.paymentMethod = "razorpay";
            subscription.status = selected_plan.id == "arp_subcription_trial" ? SubscritptionStatus.TRIAL : SubscritptionStatus.PENDING;
            subscription.usageLimits = {
                property: selected_plan.total_properties || 0,
                rooms: selected_plan.total_rooms || 0,
                bookings: selected_plan.total_bookings || 0,
            };
            await subscription.save();
        } else {
            // Create new subscription
            subscription = await OrgSubscriptionModel.create({
                organisation: user.organisationId,
                plan: selected_plan.name,
                status: selected_plan.id == "arp_subcription_trial" ? SubscritptionStatus.TRIAL : SubscritptionStatus.PENDING,
                startDate: new Date(),
                billingCycle:
                    selected_plan.billingCycle || SubscritptionBillingCycle.MONTHLY,
                amount: selected_plan.amount,
                paymentMethod: "razorpay",
                trialDays: 14,
                trialStarted: new Date(),
                trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
                usageLimits: {
                    property: selected_plan.total_properties || 0,
                    rooms: selected_plan.total_rooms || 0,
                    bookings: selected_plan.total_bookings || 0,
                },
                ...freeTrialParams
            });
        }

        // Link organisation to this subscription
        await OrganisationModel.findByIdAndUpdate(user.organisationId, {
            $set: { subscription: subscription._id },
        }).exec();

        if (selected_plan.id == "arp_subcription_trial") {
            return NextResponse.json({
                subscriptionId: subscription._id,
            });
        }

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: selected_plan.amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        // Record payment attempt (optional)
        await SubscriptionPaymentModel.create({
            organisation: user.organisationId,
            subscription: subscription._id,
            plan: selected_plan.name,
            status: SubscriptionStatus.PENDING,
            startDate: new Date(),
            amount: selected_plan.amount,
            paymentMethod: "razorpay",
            razorpay_orderId: order.id,
        });

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

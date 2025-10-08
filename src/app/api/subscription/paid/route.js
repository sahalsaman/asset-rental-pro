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


export async function PUT(req) {
    try {
        await connectMongoDB();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, organisationId, plan } =
            await req.json();

        const generated_signature = crypto
            .createHmac("sha256", razorpay_config.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        const selected_plan = subscription_plans.find((i) => i.id === plan);
        if (!selected_plan) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        if (generated_signature === razorpay_signature) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1); // assuming monthly plan

            await OrgSubscriptionModel.findOneAndUpdate(
                { organisation: organisationId },
                {
                    plan: selected_plan.name,
                    status: SubscritptionStatus.ACTIVE,
                    startDate,
                    endDate,
                    billingCycle: selected_plan.billingCycle || SubscritptionBillingCycle.MONTHLY,
                    amount: selected_plan.amount,
                    paymentMethod: "razorpay",
                    razorpay_paymentId: razorpay_payment_id,
                    razorpay_signature,
                    razorpay_status: "captured",
                    lastPaymentDate: startDate,
                    nextBillingDate: endDate,
                    usageLimits: {
                        property: selected_plan.total_properties || 0,
                        rooms: selected_plan.total_rooms || 0,
                        bookings: selected_plan.total_bookings || 0,
                    },
                },
                { new: true }
            );

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("PUT /subscription error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}

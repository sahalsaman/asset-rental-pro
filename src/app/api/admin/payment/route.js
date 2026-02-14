import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { SubscriptionPaymentModel } from "@/../models/Business";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

// 📍 GET all subscription payments for platform admin
export async function GET(request) {
    try {
        await connectMongoDB();
        const user = getTokenValue(request);

        if (!user || user.role !== UserRoles.ADMIN) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = Number(searchParams.get("limit")) || 100;

        const payments = await SubscriptionPaymentModel.find()
            .populate('businessId', 'name address')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json(payments, { status: 200 });
    } catch (err) {
        console.error("Error fetching platform payments:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

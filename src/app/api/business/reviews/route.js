import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import ReviewModel from "@/../models/Review";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

export async function GET(request) {
    try {
        const user = getTokenValue(request);
        if (!user || (!user.businessId && user.role !== UserRoles.ADMIN)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();

        let query = { deleted: false };
        if (user.role !== UserRoles.ADMIN) {
            query.businessId = user.businessId;
        }

        const reviews = await ReviewModel.find(query)
            .populate('userId', 'firstName lastName')
            .populate('propertyId', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json(reviews);
    } catch (err) {
        return NextResponse.json({ message: "Failed to fetch reviews", details: err.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const user = getTokenValue(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!user || (!user.businessId && user.role !== UserRoles.ADMIN)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();
        const body = await request.json(); // Expected: { response: "..." }

        let query = { _id: id };
        if (user.role !== UserRoles.ADMIN) {
            query.businessId = user.businessId;
        }

        const updated = await ReviewModel.findOneAndUpdate(query, { response: body.response }, { new: true });
        if (!updated) return NextResponse.json({ message: "Review not found" }, { status: 404 });

        return NextResponse.json({ message: "Response updated", updated });
    } catch (err) {
        return NextResponse.json({ message: "Failed to update response", details: err.message }, { status: 400 });
    }
}

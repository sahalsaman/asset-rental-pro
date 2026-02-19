import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import ChannelMappingModel from "@/../models/ChannelMapping";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

export async function GET(request) {
    try {
        const user = getTokenValue(request);
        if (!user || (user.role !== UserRoles.OWNER && user.role !== UserRoles.MANAGER)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const providerId = searchParams.get("providerId");
        const propertyId = searchParams.get("propertyId");

        await connectMongoDB();

        const query = { businessId: user.businessId };
        if (providerId) query.providerId = providerId;
        if (propertyId) query.propertyId = propertyId;

        const mappings = await ChannelMappingModel.find(query).lean();
        return NextResponse.json(mappings);
    } catch (err) {
        return NextResponse.json({ message: "Error fetching mappings", error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = getTokenValue(request);
        if (!user || (user.role !== UserRoles.OWNER && user.role !== UserRoles.MANAGER)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { providerId, propertyId, unitId, externalPropertyId, externalUnitId, syncEnabled } = body;

        await connectMongoDB();

        const mapping = await ChannelMappingModel.findOneAndUpdate(
            { unitId, providerId },
            {
                businessId: user.businessId,
                propertyId,
                unitId,
                providerId,
                externalPropertyId,
                externalUnitId,
                syncEnabled: syncEnabled ?? true
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(mapping);
    } catch (err) {
        return NextResponse.json({ message: "Error saving mapping", error: err.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const user = getTokenValue(request);
        if (!user || (user.role !== UserRoles.OWNER && user.role !== UserRoles.MANAGER)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        await connectMongoDB();

        await ChannelMappingModel.findOneAndDelete({ _id: id, businessId: user.businessId });

        return NextResponse.json({ message: "Mapping deleted" });
    } catch (err) {
        return NextResponse.json({ message: "Error deleting mapping", error: err.message }, { status: 500 });
    }
}

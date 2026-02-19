import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";
import { ChannelService } from "@/lib/channelService";

export async function POST(request) {
    try {
        const user = getTokenValue(request);
        if (!user || (user.role !== UserRoles.OWNER && user.role !== UserRoles.MANAGER)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { providerId, action } = body;

        await connectMongoDB();

        if (action === 'pull-bookings') {
            await ChannelService.pullBookings(user.businessId, providerId);
            return NextResponse.json({ message: "Sync triggered" });
        }

        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ message: "Error in sync", error: err.message }, { status: 500 });
    }
}

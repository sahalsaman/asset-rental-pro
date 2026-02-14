import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import ChannelProviderModel from "@/../models/ChannelProvider";
import ChannelAccountModel from "@/../models/ChannelAccount";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

export async function GET(request) {
    try {
        const user = getTokenValue(request);
        if (!user || (user.role !== UserRoles.OWNER && user.role !== UserRoles.MANAGER)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();

        // Get all active providers
        const providers = await ChannelProviderModel.find({ isActive: true }).lean();

        // Get user's connections
        // Assuming user._id is stored in token as user.id or user._id. getTokenValue usually returns decoded token.
        // I need to be sure about the ID field. I'll use user.id from token if available, or fetch user.
        // user object from getTokenValue typically has { id, role, ... }


        const accounts = await ChannelAccountModel.find({
            businessId: user.businessId
        }).lean();

        const result = providers.map(provider => {
            const account = accounts.find(acc => acc.providerId.toString() === provider._id.toString());
            return {
                ...provider,
                isConnected: !!account && account.status === 'connected',
                accountId: account ? account._id : null
            };
        });

        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ message: "Error fetching channels", error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = getTokenValue(request);
        if (!user || (user.role !== UserRoles.OWNER && user.role !== UserRoles.MANAGER)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { providerId, action } = body; // action: 'connect' | 'disconnect'

        await connectMongoDB();

        if (action === 'connect') {
            await ChannelAccountModel.findOneAndUpdate(
                { businessId: user.businessId, providerId },
                {
                    businessId: user.businessId,
                    providerId,
                    status: 'connected',
                    isActive: true
                },
                { upsert: true, new: true }
            );
        } else if (action === 'disconnect') {
            await ChannelAccountModel.findOneAndUpdate(
                { businessId: user.businessId, providerId },
                { status: 'disconnected', isActive: false }
            );
        }

        return NextResponse.json({ message: "Success" });
    } catch (err) {
        return NextResponse.json({ message: "Error updating channel status", error: err.message }, { status: 500 });
    }
}

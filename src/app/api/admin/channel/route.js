import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import ChannelProviderModel from "@/../models/ChannelProvider";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

export async function GET(request) {
    try {
        const user = getTokenValue(request);
        if (user?.role !== UserRoles.ADMIN) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();
        const channels = await ChannelProviderModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json(channels);
    } catch (err) {
        return NextResponse.json({ message: "Error fetching channels", error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = getTokenValue(request);
        if (user?.role !== UserRoles.ADMIN) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, displayName, icon, authType } = body;

        await connectMongoDB();

        // Check if exists
        const existing = await ChannelProviderModel.findOne({ name });
        if (existing) {
            return NextResponse.json({ message: "Channel with this name already exists" }, { status: 400 });
        }

        const newChannel = await ChannelProviderModel.create({
            name,
            displayName,
            icon,
            authType,
            isActive: true
        });

        return NextResponse.json(newChannel, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: "Error creating channel", error: err.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const user = getTokenValue(request);
        if (user?.role !== UserRoles.ADMIN) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updateData } = body;

        await connectMongoDB();
        const updatedChannel = await ChannelProviderModel.findByIdAndUpdate(id, updateData, { new: true });

        return NextResponse.json(updatedChannel);
    } catch (err) {
        return NextResponse.json({ message: "Error updating channel", error: err.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const user = getTokenValue(request);
        if (user?.role !== UserRoles.ADMIN) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        await connectMongoDB();
        await ChannelProviderModel.findByIdAndDelete(id);

        return NextResponse.json({ message: "Channel deleted successfully" });
    } catch (err) {
        return NextResponse.json({ message: "Error deleting channel", error: err.message }, { status: 500 });
    }
}

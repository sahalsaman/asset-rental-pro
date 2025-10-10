import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { subscription_plans } from "../../../utils/mock-data";
import { getTokenValue } from "@/utils/tokenHandler";


export async function GET(req) {
    await connectMongoDB();
    const user = getTokenValue(req);

    if (!user?.organisationId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({subscription_plans:subscription_plans})
}






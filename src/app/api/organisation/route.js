import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { OrganisationModel, OrgSubscriptionModel } from "@/../models/Organisation";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionStatus, UserRoles } from "@/utils/contants";

export async function GET(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);
    if (!user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== UserRoles.OWNER) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let organisation = await OrganisationModel.findById(user.organisationId).populate("subscription").lean();

    if (organisation?.subscription?.status === SubscritptionStatus.TRIAL || organisation?.subscription?.status === SubscritptionStatus.ACTIVE) {
      const currentDate = new Date();
      const endDate = new Date(organisation.subscription.endDate);
      if (currentDate > endDate) {
       organisation= await OrgSubscriptionModel.findByIdAndUpdate(organisation?.subscription?._id, {
          status: SubscritptionStatus.EXPIRED,
          trialCompleted: true
        },{ new: true }).populate("subscription").lean();
      }

    }

    return NextResponse.json(organisation, { status: 200 });
  } catch (error) {
    console.error("Error fetching organisation:", error);
    return NextResponse.json(
      { error: "Failed to fetch organisation" },
      { status: 500 }
    );
  }
}


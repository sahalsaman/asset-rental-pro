import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import UserModel from "@/../models/User";
import { getTokenValue } from "@/utils/tokenHandler";
import PropertyModel from "../../../../models/Property";
import UnitModel from "../../../../models/Unit";
import BookingModel from "../../../../models/Booking";
import { SelfRecieveBankOrUpiModel } from "../../../../models/SelfRecieveBankOrUpi";
import { OrganisationModel, SubscriptionPaymentModel } from "../../../../models/Organisation";
import AnnouncementModel from "../../../../models/Announcement";
import { UserRoles } from "@/utils/contants";

export async function GET(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);

    if (!user?.organisationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userData = await UserModel.findById(user.id).populate('organisationId', 'name address contactEmail contactPhone');

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);

    if (!user?.organisationId || !user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, countryCode } = body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(countryCode && { countryCode }),
      },
      { new: true } // return updated document
    )

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}


export async function DELETE(request) {
  try {
    await connectMongoDB();

    const user = getTokenValue(request);

    if (!user?.organisationId || !user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deletedUser = await UserModel.findByIdAndUpdate(user.id, { deleted: true }, { new: true });
    if (user.role === UserRoles.OWNER) {
      await OrganisationModel.updateMany({ ownerId: user.id }, { deleted: true });
      await SubscriptionPaymentModel.updateMany({ organisationId: user.organisationId }, { deleted: true });
      await SelfRecieveBankOrUpiModel.updateMany({ organisationId: user.organisationId }, { deleted: true });
      await PropertyModel.updateMany({ organisationId: user.organisationId }, { deleted: true });
      await UnitModel.updateMany({ organisationId: user.organisationId }, { deleted: true });
      await BookingModel.updateMany({ organisationId: user.organisationId }, { deleted: true });
      await AnnouncementModel.updateMany({ createdBy: user.id }, { deleted: true });
    }

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
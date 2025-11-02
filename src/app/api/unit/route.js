import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import UnitModel from "@/../models/Unit";
import BookingModel from "@/../models/Booking";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionStatus } from "@/utils/contants";
import { OrganisationModel } from "../../../../models/Organisation";


export async function GET(request) {
  const user = getTokenValue(request);
  if (!user?.organisationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const propertyId = url.searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
  }

  const unitId = url.searchParams.get("unitId");

  await connectMongoDB();

  if (unitId) {
    const unit = await UnitModel.findOne({
      _id: unitId,
      propertyId,
    });

    if (!unit) {
      return NextResponse.json(null);
    }

    return NextResponse.json({ ...unit.toObject(), bookingsCount: 0 });
  }

  const units = await UnitModel.find({ propertyId,organisationId:user?.organisationId });

  const unitsWithCounts = await Promise.all(
    units.map(async (unit) => {
      const bookingsCount = await BookingModel.countDocuments({
        unitId: unit._id,
      });
      if (bookingsCount) {
        return { ...unit.toObject(), bookingsCount };
      } else {
        return { ...unit.toObject(), bookingsCount: 0 };
      }
    })
  );

  return NextResponse.json(unitsWithCounts);
}


// POST new unit
export async function POST(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  await connectMongoDB();
  const units_list = await UnitModel.find({ organisationId: user.organisationId })

  const organisation = await OrganisationModel.findById(user.organisationId)
  if (!organisation?.subscription || organisation?.subscription?.status === SubscritptionStatus.EXPIRED) {
    return NextResponse.json({ error: "Organisation subscription expired" }, { status: 403 });
  }

  if (body.isMultipleUnit) {
    if (body.numberOfUnits && organisation?.subscription?.usageLimits?.units < units_list?.length + body.numberOfUnits) {
      return NextResponse.json({ error: "Unit limit reached. Please upgrade your subscription." }, { status: 403 });
    }

    const newUnits = [];
    for (let i = 0; i < (body.numberOfUnits || 1); i++) {
      const unitData = { ...body, organisationId: user.organisationId, name: `Unit - ${i + 1}` };
      delete unitData.isMultipleUnit;
      delete unitData.numberOfUnits;
      const unit = await UnitModel.create(unitData);
      newUnits.push(unit);
    }
    return NextResponse.json(newUnits, { status: 201 });

  }

  if (organisation?.subscription?.usageLimits?.units < (units_list?.length ?? 0) + 1) {
    return NextResponse.json({ error: "Unit limit reached. Please upgrade your subscription." }, { status: 403 });
  }

  const unit = await UnitModel.create({ ...body, organisationId: user.organisationId });
  return NextResponse.json(unit, { status: 201 });
}

// PUT update unit
export async function PUT(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  const body = await request.json();
  await connectMongoDB();
  const updated = await UnitModel.findOneAndUpdate({ _id: id, organisationId: user.organisationId }, body, { new: true });
  return NextResponse.json(updated);
}

// DELETE unit
export async function DELETE(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  await connectMongoDB();
  await UnitModel.findOneAndDelete({ _id: id, organisationId: user.organisationId });
  return NextResponse.json({ message: "Unit deleted" });
}

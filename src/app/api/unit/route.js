import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import UnitModel from "@/../models/Unit";
import BookingModel from "@/../models/Booking";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionStatus } from "@/utils/contants";
import { BusinessModel } from "../../../../models/Business";


export async function GET(request) {
  const user = getTokenValue(request);
  if (!user?.businessId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const propertyId = url.searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ message: "Missing propertyId" }, { status: 400 });
  }

  const unitId = url.searchParams.get("unitId");

  await connectMongoDB();

  let filter = {
    propertyId,
    businessId: user?.businessId,
    disabled: false,
    deleted: false
  };

  if (unitId) {
    const unit = await UnitModel.findOne({
      _id: unitId,
      ...filter
    });

    if (!unit) {
      return NextResponse.json(null);
    }

    return NextResponse.json({ ...unit.toObject(), bookingsCount: 0 });
  }

  const units = await UnitModel.find(filter);

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
  if (!user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  await connectMongoDB();

  const business = await BusinessModel.findById(user.businessId)
  if (!business?.subscription || business?.subscription?.status === SubscritptionStatus.EXPIRED) {
    return NextResponse.json({ message: "Business subscription expired" }, { status: 403 });
  }

  if (body.isMultipleUnit) {


    const newUnits = [];
    for (let i = 0; i < (body.numberOfUnits || 1); i++) {
      const unitData = { ...body, businessId: user.businessId, name: `Unit - ${i + 1}` };
      delete unitData.isMultipleUnit;
      delete unitData.numberOfUnits;
      const unit = await UnitModel.create(unitData);
      newUnits.push(unit);
    }
    return NextResponse.json(newUnits, { status: 201 });

  }



  const unit = await UnitModel.create({ ...body, businessId: user.businessId });
  return NextResponse.json(unit, { status: 201 });
}

// PUT update unit
export async function PUT(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const bulkType = url.searchParams.get("bulkType");
  const propertyId = url.searchParams.get("propertyId");

  const body = await request.json();
  await connectMongoDB();

  if (bulkType && propertyId) {
    // Bulk update units of the same type within a property
    const result = await UnitModel.updateMany(
      { type: bulkType, propertyId, businessId: user.businessId },
      body
    );
    return NextResponse.json({ message: "Bulk update successful", modifiedCount: result.modifiedCount });
  }

  const updated = await UnitModel.findOneAndUpdate({ _id: id, businessId: user.businessId }, body, { new: true });
  return NextResponse.json(updated);
}

// DELETE unit
export async function DELETE(request) {
  const user = getTokenValue(request);
  if (!user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  await connectMongoDB();
  await UnitModel.findOneAndDelete({ _id: id, businessId: user.businessId });
  return NextResponse.json({ message: "Unit deleted" });
}

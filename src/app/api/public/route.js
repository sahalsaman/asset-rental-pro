import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import PropertyModel from "@/../models/Property";
import UnitModel from "@/../models/Unit"; // Ensure this exists
import BookingModel from "../../../../models/Booking";
import InvoiceModel from "../../../../models/Invoice";
import { SelfRecieveBankOrUpiModel } from "../../../../models/SelfRecieveBankOrUpi";


export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const id = searchParams.get("id"); // for detail page
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (type == "pay") {
      const payment = await getPaymentDetail(id)
      return NextResponse.json(payment);
    }
    if (type == "ac") {
      const ac = await getRecieveAccountDetail(id)
      return NextResponse.json(ac);
    }
    if (type == "property") {
      if (id) {
        const data = await getPropertyDetail(id);
        return NextResponse.json(data);
      }

      const data = await getProperties(search, category, page, limit);
      return NextResponse.json(data);
    }
    return NextResponse.json(
      { message: "type not found", details: err.message },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch", details: err.message },
      { status: 500 }
    );
  }
}


async function getPaymentDetail(bookingCode) {
  console.log(`Fetching payment detail for bookingCode: ${bookingCode}`);

  const booking = await BookingModel.findOne(
    { code: bookingCode, deleted: false, disabled: false },
    {
      _id: 1,
      amount: 1,
      frequency: 1,
      status: 1,
      whatsappCountryCode: 1,
      whatsappNumber: 1,
      createdAt: 1,
    }
  ).populate("propertyId").populate("unitId").populate("userId");

  if (!booking) {
    return NextResponse.json(
      { message: "Booking not found", details: err.message },
      { status: 404 }
    );
  }

  const invoices = await InvoiceModel.find(
    { bookingId: booking._id, deleted: false, disabled: false },
    { _id: 1, amount: 1, type: 1, status: 1, paidAt: 1, paymentGateway: 1, dueDate: 1, createdAt: 1, updatedAt: 1 }
  );

  return { ...booking.toObject(), invoices };
}

async function getRecieveAccountDetail(id) {

  const acc = await SelfRecieveBankOrUpiModel.findOne(
    { _id: id },
    {
      _id: 1,
      paymentRecieverOption: 1,
      accountHolderName: 1,
      value: 1,
      ifsc: 1,
      bankName: 1,
      branch: 1,
      image: 1,
      upiPhoneCountryCode: 1,
      status: 1,
    }
  );
  console.log(`Fetching recieve account detail for id: ${acc}, ${id}`);
  if (!acc) {
    return NextResponse.json(
      { message: "Account not found" },
      { status: 404 }
    );
  }

  return acc;
}


async function getProperties(search, category, page, limit) {
  const query = { deleted: false, disabled: false };

  if (category) query.category = category;

  if (search) {
    const regex = new RegExp(search, "i"); // case-insensitive search
    query.$or = [
      { name: regex },
      { address: regex },
      { city: regex },
      { state: regex },
      { country: regex },
    ];
  }

  const skip = (page - 1) * limit;

  // Fetch properties and total count
  const [properties, total] = await Promise.all([
    PropertyModel.find(query, {
      _id: 1,
      name: 1,
      description: 1,
      images: 1,
      address: 1,
      amenities: 1,
      services: 1,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    PropertyModel.countDocuments(query),
  ]);

  if (!properties.length) {
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      data: [],
    };
  }

  // 🔹 Fetch one unit per property
  const propertyIds = properties.map((p) => p._id);
  const units = await UnitModel.aggregate([
    {
      $match: {
        propertyId: { $in: propertyIds },
        deleted: false,
        disabled: false
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$propertyId",
        unit: {
          $first: {
            name: "$name",
            type: "$type",
            amount: "$amount",
            frequency: "$frequency"
          }
        }
      },
    },
  ]);


  const unitMap = {};
  units.forEach((u) => {
    unitMap[u._id.toString()] = u.unit;
  });

  // 🔹 Only include properties that have at least one unit
  const list = properties
    .map((p) => {
      const unit = unitMap[p._id.toString()];
      if (!unit) return null; // skip property with no unit
      return {
        ...p,
        unit: unit,
      };
    })
    .filter(Boolean); // remove null entries

  return {
    total: list.length,
    page,
    limit,
    totalPages: Math.ceil(list.length / limit),
    data: list,
  };
}


// 🔹 Function: Property Detail (with Units)
async function getPropertyDetail(propertyId) {
  const property = await PropertyModel.findOne(
    { _id: propertyId, deleted: false, disabled: false },
    {
      _id: 1,
      name: 1,
      description: 1,
      images: 1,
      address: 1,
      amenities: 1,
      services: 1,
      category: 1,
      city: 1,
      state: 1,
      country: 1,
    }
  );

  if (!property) {
    return { message: "Property not found" };
  }

  const units = await UnitModel.find(
    { propertyId: property._id },
    { _id: 1, name: 1, type: 1, amount: 1, status: 1, frequency: 1, noOfSlots: 1 }
  );

  return { ...property.toObject(), units };
}

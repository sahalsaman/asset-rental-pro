import { NextRequest, NextResponse } from "next/server";

import connectMongoDB from "@/../database/db";
import PropertyModel from "@/../models/Property";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionStatus, UserRoles } from "@/utils/contants";
import { BusinessModel } from "../../../../models/Business";
import { deleteFromImgbb, uploadToImgbb } from "@/utils/upload_image";
import { env } from "../../../../environment";



// GET all properties for logged-in user
export async function GET(request) {
  try {
    const user = getTokenValue(request);

    if (user.role !== UserRoles.ADMIN && !user.businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!user.role) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const propertyId = new URL(request.url).searchParams.get("propertyId");
    const status = new URL(request.url).searchParams.get("status");

    await connectMongoDB();

    if (user.role == UserRoles.ADMIN) {
      let properties = await PropertyModel.find().populate('businessId', 'name').lean();
      return NextResponse.json(properties, { status: 200 });
    }
    const filter = {
      businessId: user.businessId,
      deleted: false,
      disabled: false,
    }
    if (status) {
      filter.status = status
    }
    if (propertyId) {
      const property = await PropertyModel.find({ _id: propertyId, ...filter });
      return NextResponse.json(property[0] || null);
    } else {
      if (user.role === UserRoles.MANAGER) {
        const properties = await PropertyModel.find({
          managers: user.id,
        })
        return NextResponse.json(properties);
      } else {
        const properties = await PropertyModel.find(filter);
        return NextResponse.json(properties);
      }

    }
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch properties", details: err.message },
      { status: 500 }
    );
  }
}

// POST new property
export async function POST(request) {
  const user = getTokenValue(request);
  if (!user?.businessId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();
  const body = await request.json();

  try {

    const business = await BusinessModel.findById(user.businessId)
    if (!business?.subscription || business?.subscription?.status === SubscritptionStatus.EXPIRED) {
      return NextResponse.json({ message: "Business subscription expired" }, { status: 403 });
    }

    if (!body.selctedSelfRecieveBankOrUpi) {
      delete body.selctedSelfRecieveBankOrUpi;
    }

    if (body?.new_images?.length) {
      const uploadedImages = [];

      for (const image of body.new_images) {
        const uploaded = await uploadToImgbb(image, env.IMAGE_PROPERTIES);
        if (uploaded?.url) {
          uploadedImages.push(uploaded);
        }
      }

      body.images = uploadedImages;
    }



    const property = await PropertyModel.create({
      ...body,
      businessId: user.businessId,
    });
    return NextResponse.json(
      { message: "Property added", property },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to add property", details: err.message },
      { status: 400 }
    );
  }
}

// PUT update property
export async function PUT(request) {
  try {
    const user = getTokenValue(request);
    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Missing property ID" }, { status: 400 });
    }

    await connectMongoDB();
    const body = await request.json();

    let query = { _id: id };
    if (user.role !== UserRoles.ADMIN) {
      query.businessId = user.businessId;
    }

    const existinProperty = await PropertyModel.findOne(query);
    if (!existinProperty) {
      return NextResponse.json({ message: "Property not found or access denied" }, { status: 404 });
    }

    if (body?.new_images?.length) {
      const uploadedImages = [];
      for (const image of body.new_images) {
        const uploaded = await uploadToImgbb(image, env.IMAGE_PROPERTIES);
        if (uploaded?.url) uploadedImages.push(uploaded);
      }
      body.images = uploadedImages;
    }

    if (body?.existingImages?.length) {
      const deletedImages = existinProperty.images.filter(
        (img) => !body.existingImages.includes(img.url)
      );
      if (deletedImages.length) {
        for (const img of deletedImages) {
          await deleteFromImgbb(img.delete_url);
        }
      }
      body.images = [...(body.images || []), ...(body.existingImages || [])];
    }

    const updated = await PropertyModel.findOneAndUpdate(query, body, { new: true });
    return NextResponse.json({ message: "Property updated", updated });
  } catch (err) {
    console.error("Error updating property:", err);
    return NextResponse.json({ message: "Failed to update property", details: err.message }, { status: 400 });
  }
}

// DELETE property
export async function DELETE(request) {
  try {
    const user = getTokenValue(request);
    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Missing property ID" }, { status: 400 });
    }

    await connectMongoDB();
    let query = { _id: id };
    if (user.role !== UserRoles.ADMIN) {
      query.businessId = user.businessId;
    }

    const deleted = await PropertyModel.findOneAndDelete(query);
    if (!deleted) {
      return NextResponse.json({ message: "Property not found or access denied" }, { status: 404 });
    }
    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Error deleting property:", err);
    return NextResponse.json({ message: "Failed to delete property", details: err.message }, { status: 500 });
  }
}

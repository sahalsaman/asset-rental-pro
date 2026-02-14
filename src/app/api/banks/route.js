import { NextResponse } from "next/server";
import { getTokenValue, IPayload } from "@/utils/tokenHandler";
import connectMongoDB from "../../../../database/db";
import { SelfRecieveBankOrUpiModel } from "../../../../models/SelfRecieveBankOrUpi";
import { uploadToImgbb } from "@/utils/upload_image";
import { env } from "../../../../environment";
import { PaymentRecieverOptions } from "@/utils/contants";

export async function GET(req) {
  try {
    await connectMongoDB();
    const user = getTokenValue(req);
    if (!user?.businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const banks = await SelfRecieveBankOrUpiModel.find({ business: user?.businessId }).sort({ isPrimary: -1 });
    return NextResponse.json(banks);
  } catch (error) {
    console.error("GET /banks error:", error);
    return NextResponse.json({ message: "Failed to fetch banks" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongoDB();
    const user = getTokenValue(req);
    if (!user?.businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (body.paymentRecieverOption == PaymentRecieverOptions.UPIQR) {
      const image = await uploadToImgbb(body?.qrImage, env.IMAGE_UPI_QR)
      body.value = image.url
      body.image = image
    }


    const newBank = await SelfRecieveBankOrUpiModel.create({
      ...body,
      business: user.businessId,
    });

    return NextResponse.json(newBank, { status: 201 });
  } catch (error) {
    console.error("POST /banks error:", error);
    return NextResponse.json({ message: "Failed to add bank" }, { status: 500 });
  }
}
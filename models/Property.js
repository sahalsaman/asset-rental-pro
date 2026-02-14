import mongoose, { Schema, Types } from "mongoose";
import { PropertyStatus } from "@/utils/contants";


const PropertySchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true },
    name: { type: String, required: true },
    description: String,
    amenities: [String],
    services: [String],
    images: [{
      id: String,
      url: String,
      delete_url: String
    }],
    videoUrl: [String],
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: "india" },
    zipCode: { type: String },
    status: { type: String, default: PropertyStatus.AVAILABLE },
    category: { type: String, required: true },
    currency: { type: String, required: true },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    managers: [{ type: Types.ObjectId, ref: "User" }],
    selctedSelfRecieveBankOrUpi: { type: Types.ObjectId, ref: "SelfRecieveBankOrUpi", default: null },
    is_paymentRecieveSelf: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PropertyModel =
  mongoose.models.Property || mongoose.model("Property", PropertySchema);

export default PropertyModel;

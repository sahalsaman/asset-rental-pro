import mongoose, { Schema, Types } from "mongoose";
import {  PropertyStatus } from "@/utils/contants";


const PropertySchema = new Schema(
  {
    organisationId: { type: Types.ObjectId, ref: "Organisation", required: true },
    name: { type: String, required: true },
    description: String,
    amenities: [String], 
    services: [String], 
    images: [String],
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode:  { type: String, required: true },
    status: { type: String, default: PropertyStatus.AVAILABLE },
    category: { type: String, required: true },
    currency: { type: String, required: true },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    managers: [{ type: Types.ObjectId, ref: "User" }],
    is_paymentRecieveSelf: { type: Boolean, default: true },
    selectedBank: { type: Types.ObjectId, ref: "BankDetail"}
  },
  { timestamps: true }
);

const PropertyModel =
  mongoose.models.Property || mongoose.model("Property", PropertySchema);

export default PropertyModel;

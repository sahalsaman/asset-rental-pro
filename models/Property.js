import mongoose, { Schema, Types } from "mongoose";
import { BankStatus, PropertyStatus } from "@/utils/contants";

const BankDetailSchema = new Schema(
  {
    accountNo: String,
    ifsc: String,
    accountHolderName: String,
    status: { type: String, enum: BankStatus, default: BankStatus.INACTIVE },
  },
  { _id: false }
);

const UPIDetailSchema = new Schema(
  {
    upiId: String,
    qrcode_link: String,
    status: { type: String, enum: BankStatus, default: BankStatus.INACTIVE },
  },
  { _id: false }
);

const UPPhoneDetailSchema = new Schema(
  {
    upiPhoneNumber: String,
    status: { type: String, enum: BankStatus, default: BankStatus.INACTIVE },
  },
  { _id: false }
);

const PropertySchema = new Schema(
  {
    organisationId: { type: Types.ObjectId, ref: "Organisation", required: true },
    name: { type: String, required: true },
    description: String,
    amenities: [String], 
    services: [String], 
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode:  { type: String, required: true },
    status: { type: String, default: PropertyStatus.AVAILABLE },
    category: { type: String, required: true },
    images: [String],
    currency: { type: String, required: true },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    managers: [{ type: Types.ObjectId, ref: "User" }],
    is_paymentRecieveSelf: { type: Boolean, default: true },
    // 🏦 Bank and UPI details with validators
    bankDetails: {
      type: [BankDetailSchema],
      validate: {
        validator: (v) => v.length <= 2,
        message: "Maximum of 2 bank accounts allowed",
      },
    },
    upiDetails: {
      type: [UPIDetailSchema],
      validate: {
        validator: (v) => v.length <= 2,
        message: "Maximum of 2 UPI IDs allowed",
      },
    },
    upiPhoneDetails: {
      type: [UPPhoneDetailSchema],
      validate: {
        validator: (v) => v.length <= 2,
        message: "Only 1 UPI Phone number allowed",
      },
    },
  },
  { timestamps: true }
);

const PropertyModel =
  mongoose.models.Property || mongoose.model("Property", PropertySchema);

export default PropertyModel;

import mongoose, { Schema, Types } from "mongoose";
import { SubscriptionBillingCycle, SubscritptionPaymentStatus, SubscritptionStatus } from "@/utils/contants";

const SubscriptionPaymentSchema = new Schema(
  {
    organisationId: { type: Types.ObjectId, ref: "Organisation", required: true },
    plan: { type: String, required: true },
    status: { type: String, enum: Object.values(SubscritptionPaymentStatus)},
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    no_of_units: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    total_price: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    razorpay_orderId: String,
    razorpay_paymentId: String,
    razorpay_signature: String,
    razorpay_status: String,
  },
  { timestamps: true }
);

const OrgSubscriptionSchema = new Schema({
  plan: { type: String, required: true },
  planId: { type: String, required: true,default:"arp_subscription_trial" },
  status: { type: String, enum: Object.values(SubscritptionStatus), default: SubscritptionStatus.FREE },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  billingCycle: { type: String, enum: Object.values(SubscriptionBillingCycle), required: true },
  unitPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  autoRenew: { type: Boolean, default: true },
  lastPaymentDate: Date,
  nextBillingDate: Date,
},
  { timestamps: true }
);

const vendorRazerpayAccountSchema = new Schema({
  balance: { type: Number, default: 0 },
  contact: {
    name: { type: String },
    email: { type: String },
    contact: { type: String },
    type: { type: String, default: "vendor" },
  },
  contact_id: { type: String },
  account_type: { type: String, default: "bank_account" },
  bank_account: {
    name: { type: String },
    ifsc: { type: String },
    account_number: { type: String },
  },
  fundAccountId: { type: String },
},
  { timestamps: true }
);

const OrganisationSchema = new Schema(
  {
    name: { type: String, required: true },
    address: String,
    logo: String,
    owner: { type: Types.ObjectId, ref: "User", required: true },
    website: String,
    subscription: OrgSubscriptionSchema,
    vendorRazerpayAccount: vendorRazerpayAccountSchema,
    selctedSelfRecieveBankOrUpi: { type: Types.ObjectId, ref: "SelfRecieveBankOrUpi" },
    is_paymentRecieveSelf: { type: Boolean },
    disabled: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    remark: { type: String },
  },
  { timestamps: true }
);

const OrganisationModel = mongoose.models.Organisation || mongoose.model("Organisation", OrganisationSchema);
const SubscriptionPaymentModel = mongoose.models.SubscriptionPayment || mongoose.model("SubscriptionPayment", SubscriptionPaymentSchema);

export { OrganisationModel, SubscriptionPaymentModel };

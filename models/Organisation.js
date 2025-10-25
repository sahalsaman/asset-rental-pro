import mongoose, { Schema, Types } from "mongoose";
import { SubscritptionBillingCycle, SubscritptionStatus } from "@/utils/contants";

const SubscriptionPaymentSchema = new Schema(
  {
    organisationId: { type: Types.ObjectId, ref: "Organisation", required: true },
    plan: { type: String, required: true },
    status: { type: String, enum: Object.values(SubscritptionStatus), default: SubscritptionStatus.TRIAL },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    usageLimits: {
      property: { type: Number, default: 0 },
      rooms: { type: Number, default: 0 },
      bookings: { type: Number, default: 0 },
    },
    razorpay_orderId: String,
    razorpay_paymentId: String,
    razorpay_signature: String,
    razorpay_status: String,
  },
  { timestamps: true }
);

const OrgSubscriptionSchema = new Schema({
  plan: { type: String, required: true },
  status: { type: String, enum: Object.values(SubscritptionStatus), default: SubscritptionStatus.TRIAL },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  billingCycle: { type: String, enum: Object.values(SubscritptionBillingCycle), required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  autoRenew: { type: Boolean, default: true },
  trialDays: { type: Number, default: 14 },
  trialCompleted: { type: Boolean, default: false },
  usageLimits: {
    property: { type: Number, default: 0 },
    rooms: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
  },
  lastPaymentDate: Date,
  nextBillingDate: Date,
});

const autoPaymentSchema = new Schema({
    balance:{ type: Number, default: 0 },
});

const OrganisationSchema = new Schema(
  {
    name: { type: String, required: true },
    address: String,
    logo: String,
    owner: { type: Types.ObjectId, ref: "User", required: true },
    website: String,
    disabled: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    subscription: OrgSubscriptionSchema,
    autoPayment: autoPaymentSchema,
    selctedSelfRecieveBankOrUpi: { type: Types.ObjectId, ref: "SelfRecieveBankOrUpi" },
    is_paymentRecieveSelf: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const OrganisationModel = mongoose.models.Organisation || mongoose.model("Organisation", OrganisationSchema);
const SubscriptionPaymentModel = mongoose.models.SubscriptionPayment || mongoose.model("SubscriptionPayment", SubscriptionPaymentSchema);

export { OrganisationModel, SubscriptionPaymentModel };

import mongoose, { Schema, Types } from "mongoose";
import { SubscriptionBillingCycle, SubscritptionPaymentStatus, SubscritptionStatus } from "@/utils/contants";

const SubscriptionPaymentSchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true },
    plan: { type: String, required: true },
    status: { type: String, enum: Object.values(SubscritptionPaymentStatus) },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    no_of_booking: { type: Number, required: true },
    plan_price: { type: Number, required: true },
    total_price: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    razorpay_orderId: String,
    razorpay_paymentId: String,
    razorpay_signature: String,
    razorpay_status: String,
  },
  { timestamps: true }
);

const BusinessSubscriptionSchema = new Schema({
  plan: { type: String, required: true },
  planId: { type: String, required: true, default: "arp_subscription_trial" },
  status: { type: String, enum: Object.values(SubscritptionStatus), default: SubscritptionStatus.FREE },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  billingCycle: { type: String, enum: Object.values(SubscriptionBillingCycle), required: true, default: SubscriptionBillingCycle.MONTHLY },
  unitPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  autoRenew: { type: Boolean, default: true },
  numberOfBookings: { type: Number, default: 0 },
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

const BusinessSchema = new Schema(
  {
    name: { type: String, required: true },
    address: String,
    logo: String,
    owner: { type: Types.ObjectId, ref: "User", required: true },
    website: String,
    subscription: BusinessSubscriptionSchema,
    vendorRazerpayAccount: vendorRazerpayAccountSchema,
    selctedSelfRecieveBankOrUpi: { type: Types.ObjectId, ref: "SelfRecieveBankOrUpi" },
    is_paymentRecieveSelf: { type: Boolean },
    features: {
      bookingManagement: { type: Boolean, default: true },
      invoiceManagement: { type: Boolean, default: true },
      invoiceAutoSend: { type: Boolean, default: true },
      managerManagement: { type: Boolean, default: true },
      broadcastManagement: { type: Boolean, default: true },
      financialManagement: { type: Boolean, default: true },
      calendarManagement: { type: Boolean, default: false },
      channelManagement: { type: Boolean, default: false },
      reviewManagement: { type: Boolean, default: false },
      websiteManagement: { type: Boolean, default: false },
    },
    googlePlaceId: String,
    googleIntegrationActive: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    remark: { type: String },
  },
  { timestamps: true }
);

const BusinessModel = mongoose.models.Business || mongoose.model("Business", BusinessSchema);
const SubscriptionPaymentModel = mongoose.models.SubscriptionPayment || mongoose.model("SubscriptionPayment", SubscriptionPaymentSchema);

export { BusinessModel, SubscriptionPaymentModel };

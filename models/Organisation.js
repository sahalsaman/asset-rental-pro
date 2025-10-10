import { SubscritptionBillingCycle, SubscritptionStatus } from '@/utils/contants';
import mongoose, { Schema, Types } from 'mongoose';


const SubscriptionPaymentSchema = new Schema(
  {
    organisation: {
      type: Types.ObjectId,
      ref: "Organisation",
      required: true
    },
    subscription: {
      type: Types.ObjectId,
      ref: "OrgSubscription",
      required: true
    },
    plan: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: SubscritptionStatus,
      default: SubscritptionStatus.TRIAL
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },

    // Usage snapshot at payment time
    usageLimits: {
      property: { type: Number, default: 0 },
      rooms: { type: Number, default: 0 },
      bookings: { type: Number, default: 0 }
    },

    // Razorpay details
    razorpay_orderId: { type: String },
    razorpay_paymentId: { type: String },
    razorpay_signature: { type: String },
    razorpay_status: { type: String },
  },
  { timestamps: true }
);

const OrgSubscriptionSchema = new Schema(
  {
    organisation: {
      type: Types.ObjectId,
      ref: "Organisation",
      required: true
    },
    plan: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: SubscritptionStatus,
      default: SubscritptionStatus.TRIAL
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    billingCycle: {
      type: String,
      enum: SubscritptionBillingCycle,
      required: true
    },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    autoRenew: { type: Boolean, default: true },

    // Trial details
    trialDays: { type: Number, default: 14 },
    trialStarted: { type: Date },
    trialEndDate: { type: Date },
    trialCompleted: { type: Boolean, default: false },

    // Usage limits
    usageLimits: {
      property: { type: Number, default: 0 },
      rooms: { type: Number, default: 0 },
      bookings: { type: Number, default: 0 }
    },

    // Billing tracking
    lastPaymentDate: { type: Date },
    nextBillingDate: { type: Date },

  },
  { timestamps: true }
);

const OrganisationSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    logo: { type: String },
    owner: { type: Types.ObjectId, ref: "User", required: true },
    website: { type: String },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    subscription: {
      type: Types.ObjectId,
      ref: "OrgSubscription"
    },
  },
  { timestamps: true }
);


const OrganisationModel =
  mongoose.models.Organisation || mongoose.model("Organisation", OrganisationSchema);

const OrgSubscriptionModel = mongoose.models.OrgSubscription || mongoose.model("OrgSubscription", OrgSubscriptionSchema);

const SubscriptionPaymentModel = mongoose.models.SubscriptionPayment || mongoose.model("SubscriptionPayment", SubscriptionPaymentSchema);

export { OrganisationModel, OrgSubscriptionModel, SubscriptionPaymentModel };
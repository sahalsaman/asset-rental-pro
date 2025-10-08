import { SubscritptionBillingCycle, SubscritptionStatus } from '@/utils/contants';
import mongoose, { Schema, Types } from 'mongoose';

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
    trialDays: { type: Number, default: 14 },
    trialStarted: { type: Date },
    trialendDate: { type: Date },
    trialCompleted: { type: Boolean, default: true },

    usageLimits: {  
      property: { type: Number, default: 0 },
      rooms: { type: Number, default: 0 },
      bookings: { type: Number, default: 0 }
    },

    lastPaymentDate: { type: Date },
    nextBillingDate: { type: Date },

    razorpay_orderId: { type: String },
    razorpay_paymentId: { type: String },
    razorpay_signature: { type: String },
    razorpay_status: { type: String },
  },
  { timestamps: true }
);


const OrganisationSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String },
    owner: { type: Types.ObjectId, ref: "User", required: true },
    managers: [{ type: Types.ObjectId, ref: "User" }],
    website: { type: String },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    subscription: { 
      type: Types.ObjectId, 
      ref: "Org_subscription"  
    },
  },
  { timestamps: true }
);


const OrganisationModel =
  mongoose.models.Organisation || mongoose.model("Organisation", OrganisationSchema);

const OrgSubscriptionModel =
  mongoose.models.Org_subscription || mongoose.model("Org_subscription", OrgSubscriptionSchema);

export { OrganisationModel, OrgSubscriptionModel };
import mongoose, { Schema, Types } from 'mongoose';

// Subscription Schema
const OrgSubscriptionSchema = new Schema(
  {
    organisation: { 
      type: Types.ObjectId, 
      ref: "Organisation", 
      required: true 
    },
    plan: { 
      type: String, 
      enum: ['basic', 'pro', 'enterprise'],  // Customize enums as needed
      required: true 
    },
    status: { 
      type: String, 
      enum: ['active', 'cancelled', 'expired', 'trial'], 
      default: 'trial' 
    },
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date 
    },
    billingCycle: { 
      type: String, 
      enum: ['monthly', 'yearly'], 
      required: true 
    },
    amount: { 
      type: Number,  // e.g., 999 for ₹999/month
      required: true 
    },
    paymentMethod: { 
      type: String,  // e.g., 'razorpay', 'stripe', 'manual'
      required: true 
    },
    autoRenew: { 
      type: Boolean, 
      default: true 
    },
    trialDays: { 
      type: Number, 
      default: 14 
    },
    usageLimits: {  // Optional: For metered plans
      users: { type: Number, default: 0 },  // e.g., max users
      storage: { type: Number, default: 0 },  // e.g., GB storage
      bookings: { type: Number, default: 0 }  // e.g., max bookings/month
    },
    lastPaymentDate: { 
      type: Date 
    },
    nextBillingDate: { 
      type: Date 
    },
  },
  { timestamps: true }
);

// Organisation Schema (Updated with Subscription Reference)
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
      ref: "Org_subscription"  // One-to-one: Each org has one active subscription
    },
  },
  { timestamps: true }
);

// Models
const OrganisationModel =
  mongoose.models.Organisation || mongoose.model("Organisation", OrganisationSchema);

const OrgSubscriptionModel =
  mongoose.models.Org_subscription || mongoose.model("Org_subscription", OrgSubscriptionSchema);

export { OrganisationModel, OrgSubscriptionModel };
import mongoose, { Schema, Types } from "mongoose";
import { PaymentStatus, PaymentMethod, PaymentType, TransactionType } from "@/utils/contants";

const PaymentSchema = new Schema(
  {
    organisationId: {
      type: Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    propertyId: {
      type: Types.ObjectId,
      ref: "Property",
      required: true,
    },
    bookingId: {
      type: Types.ObjectId,
      ref: "Booking",
    },
    invoiceId: {
      type: Types.ObjectId,
      ref: "Invoice",
    },

    paymentType: {
      type: String,
      enum: PaymentType,
      default: PaymentType.RENT,
    },
    method: {
      type: String,
      enum: PaymentMethod,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    },

    razorpay_orderId: String,
    razorpay_paymentId: String,
    razorpay_signature: String,

    transactionType: {
      type: String,
      enum: TransactionType,
    },
    transactionId: String,
    referenceNo: String,
    upiId: String,
    bankAccountNo: String,
    paymentProofUrl: String,

    paidAt: { type: Date },
    dueDate: { type: Date },
    note: { type: String },
  },
  { timestamps: true }
);

// 🔖 Model export
const PaymentModel =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default PaymentModel;

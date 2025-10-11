import mongoose, { Schema, Types } from 'mongoose';
import { InvoiceStatus, RentAmountType } from '@/utils/contants';

const InvoiceSchema = new Schema(
  {
    organisationId: { type: Types.ObjectId, ref: "Organisation", required: true },
    bookingId: { type: Types.ObjectId, ref: "Booking", required: true },
    propertyId: { type: Types.ObjectId, ref: "Property", required: true },
    roomId: { type: Types.ObjectId, ref: "Room", required: true },
    invoiceId: { type: String, required: true },  // Fixed: 'require' → 'required'
    amount: { type: Number, required: true },  // Added: required for consistency
    balance: { type: Number, default: 0 },  // Tracks remaining amount
    carryForwarded: { type: Number, default: 0 },  // Fixed spelling: 'carryForwerded' → 'carryForwarded'
    type: { type: String,enum:RentAmountType, required: true },  // Added: required (e.g., 'rent', 'advance')
    status: { type: String, enum: InvoiceStatus, default: InvoiceStatus.PENDING },
    dueDate: { type: Date, required: true },
    paymentGateway: { 
      type: String, 
      enum: ['razorpay', 'upi', 'cash', 'manual'], 
      default: 'manual' 
    },  
    paymentUrl:{ type: String}, 
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// Indexes for performance (e.g., quick lookups by invoiceId or status)
InvoiceSchema.index({ invoiceId: 1 });
InvoiceSchema.index({ organisationId: 1, status: 1 });
InvoiceSchema.index({ bookingId: 1 });

const InvoiceModel = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
export default InvoiceModel;
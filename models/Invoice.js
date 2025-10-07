import mongoose, { Schema, Types } from 'mongoose';
import { InvoiceStatus, TransactionType } from '@/utils/contants';

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
    type: { type: String, required: true },  // Added: required (e.g., 'rent', 'advance')
    status: { type: String, enum: Object.values(InvoiceStatus), default: InvoiceStatus.PENDING },
    dueDate: { type: Date, required: true },
    paymentGateway: { 
      type: String, 
      enum: ['razorpay', 'upi', 'cash', 'manual'], 
      default: 'manual' 
    },  // New: Tracks primary gateway (updated on first payment)
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    payments: [
      {
        date: { type: Date, default: Date.now },
        amount: { type: Number, required: true },
        transactionId: { type: String, required: true },  // General txn ID (e.g., from gateway)
        transactionType: { 
          type: String, 
          enum: Object.values(TransactionType), 
          // default: TransactionType.INHAND 
        },
        razorpayPaymentId: { type: String },  // New: Razorpay-specific payment ID (e.g., 'pay_abc123')
        razorpayOrderId: { type: String },  // New: Order ID for verification
        razorpaySignature: { type: String },  // New: Signature for webhook validation
        gateway: { type: String, default: 'manual' },  // New: Per-payment gateway (e.g., 'razorpay')
        notes: { type: String },  // New: Optional notes (e.g., "Partial payment via UPI")
      },
    ],
  },
  { timestamps: true }
);

// Indexes for performance (e.g., quick lookups by invoiceId or status)
InvoiceSchema.index({ invoiceId: 1 });
InvoiceSchema.index({ organisationId: 1, status: 1 });
InvoiceSchema.index({ bookingId: 1 });

const InvoiceModel = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
export default InvoiceModel;
import mongoose, { Schema } from 'mongoose';

const InvoiceSchema = new Schema(
  {
    bookingId: { type: String, required: true },
    amount: Number,
    type: { type: String, enum: ['Advance', 'Rent'] },
    transactionType: { type: String, enum: ['online', 'cash', 'upi', 'card'] },
    transactionId: String,
    status: { type: String, enum: ['paid', 'unpaid', 'failed'], default: 'unpaid' },
    due: Date,
    disabled: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const InvoiceModel = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
export default InvoiceModel;

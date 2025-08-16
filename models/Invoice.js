import mongoose, { Schema } from 'mongoose';

const InvoiceSchema = new Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
      propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    spaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    amount: Number,
    balance: Number,
    carryForwerded: Number,
    type: { type: String, enum: ['Advance', 'Rent','Other'] },
    payments: [
      {
        date: Date,
        amount: Number,
        transactionId: String,
        transactionType: { type: String, enum: ['online', 'cash', 'upi', 'card'] },
      },
    ],
    status: { type: String, enum: ['paid', 'unpaid', 'failed','balance','carry forworded'], default: 'unpaid' },
    dueDate: Date,
    disabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const InvoiceModel = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
export default InvoiceModel;

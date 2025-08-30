import mongoose, { Schema } from 'mongoose';
import { InvoiceStatus, TransactionType } from '@/utils/contants';

const InvoiceSchema = new Schema(
  {
    organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
    invoiceId: { type: String, require: true },
    amount: Number,
    balance: Number,
    carryForwerded: Number,
    type: { type: String },
    status: { type: String, default: InvoiceStatus.PENDING },
    dueDate: Date,
    disabled: { type: Boolean, required: true, default: false },
    payments: [
      {
        date: Date,
        amount: Number,
        transactionId: String,
        transactionType: { type: String, default: TransactionType.INHAND },
      },
    ],
  },
  { timestamps: true }
);


const InvoiceModel = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
export default InvoiceModel;

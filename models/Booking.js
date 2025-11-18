import mongoose, { Schema, Types } from 'mongoose';
import { BookingStatus, RentFrequency } from '@/utils/contants';

const BookingSchema = new Schema(
  {
    organisationId: { type: Types.ObjectId, ref: "Organisation", required: true },
    propertyId: { type: Types.ObjectId, ref: "Property", required: true },
    unitId: { type: Types.ObjectId, ref: "Unit", required: true },
    code: { type: String, required: true, unique: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    amount: { type: Number, required: true },
    advanceAmount: { type: Number},
    frequency: { type: String, enum: RentFrequency },
    status: { type: String, required: true, enum: BookingStatus, default: BookingStatus.CHECKED_IN },
    lastInvoiceId: { type: Types.ObjectId, ref: "Invoice" },
    nextBillingDate: { type: Date },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);


const BookingModel = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default BookingModel;


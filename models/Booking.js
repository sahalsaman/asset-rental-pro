import mongoose, { Schema, Types } from 'mongoose';
import { BookingStatus, RentFrequency } from '@/utils/contants';

const BookingSchema = new Schema(
  {
    organisationId: { type: Types.ObjectId, ref: "Organisation", required: true },
    propertyId: { type: Types.ObjectId, ref: "Property", required: true },
    roomId: { type: Types.ObjectId, ref: "Room", required: true },
    fullName: { type: String, required: true },
    countryCode: { type: String, required: true, default: "+91" },
    phone: { type: String, required: true },
    whatsappCountryCode: { type: String, required: true, default: "+91" },
    whatsappNumber: { type: String, required: true },
    otp: { type: String },
    otpVerified: { type: Boolean, required: true, default: false },
    address: { type: String, required: true },
    verificationIdCard: { type: String },
    verificationIdCardNumber: { type: String },
    checkIn: { type: Date },
    checkOut: { type: Date },
    amount: { type: Number, required: true },
    advanceAmount: Number,
    frequency: { type: String, enum: RentFrequency },
    status: { type: String, default: BookingStatus.CONFIRMED },
    lastInvoiceId: { type: Types.ObjectId, ref: "Invoice" },
    nextBillingDate: { type: Date },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);


const BookingModel = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default BookingModel;


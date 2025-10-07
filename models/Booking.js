import mongoose, { Schema, Types } from 'mongoose';
import { BookingStatus } from '@/utils/contants';

const BookingSchema = new Schema(
  {
    organisationId: { type: Types.ObjectId, ref: "Organisation", required: true },
    propertyId: { type: Types.ObjectId, ref: "Property", required: true },
    roomId: { type: Types.ObjectId, ref: "Room", required: true },
    fullName: { type: String, required: true }, 
    phone: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    address: { type: String, required: true },
    verificationIdCard: { type: String},
    verificationIdCardNumber: { type: String},
    checkIn: { type: Date},
    checkOut: { type: Date },
    amount: Number,
    advanceAmount: Number,
    status: { type: String, default: BookingStatus.CONFIRMED },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);


const BookingModel = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default BookingModel;


import mongoose, { Schema, Types } from 'mongoose';
import { RentFrequency, UnitStatus } from '@/utils/contants';

const UnitSchema = new Schema(
  {
    organisationId: { type: Types.ObjectId, ref: "Organisation", required: true },
    propertyId: { type: Types.ObjectId, ref: "Property", required: true },
    name: String,
    type: String, // Example: 2BHK, 4 Bed
    amount: Number,
    advanceAmount: Number,
    description: String,
    images: [String],
    videoUrl: [String],
    frequency: { type: String, enum: RentFrequency },
    status: { type: String, default: UnitStatus.AVAILABLE },
    noOfSlots: { type: Number, required: true, default: 1 },
    currentBooking: { type: Number, default: 0 },
    Bookings: [{ type: Types.ObjectId, ref: "Booking" }],
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);


const UnitModel = mongoose.models.Unit || mongoose.model('Unit', UnitSchema);
export default UnitModel;

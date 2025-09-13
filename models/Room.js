import mongoose, { Schema } from 'mongoose';
import { RoomStatus } from '@/utils/contants';

const RoomSchema = new Schema(
  {
    organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    name: String,
    type: String, // Example: 2BHK, 4 Bed
    amount: Number,
    description: String,
    images: [String],
    frequency: { type: String, enum: ['Day', 'Week', 'Month', 'Year'] },
    status: { type: String, default: RoomStatus.AVAILABLE },
    advanceAmount: Number,
    noOfSlots: { type: Number, required: true, default: 1 },
    currentBooking: { type: Number, default: 0 },
    Bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    disabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);


const RoomModel = mongoose.models.Room || mongoose.model('Room', RoomSchema);
export default RoomModel;

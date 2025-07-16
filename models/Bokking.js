import mongoose, { Schema } from 'mongoose';

const BookingSchema = new Schema(
  {
    userId: { type: String, required: true },
    propertyId: { type: String, required: true },
    spaceId: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    amount: Number,
    advance: Number,
    currency: String,
    bookingType: { type: String, enum: ['single', 'recurring'] },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    disabled: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const BookingModel = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default BookingModel;

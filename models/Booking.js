import mongoose, { Schema } from 'mongoose';

const BookingSchema = new Schema(
  {
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
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
    fullName: { type: String, required: true }, 
    phone: { type: String, required: true },
    address: { type: String, required: true },
    vericationIdCard: { type: String},
    vericationIdCardNumber: { type: String},
    checkIn: { type: Date},
    checkOut: { type: Date },
    amount: Number,
    advanceAmount: Number,
    status: { 
      type: String, 
      default: 'pending' 
    },
    disabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const BookingModel = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default BookingModel;


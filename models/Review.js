import mongoose, { Schema, Types } from 'mongoose';

const ReviewSchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true },
    bookingId: { type: Types.ObjectId, ref: "Booking", required: true },
    propertyId: { type: Types.ObjectId, ref: "Property", required: true },
    unitId: { type: Types.ObjectId, ref: "Unit", required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 1 },
    feedback: { type: String },
    response: { type: String },
    source: { type: String, enum: ['internal', 'google'], default: 'internal' },
    externalId: { type: String },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export default ReviewModel;
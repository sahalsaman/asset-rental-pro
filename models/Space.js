import mongoose, { Schema } from 'mongoose';

const SpaceSchema = new Schema(
  {
    propertyId: { type: String, required: true },
    name: String,
    type: String, // Example: 2BHK, 4 Bed
    amount: Number,
    description: String,
    floor: Number,
    images: [String],
    rentType: { type: String, enum: ['Day', 'Week', 'Month', 'Year'] },
    status: { type: String, enum: ['available', 'booked', 'maintenance'], default: 'available' },
    advance: Number,
    advanceDescription: String,
    currency: String,
  },
  { timestamps: true }
);

const SpaceModel = mongoose.models.Space || mongoose.model('Space', SpaceSchema);
export default SpaceModel;

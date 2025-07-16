import mongoose, { Schema } from 'mongoose';

const PropertySchema = new Schema(
  {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    category: { type: String, enum: ['Room', 'Hotel', 'Hostel'] },
    images: [String],
    amount: Number,
    rentType: { type: String, enum: ['Day', 'Week', 'Month', 'Year'] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    advance: Number,
    advanceDescription: String,
    currency: String,
    userId: String,
    ownerId: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PropertyModel = mongoose.models.Property || mongoose.model('Property', PropertySchema);
export default PropertyModel;

import mongoose, { Schema } from 'mongoose';

const PropertySchema = new Schema(
  {
    name: String,
    description: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    category: { type: String, enum: ['Room', 'Hotel', 'Hostel'] },
    images: [String],
    currency: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    disabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const PropertyModel = mongoose.models.Property || mongoose.model('Property', PropertySchema);
export default PropertyModel;

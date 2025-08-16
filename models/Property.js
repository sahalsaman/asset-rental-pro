import mongoose, { Schema } from 'mongoose';

const PropertySchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: String,
    zipCode: String,
    category: { type: String, required: true },
    images: [String],
    currency: { type: String, required: true },
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

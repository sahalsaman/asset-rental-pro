import mongoose, { Schema } from 'mongoose';
import { PropertyStatus } from '@/utils/contants';

const PropertySchema = new Schema(
  {
    organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    name: { type: String, required: true },
    description: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: String,
    zipCode: String, 
    status: { type: String, default: PropertyStatus.AVAILABLE },
    category: { type: String, required: true },
    images: [String],
    currency: { type: String, required: true },
    disabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);


const PropertyModel = mongoose.models.Property || mongoose.model('Property', PropertySchema);
export default PropertyModel;

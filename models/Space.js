import mongoose, { Schema } from 'mongoose';

const SpaceSchema = new Schema(
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
    name: String,
    type: String, // Example: 2BHK, 4 Bed
    amount: Number,
    description: String,
    images: [String],
    rentType: { type: String, enum: ['Day', 'Week', 'Month', 'Year'] },
    status: { type: String, default: 'available' },
    advanceAmount: Number,
    noOfSlots: { type: Number, required: true, default: 1 },
    disabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const SpaceModel = mongoose.models.Space || mongoose.model('Space', SpaceSchema);
export default SpaceModel;

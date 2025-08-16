import mongoose, { Schema, Types } from 'mongoose';

const OrganisationSchema = new Schema(
  {
    name: { type: String, required: true }, // Full organisation name
    logo: { type: String }, // Store logo URL or base64
    owner: { type: Types.ObjectId, ref: "User", required: true }, // Organisation owner
    managers: [{ type: Types.ObjectId, ref: "User" }],
    website: { type: String },
    disabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const OrganisationModel =
  mongoose.models.Organisation || mongoose.model("Organisation", OrganisationSchema);

export default OrganisationModel;

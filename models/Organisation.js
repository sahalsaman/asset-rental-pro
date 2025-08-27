import mongoose, { Schema, Types } from 'mongoose';

const OrganisationSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String },
    owner: { type: Types.ObjectId, ref: "User", required: true },
    managers: [{ type: Types.ObjectId, ref: "User" }],
    website: { type: String },
    disabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);


const OrganisationModel =
  mongoose.models.Organisation || mongoose.model("Organisation", OrganisationSchema);

export default OrganisationModel;

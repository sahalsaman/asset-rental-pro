import mongoose, { Schema, Types } from 'mongoose';

const UserSchema = new Schema(
  {    
    firstName: { type: String, required: true },
    lastName: { type: String },
    phone: { type: String, required: true,unique: true },
    otp: { type: String },
    role: { type: String, enum: ['owner', 'manager', 'user', 'admin'], required: true ,default:"user"},
    otpExpireTime: { type: Date },
    onboardingCompleted: { type: Boolean, required: true, default: false },
    lastLogin: { type: Date },
    properties: [{ type: Types.ObjectId, ref: "Property" }],
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
    },
    disabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;

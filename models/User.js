import { UserRoles } from '@/utils/contants';
import mongoose, { Schema, Types } from 'mongoose';

const UserSchema = new Schema(
  {    
    firstName: { type: String, required: true },
    lastName: { type: String },
    countryCode: { type: String, required: true, default: "+91" },
    phone: { type: String, required: true, unique: true, index: true },
    otp: { type: String },
    role: { 
      type: String, 
      enum: UserRoles, 
      required: true,
      default: UserRoles.USER 
    },
    otpExpireTime: { type: Date },
    onboardingCompleted: { type: Boolean, required: true, default: false },
    lastLogin: { type: Date },
    properties: [{ type: Types.ObjectId, ref: "Property" }],
    organisationId: {
      type: Types.ObjectId,
      ref: "Organisation",
    },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    remark: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;

import { UserRoles } from '@/utils/contants';
import mongoose, { Schema, Types } from 'mongoose';

const UserSchema = new Schema(
  {
    // for admin login
    username: { type: String },
    password: { type: String },
    
    // common fields
    firstName: { type: String, required: true },
    lastName: { type: String },
    countryCode: { type: String, required: true, default: "+91" },
    phone: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    otp: { type: String },
    otpExpireTime: { type: Date },
    otpVerified: { type: Boolean, required: true, default: false },
    role: {
      type: String,
      enum: UserRoles,
      required: true,
      default: UserRoles.USER
    },
    // owner or manager of the properties
    properties: [{ type: Types.ObjectId, ref: "Property" }],
    organisationId: {type: Types.ObjectId,ref: "Organisation",},

    // tenant details
    address: { type: String },
    image: {
      id: String,
      url: String,
      delete_url: String
    },
    note: { type: String },
    verificationIdCard: { type: String },
    verificationIdCardNumber: { type: String },

    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    remark: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;

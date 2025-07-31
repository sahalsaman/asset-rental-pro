import mongoose, { Schema, Types } from 'mongoose';

const AuthSchema = new Schema(
  {
    phone: { type: String, required: true,unique: true },
    otp: { type: String },
    role: { type: String, enum: ['owner', 'manager', 'user', 'admin'], required: true ,default:"user"},
    otpExpireTime: { type: Date },
    userId: { type: Types.ObjectId, ref: "User" },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AuthModel = mongoose.models.Auth || mongoose.model('Auth', AuthSchema);
export default AuthModel;

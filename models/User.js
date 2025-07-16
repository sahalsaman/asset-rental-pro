import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String },
    role: { type: String, enum: ['owner', 'manager', 'tenant', 'admin'], required: true },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;

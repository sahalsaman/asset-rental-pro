import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    // email: { type: String },
    role: { type: String, enum: ['owner', 'manager', 'user', 'admin'], required: true, default:"user"},
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;

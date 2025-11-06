
import mongoose, { Schema, Types } from 'mongoose';

const UserSchema = new Schema(
  {    
    Name: { type: String, required: true },
    countryCode: { type: String, required: true, default: "+91" },
    phone: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    address: { type: String},
    city: { type: String },
    state: { type: String},
    country: { type: String},
    status: { type: String},
    property_type: { type: String},
    lead_from: { type: String},
    assign: { type: String},
    note: { type: String},
    label: { type: String},
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    remark: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;

import mongoose, { Schema } from "mongoose";
import { EnquiryStatus } from '@/utils/contants';

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: EnquiryStatus,
      default: EnquiryStatus.NEW,
    },
    leadOperater: { type: String },
  },
  { timestamps: true }
);

const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
export default EnquiryModel;

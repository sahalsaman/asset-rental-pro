import { BankStatus, PaymentRecieverOptions } from '@/utils/contants';
import mongoose, { Schema, Types } from 'mongoose';

const SelfRecieveBankOrUpiSchema = new Schema(
  {
    business: {
      type: Types.ObjectId,
      ref: "Business",
      required: true
    },
    paymentRecieverOption: { type: String, enum: PaymentRecieverOptions, required: true },
    accountHolderName: { type: String, required: true },
    value: { type: String, required: true }, // accountNo, upiId, qrcode_link, upiPhoneNumber
    ifsc: String,
    bankName: String,
    branch: String,
    image: {
      id: String,
      url: String,
      delete_url: String
    },
    upiPhoneCountryCode: { type: String, default: "+91" },
    status: { type: String, enum: BankStatus, default: BankStatus.ACTIVE },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);


export const SelfRecieveBankOrUpiModel = mongoose.models.SelfRecieveBankOrUpi || mongoose.model("SelfRecieveBankOrUpi", SelfRecieveBankOrUpiSchema);
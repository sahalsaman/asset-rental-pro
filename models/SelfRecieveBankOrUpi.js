import {  BankStatus, PaymentRecieverOptions } from '@/utils/contants';
import mongoose, { Schema, Types } from 'mongoose';

const SelfRecieveBankOrUpiSchema = new Schema(
  {
     organisation: {
      type: Types.ObjectId,
      ref: "Organisation",
      required: true
    },
    paymentRecieverOption: { type: String, enum: PaymentRecieverOptions, required: true },
    accountHolderName: { type: String, required: true },
    value: { type: String, required: true }, // accountNo, upiId, qrcode_link, upiPhoneNumber
    ifsc: String,
    bankName: String,
    branch: String,
    upiPhoneCountryCode: { type: String, default: "+91" },
    status: { type: String, enum: BankStatus, default: BankStatus.ACTIVE },
  },
  { timestamps: true }
);


export const SelfRecieveBankOrUpiModel = mongoose.models.SelfRecieveBankOrUpiUpi || mongoose.model("SelfRecieveBankOrUpi", SelfRecieveBankOrUpiSchema);
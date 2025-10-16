import {  BankStatus, PaymentRecieverOptions } from '@/utils/contants';
import mongoose, { Schema, Types } from 'mongoose';

const BankDetailSchema = new Schema(
  {
     organisation: {
      type: Types.ObjectId,
      ref: "Organisation",
      required: true
    },
    paymentRecieverOption: { type: String, enum: PaymentRecieverOptions, required: true },
    accountNo: String,
    ifsc: String,
    accountHolderName: String,
    bankName: String,
    branch: String,
    upiId: String,
    qrcode_link: String,
    upiPhoneNumber: String,
    upiPhoneCountryCode: { type: String, default: "+91" },
    status: { type: String, enum: BankStatus, default: BankStatus.ACTIVE },
  },
  { timestamps: true }
);


export const BankDetailnModel = mongoose.models.BankDetail || mongoose.model("BankDetail", BankDetailSchema);
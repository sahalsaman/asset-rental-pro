import mongoose, { Schema, Types } from 'mongoose';

const CronJobSchema = new Schema(
  {
    message: { type: String},
    type: { type: String},
    createdBy: { type: String},
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },

  },
  { timestamps: true }
);

const CronJobModel = mongoose.models.CronJob || mongoose.model('CronJob', CronJobSchema);
export default CronJobModel;

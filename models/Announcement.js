import { AnnouncementType } from '@/utils/contants';
import mongoose, { Schema, Types } from 'mongoose';

const AnnouncementSchema = new Schema(
  {
    organisationId: { type: Types.ObjectId, ref: "Organisation", required: true },
    propertyId: { type: Types.ObjectId, ref: "Property", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    audienceType: { type: String, enum: AnnouncementType, default: AnnouncementType.ALL },
    attachments: [String], // URLs for any attached files or images
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    disabled: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const AnnouncementModel = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
export default AnnouncementModel;

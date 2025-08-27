import mongoose, { Schema } from 'mongoose';

const AnnouncementSchema = new Schema(
  {
    organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: { type: String, enum: ["all", "employees", "customers"], default: "all" },
    disabled: { type: Boolean, required: true, default: false },
    attachments: [String], // URLs for any attached files or images
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const AnnouncementModel = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
export default AnnouncementModel;

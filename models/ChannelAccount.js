import mongoose from "mongoose";

const ChannelAccountSchema = new mongoose.Schema(
    {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
            index: true,
        },
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChannelProvider",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ["connected", "disconnected", "error"],
            default: "disconnected",
        },
        credentials: {
            type: Object, // Store API keys or tokens here securely (consider encryption in production)
            default: {}
        }
    },
    { timestamps: true }
);

// Ensure one account per provider per user
ChannelAccountSchema.index({ businessId: 1, providerId: 1 }, { unique: true });

const ChannelAccountModel = mongoose.models.ChannelAccount || mongoose.model("ChannelAccount", ChannelAccountSchema);
export default ChannelAccountModel;

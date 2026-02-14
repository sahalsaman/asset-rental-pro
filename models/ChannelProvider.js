import mongoose from "mongoose";

const ChannelProviderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // e.g., 'airbnb', 'booking', 'agoda'
        },
        displayName: {
            type: String,
            required: true,
        },
        icon: {
            type: String, // URL or icon name
        },
        authType: {
            type: String,
            enum: ["oauth2", "api_key", "ical"],
            default: "api_key",
        },
        bookingAPI: {
            getAPI: String,
            postAPI: String,
            putAPI: String,
            deleteAPI: String,
        },
        calendarAPI: {
            getAPI: String,
            postAPI: String,
            putAPI: String,
            deleteAPI: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const ChannelProviderModel = mongoose.models.ChannelProvider || mongoose.model("ChannelProvider", ChannelProviderSchema);
export default ChannelProviderModel;

import mongoose from "mongoose";

const ChannelMappingSchema = new mongoose.Schema(
    {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
            index: true,
        },
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },
        unitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Unit",
            required: true,
        },
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChannelProvider",
            required: true,
        },
        externalPropertyId: {
            type: String,
            required: true,
        },
        externalUnitId: {
            type: String,
            required: true,
        },
        syncEnabled: {
            type: Boolean,
            default: true,
        },
        lastSync: {
            type: Date,
        }
    },
    { timestamps: true }
);

// Ensure unique mapping per unit per provider
ChannelMappingSchema.index({ unitId: 1, providerId: 1 }, { unique: true });

const ChannelMappingModel = mongoose.models.ChannelMapping || mongoose.model("ChannelMapping", ChannelMappingSchema);
export default ChannelMappingModel;

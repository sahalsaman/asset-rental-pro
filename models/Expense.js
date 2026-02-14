import mongoose, { Schema, Types } from 'mongoose';

const ExpenseSchema = new Schema(
    {
        businessId: { type: Types.ObjectId, ref: "Business", required: true },
        propertyId: { type: Types.ObjectId, ref: "Property" },
        category: {
            type: String,
            required: true,
            enum: ['Maintenance', 'Utilities', 'Salaries', 'Rent', 'Marketing', 'Taxes', 'Other'],
            default: 'Other'
        },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        description: { type: String },
        receiptUrl: { type: String },
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const ExpenseModel = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
export default ExpenseModel;

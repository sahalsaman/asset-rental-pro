import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import ExpenseModel from "@/../models/Expense";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

export async function GET(request) {
    try {
        const user = getTokenValue(request);
        if (!user || (!user.businessId && user.role !== UserRoles.ADMIN)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();

        let query = { deleted: false };
        if (user.role !== UserRoles.ADMIN) {
            query.businessId = user.businessId;
        }

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const propertyId = searchParams.get("propertyId");

        if (category) query.category = category;
        if (propertyId) query.propertyId = propertyId;

        const expenses = await ExpenseModel.find(query).sort({ date: -1 }).populate('propertyId', 'name');
        return NextResponse.json(expenses);
    } catch (err) {
        return NextResponse.json({ message: "Failed to fetch expenses", details: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = getTokenValue(request);
        if (!user || !user.businessId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();
        const body = await request.json();

        const expense = await ExpenseModel.create({
            ...body,
            businessId: user.businessId
        });

        return NextResponse.json({ message: "Expense added", expense }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: "Failed to add expense", details: err.message }, { status: 400 });
    }
}

export async function PUT(request) {
    try {
        const user = getTokenValue(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!user || (!user.businessId && user.role !== UserRoles.ADMIN)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();
        const body = await request.json();

        let query = { _id: id };
        if (user.role !== UserRoles.ADMIN) {
            query.businessId = user.businessId;
        }

        const updated = await ExpenseModel.findOneAndUpdate(query, body, { new: true });
        if (!updated) return NextResponse.json({ message: "Expense not found" }, { status: 404 });

        return NextResponse.json({ message: "Expense updated", updated });
    } catch (err) {
        return NextResponse.json({ message: "Failed to update expense", details: err.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    try {
        const user = getTokenValue(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!user || (!user.businessId && user.role !== UserRoles.ADMIN)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();

        let query = { _id: id };
        if (user.role !== UserRoles.ADMIN) {
            query.businessId = user.businessId;
        }

        const deleted = await ExpenseModel.findOneAndUpdate(query, { deleted: true }, { new: true });
        if (!deleted) return NextResponse.json({ message: "Expense not found" }, { status: 404 });

        return NextResponse.json({ message: "Expense deleted" });
    } catch (err) {
        return NextResponse.json({ message: "Failed to delete expense", details: err.message }, { status: 500 });
    }
}

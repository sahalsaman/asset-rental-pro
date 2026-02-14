import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import InvoiceModel from "@/../models/Invoice";
import { getTokenValue, IPayload } from "@/utils/tokenHandler";
import { UserRoles, InvoiceStatus, RentAmountType } from "@/utils/contants";
import mongoose from "mongoose";

export async function GET(request: Request) {
    try {
        const token = getTokenValue(request);
        const user = token as IPayload;

        if (!user || (user.role !== UserRoles.OWNER && user.role !== UserRoles.MANAGER)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();

        const businessId = new mongoose.Types.ObjectId(user.businessId);

        // 1. Total Revenue (Lifetime)
        const totalRevenueResult = await InvoiceModel.aggregate([
            {
                $match: {
                    businessId: businessId,
                    status: InvoiceStatus.PAID,
                    deleted: false,
                    type: RentAmountType.RENT // Assuming we only count Rent for revenue, or remove this to count all
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        const totalRevenue = totalRevenueResult[0]?.total || 0;

        // 2. Monthly Revenue (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of month

        const monthlyRevenue = await InvoiceModel.aggregate([
            {
                $match: {
                    businessId: businessId,
                    status: InvoiceStatus.PAID,
                    deleted: false,
                    paidAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$paidAt" },
                        month: { $month: "$paidAt" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format monthly data
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
            month: `${months[item._id.month - 1]} ${item._id.year}`,
            revenue: item.total
        }));

        // 3. Current Month Revenue
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthRevenueResult = await InvoiceModel.aggregate([
            {
                $match: {
                    businessId: businessId,
                    status: InvoiceStatus.PAID,
                    deleted: false,
                    paidAt: { $gte: currentMonthStart }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        const currentMonthRevenue = currentMonthRevenueResult[0]?.total || 0;

        // 4. Last Month Revenue
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const lastMonthRevenueResult = await InvoiceModel.aggregate([
            {
                $match: {
                    businessId: businessId,
                    status: InvoiceStatus.PAID,
                    deleted: false,
                    paidAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

        // 5. Recent Transactions
        const recentTransactions = await InvoiceModel.find({
            businessId: businessId,
            status: InvoiceStatus.PAID,
            deleted: false
        })
            .sort({ paidAt: -1 })
            .limit(10)
            .populate("propertyId", "name")
            .populate("unitId", "name")
            .populate({
                path: "bookingId",
                populate: { path: "userId", select: "firstName lastName" }
            });

        return NextResponse.json({
            totalRevenue,
            currentMonthRevenue,
            lastMonthRevenue,
            monthlyRevenue: formattedMonthlyRevenue,
            recentTransactions
        });

    } catch (err: any) {
        console.error("Error fetching revenue data:", err);
        return NextResponse.json({ message: "Error fetching revenue data", error: err.message }, { status: 500 });
    }
}

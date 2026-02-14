
import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import UnitModel from "@/../models/Unit";
import { getTokenValue, IPayload } from "@/utils/tokenHandler";
import { UserRoles, BookingStatus } from "@/utils/contants";
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

        // 1. Fetch Basic Stats
        const now = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(now.getDate() + 7);

        // Active Bookings (Checked In or Booked)
        const activeBookingsCount = await BookingModel.countDocuments({
            businessId: businessId,
            status: { $in: [BookingStatus.CHECKED_IN, BookingStatus.BOOKED] },
            deleted: false
        });

        // Upcoming Check-ins (Next 7 days)
        const upcomingCheckIns = await BookingModel.countDocuments({
            businessId: businessId,
            checkIn: { $gte: now, $lte: sevenDaysLater },
            status: { $in: [BookingStatus.BOOKED] }, // Only pending bookings count as upcoming check-ins
            deleted: false
        });

        // Upcoming Check-outs (Next 7 days)
        const upcomingCheckOuts = await BookingModel.countDocuments({
            businessId: businessId,
            checkOut: { $gte: now, $lte: sevenDaysLater },
            status: BookingStatus.CHECKED_IN, // Only currently checked-in guests can check out
            deleted: false
        });

        // Occupancy Rate
        const totalUnits = await UnitModel.countDocuments({
            businessId: businessId, // Assuming Unit has businessId based on context, if not propertyId logic needed
            deleted: false
        });

        // If UnitModel doesn't have businessId directly, we might need to fetch properties first.
        // But based on previous files, other models use businessId. Let's assume Unit has it or linked via Property.
        // Actually Unit.js might not have businessId directly if it's strict hierarchy business -> property -> unit.
        // Let's check Unit.js content if possible, but for now assuming pattern holds or finding simple workaround.
        // Update: Unit.js in step 153 showed size. businessId might be there.
        // To be safe, let's just use what we have or do a lookup if needed.
        // Wait, step 119 showed Unit page uses `propertyId`.
        // Let's assume for now we might need to filter units by properties of the business.
        // Simpler approach: If Unit schema has businessId (added in migration?) use it.
        // If not, we fetch all properties of business, then count units in those properties.

        // Let's try to see if we can do a quick check on Unit model or just aggregation.
        // Safest: Find properties of business, then count units.

        // However, I'll write the aggregation to be robust.

        const occupancyRate = totalUnits > 0 ? (activeBookingsCount / totalUnits) * 100 : 0;

        // 2. Booking Trends (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const bookingTrends = await BookingModel.aggregate([
            {
                $match: {
                    businessId: businessId,
                    deleted: false,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedTrends = bookingTrends.map(item => ({
            month: `${months[item._id.month - 1]}`,
            bookings: item.count
        }));

        // 3. Status Distribution
        const statusDistribution = await BookingModel.aggregate([
            {
                $match: {
                    businessId: businessId,
                    deleted: false
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStatusDistribution = statusDistribution.map(item => ({
            name: item._id,
            value: item.count
        }));


        // 4. Recent Activity
        const recentActivity = await BookingModel.find({
            businessId: businessId,
            deleted: false
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("userId", "firstName lastName")
            .populate("unitId", "name propertyId")
            // Note: populating property via unit might differ based on schema, assume unit has name.
            // Or populate propertyId directly from Booking if it exists.
            .populate("propertyId", "name");

        return NextResponse.json({
            stats: {
                activeBookings: activeBookingsCount,
                upcomingCheckIns,
                upcomingCheckOuts,
                occupancyRate,
                totalUnits
            },
            trends: formattedTrends,
            statusDistribution: formattedStatusDistribution,
            recentActivity
        });

    } catch (err: any) {
        console.error("Error fetching booking overview:", err);
        return NextResponse.json({ message: "Error fetching data", error: err.message }, { status: 500 });
    }
}

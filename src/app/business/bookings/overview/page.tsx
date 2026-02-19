"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { DashboardSkeleton } from "@/components/Loader";
import { LayoutList, Calendar as CalendarIcon, PieChart, TrendingUp, Users, CheckCircle, Clock, DoorOpen, Calendar as CalendarHeaderIcon } from "lucide-react";
import { motion } from "framer-motion";

import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

export default function BookingOverviewPage() {
    const property = localStorageServiceSelectedOptions.getItem()?.property;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (property?._id) fetchOverviewData();
    }, [property?._id]);

    const fetchOverviewData = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/business/bookings-overview");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error("Error fetching overview:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <DashboardSkeleton />;
    if (!data) return <div className="p-10 text-center text-gray-500">Failed to load booking data.</div>;

    const { stats, trends, statusDistribution, recentActivity } = data;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <OverviewStatCard
                    title="Active Bookings"
                    value={stats.activeBookings}
                    icon={<Users className="text-blue-600" size={20} />}
                    bg="bg-blue-50"
                />
                <OverviewStatCard
                    title="Expected Check-ins"
                    value={stats.upcomingCheckIns}
                    label="Next 7 days"
                    icon={<CheckCircle className="text-green-600" size={20} />}
                    bg="bg-green-50"
                />
                <OverviewStatCard
                    title="Expected Check-outs"
                    value={stats.upcomingCheckOuts}
                    label="Next 7 days"
                    icon={<Clock className="text-orange-600" size={20} />}
                    bg="bg-orange-50"
                />
                <OverviewStatCard
                    title="Occupancy Rate"
                    value={`${Math.round(stats.occupancyRate)}%`}
                    icon={<DoorOpen className="text-purple-600" size={20} />}
                    bg="bg-purple-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booking Trends Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 italic">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={18} /> Booking Trends (Last 6 Months)
                    </h3>
                    <div className="h-64 w-full flex items-end justify-between gap-4 px-2">
                        {trends.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No trend data available</div>
                        ) : (
                            trends.map((item: any, i: number) => {
                                const maxVal = Math.max(...trends.map((t: any) => t.bookings), 1);
                                const height = (item.bookings / maxVal) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                                        <div className="relative w-full flex justify-center items-end h-full bg-gray-50 rounded-t-sm overflow-hidden">
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                {item.bookings} bookings
                                            </div>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                className="w-full mx-0.5 bg-blue-500/10 rounded-t-sm group-hover:bg-blue-500/20 transition-colors relative"
                                            >
                                                <div className="h-1 w-full bg-blue-500 absolute top-0 left-0" />
                                            </motion.div>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-500 mt-3 uppercase">{item.month}</p>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <PieChart size={18} /> Status Distribution
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        {statusDistribution.length === 0 ? (
                            <p className="text-gray-400">No data</p>
                        ) : (
                            <div className="w-full space-y-4">
                                {statusDistribution.map((status: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status.name)}`} />
                                            <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">
                                                {status.name === "Checked-In" ? "Checked In" : status.name.replace('-', ' ')}
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{status.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {statusDistribution.length > 0 && (
                            <div className="mt-8 relative w-28 h-28 rounded-full border-4 border-gray-100 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="block text-xl font-bold text-gray-800">{stats.activeBookings}</span>
                                    <span className="text-[8px] text-gray-400 uppercase font-bold tracking-wider">Active</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b bg-gray-50/30">
                    <h3 className="text-lg font-bold text-gray-800">Recent Bookings</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                <th className="px-6 py-4">Guest</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4 text-right">Status</th>
                                <th className="px-6 py-4 text-right">Booked On</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {recentActivity.map((booking: any) => (
                                <tr key={booking._id} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 h-16">
                                    <td className="px-6 py-3 font-bold text-gray-900">
                                        {booking.userId?.firstName} {booking.userId?.lastName}
                                    </td>
                                    <td className="px-6 py-3 text-gray-600">
                                        <span className="font-bold text-gray-800">{booking.unitId?.name || "—"}</span>
                                        <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-tighter">{booking.propertyId?.name}</span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right text-gray-500 font-medium">{new Date(booking.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {recentActivity.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-gray-400 italic">No recent bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function OverviewStatCard({ title, value, label, icon, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg ${bg}`}>
                    {icon}
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">{title}</p>
                {label && <p className="text-[10px] text-gray-400 mt-1 font-medium italic">{label}</p>}
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case "Checked-In": return "bg-green-500";
        case "Booked": return "bg-blue-500";
        case "Checked-Out": return "bg-gray-400";
        case "Cancelled": return "bg-red-400";
        default: return "bg-gray-300";
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case "Checked-In": return "bg-green-100 text-green-700 border border-green-200";
        case "Booked": return "bg-blue-100 text-blue-700 border border-blue-200";
        case "Checked-Out": return "bg-gray-100 text-gray-700 border border-gray-200";
        case "Cancelled": return "bg-red-50 text-red-600 border border-red-100";
        default: return "bg-gray-100 text-gray-600 border border-gray-200";
    }
}

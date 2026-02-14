"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { DashboardSkeleton, TableSkeleton, CardGridSkeleton } from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

export default function RevenuePage() {
    const property = localStorageServiceSelectedOptions.getItem()?.property;
    const currency = property?.currency || "₹";
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const res = await apiFetch("/api/business/revenue");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Error fetching revenue:", error);
            } finally {
                setLoading(false);
            }
        };
        if (property?._id) fetchRevenueData();
    }, [property?._id]);

    if (loading) return <DashboardSkeleton />;
    if (!data) return <div className="p-10 text-center text-gray-500">Failed to load revenue data.</div>;

    const { totalRevenue, currentMonthRevenue, lastMonthRevenue, monthlyRevenue, recentTransactions } = data;
    const revenueChange = lastMonthRevenue === 0 ? (currentMonthRevenue > 0 ? 100 : 0) : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`${currency}${totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="w-5 h-5 text-green-600" />}
                    bg="bg-green-50"
                />
                <StatCard
                    title="This Month"
                    value={`${currency}${currentMonthRevenue.toLocaleString()}`}
                    icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                    bg="bg-blue-50"
                    trend={revenueChange}
                    trendLabel="vs last month"
                />
                <StatCard
                    title="Last Month"
                    value={`${currency}${lastMonthRevenue.toLocaleString()}`}
                    icon={<CreditCard className="w-5 h-5 text-purple-600" />}
                    bg="bg-purple-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg">Monthly Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-end gap-2 sm:gap-4 justify-between mt-4">
                            {monthlyRevenue.map((item: any, index: number) => {
                                const maxRevenue = Math.max(...monthlyRevenue.map((d: any) => d.revenue));
                                const heightPercentage = maxRevenue === 0 ? 0 : (item.revenue / maxRevenue) * 100;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
                                        <div className="w-full h-full flex items-end justify-center rounded-t-md overflow-hidden bg-gray-50 relative group">
                                            <div className="absolute -top-8 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                                                {currency}{item.revenue.toLocaleString()}
                                            </div>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${heightPercentage}%` }}
                                                className="w-full mx-1 bg-green-100 rounded-t-md group-hover:bg-green-200 transition-colors relative"
                                            >
                                                <div className="h-1 w-full bg-green-500 absolute top-0 left-0" />
                                            </motion.div>
                                        </div>
                                        <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center uppercase font-bold">{item.month.split(' ')[0]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {recentTransactions.map((tx: any) => (
                                <div key={tx._id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-xs shrink-0">
                                            {tx.bookingId?.userId?.firstName?.[0] || "?"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">{tx.bookingId?.userId?.firstName} {tx.bookingId?.userId?.lastName}</p>
                                            <p className="text-[10px] text-gray-500 truncate">{tx.unitId?.name} • {new Date(tx.paidAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-700 text-xs">
                                        +{currency}{tx.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, bg, trend, trendLabel }: any) {
    return (
        <Card className="border-slate-200">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${bg}`}>
                        {icon}
                    </div>
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                            {Math.abs(trend).toFixed(1)}%
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500 font-medium">{title}</p>
                        {trendLabel && <p className="text-[10px] text-gray-400">• {trendLabel}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
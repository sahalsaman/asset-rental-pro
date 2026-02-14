"use client";

import { Building2, Users, Building, Calendar, IndianRupee, Lamp, ArrowUpRight, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import DashboardCard from "../../../components/card";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { RevenueChart } from "@/components/RevenueChart";
import { BookingTrendChart } from "@/components/BookingTrendChart";
import { FullscreenLoader, DashboardSkeleton } from "@/components/Loader";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState({
    businessCount: 0,
    vendorCount: 0,
    userCount: 0,
    propertyCount: 0,
    bookingCount: 0,
    subcriptionPaymentLastMonth: 0,
    trends: {
      business: [],
      users: []
    }
  });

  const formatTrends = (trends: any[]) => {
    return trends.map(t => ({
      name: monthNames[t._id.month - 1],
      value: t.count
    }));
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/dashboard`);
      if (!res.ok) throw new Error("Failed to fetch dashboard status");
      const data = await res.json();
      setStatus({
        businessCount: data.businessCount,
        vendorCount: data.vendorCount,
        userCount: data.userCount,
        propertyCount: data.propertyCount,
        bookingCount: data.bookingCount,
        subcriptionPaymentLastMonth: data.subcriptionPaymentLastMonth?.total || 0,
        trends: data.trends
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-4 md:p-8 lg:p-12"><DashboardSkeleton /></div>;

  const businessTrendData = formatTrends(status.trends.business).map(d => ({ name: d.name, revenue: d.value }));
  const userTrendData = formatTrends(status.trends.users).map(d => ({ name: d.name, bookings: d.value }));

  return (
    <main className="p-4 md:p-8 lg:p-12 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time performance metrics across the Rentities platform.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
          <div className="bg-green-500/10 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <TrendingUp size={16} />
            Live Status
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <DashboardCard
          title="Total Business"
          value={status?.businessCount}
          icon={Building2}
          color="emerald-600"
          onClick={() => router.push('/admin/business')}
        />
        <DashboardCard
          title="Platform Users"
          value={status?.userCount}
          icon={Users}
          color="blue-600"
          onClick={() => router.push('/admin/users')}
        />
        <DashboardCard
          title="Total Properties"
          value={status?.propertyCount}
          icon={Building}
          color="orange-600"
          onClick={() => router.push('/admin/properties')}
        />
        <DashboardCard
          title="Active Units"
          value={status?.propertyCount}
          icon={Lamp}
          color="purple-600"
        />
        <DashboardCard
          title="Total Bookings"
          value={status?.bookingCount}
          icon={Calendar}
          color="yellow-600"
        />
        <DashboardCard
          title="Revenue Tracking"
          value={status?.subcriptionPaymentLastMonth}
          icon={IndianRupee}
          color="green-600"
          onClick={() => router.push('/admin/payments')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[1rem] p-4 shadow-sm border border-slate-100 overflow-hidden group">
          <div className="p-6 pb-0 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">Business Registration</h3>
              <p className="text-sm text-slate-400 font-medium italic">Monthly growth of new business accounts</p>
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-green-400 transition-all" size={24} />
          </div>
          <RevenueChart data={businessTrendData} />
        </div>

        <div className="bg-white rounded-[1rem] p-4 shadow-sm border border-slate-100 overflow-hidden group">
          <div className="p-6 pb-0 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">User Growth</h3>
              <p className="text-sm text-slate-400 font-medium italic">New tenant/guest registrations</p>
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-blue-400 transition-all" size={24} />
          </div>
          <BookingTrendChart data={userTrendData} />
        </div>
      </div>
    </main>
  );
}

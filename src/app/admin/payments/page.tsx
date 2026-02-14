"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import {
  CreditCard,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  IndianRupee,
  ArrowUpRight,
  History,
  ShieldCheck,
  TrendingUp,
  Receipt,
  MapPin
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { statusColorMap } from "@/utils/contants";

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<"history" | "partners">("history");
  const [payments, setPayments] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const size = 8;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payRes, bizRes] = await Promise.all([
        apiFetch("/api/admin/payment"),
        apiFetch("/api/business")
      ]);
      const payData = await payRes.json();
      const bizData = await bizRes.json();
      setPayments(Array.isArray(payData) ? payData : []);
      setBusinesses(Array.isArray(bizData) ? bizData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dataToFilter = activeTab === "history" ? payments : businesses;
  const filtered = dataToFilter.filter((item: any) => {
    const term = search.toLowerCase();
    if (activeTab === "history") {
      return (
        item.businessId?.name?.toLowerCase().includes(term) ||
        item.razorpay_orderId?.toLowerCase().includes(term) ||
        item.plan?.toLowerCase().includes(term)
      );
    } else {
      return (
        item.name?.toLowerCase().includes(term) ||
        item.owner?.firstName?.toLowerCase().includes(term) ||
        item.subscription?.plan?.toLowerCase().includes(term)
      );
    }
  });

  const totalPages = Math.ceil(filtered.length / size);
  const paginated = filtered.slice((page - 1) * size, page * size);

  if (loading && payments.length === 0 && businesses.length === 0) return <FullscreenLoader />;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <CreditCard className="text-emerald-600" size={32} />
            Financial Operations
          </h1>
          <p className="text-slate-500 font-medium mt-1">Audit subscription revenue, transaction history, and partner financial health.</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          <button
            onClick={() => { setActiveTab("history"); setPage(1); }}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <History size={16} />
            Transaction Audit
          </button>
          <button
            onClick={() => { setActiveTab("partners"); setPage(1); }}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'partners' ? 'bg-white text-slate-900 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Building2 size={16} />
            Partner Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[1rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <TrendingUp size={80} />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Total Platform Revenue</span>
          <span className="text-3xl font-black text-slate-900 flex items-center">
            <IndianRupee size={24} className="text-emerald-500" />
            {payments.reduce((acc, p) => acc + (p.total_price || 0), 0).toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-2">
            <ArrowUpRight size={14} />
            +12% from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-[1rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <ShieldCheck size={80} />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Active Subscriptions</span>
          <span className="text-3xl font-black text-slate-900">
            {businesses.filter(b => b.subscription?.status === 'active').length}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-2">
            <CheckCircle2 size={14} />
            {businesses.length} Total Partners
          </div>
        </div>
        <div className="bg-white p-6 rounded-[1rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Receipt size={80} />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Monthly Avg. / Partner</span>
          <span className="text-3xl font-black text-slate-900 flex items-center">
            <IndianRupee size={24} className="text-indigo-500" />
            {businesses.length ? Math.round(payments.reduce((acc, p) => acc + (p.total_price || 0), 0) / businesses.length).toLocaleString() : 0}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mt-2">
            <Clock size={14} />
            Calculated dynamically
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder={`Search ${activeTab === 'history' ? 'transactions' : 'partners'}...`}
              className="pl-12 h-12 bg-white border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-400/20 transition-all font-medium"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="bg-slate-100 border-slate-100">
                {activeTab === 'history' ? (
                  <>
                    <TableHead className="w-[300px] font-bold text-slate-900 h-14 md:pl-8 text-sm">Transaction Details</TableHead>
                    <TableHead className="font-bold text-slate-900 text-sm">Plan & Tier</TableHead>
                    <TableHead className="font-bold text-slate-900 text-sm">Financials</TableHead>
                    <TableHead className="font-bold text-slate-900 text-sm">Timeline</TableHead>
                    <TableHead className="text-right font-bold text-slate-900 pr-8 text-sm">Actions</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="w-[300px] font-bold text-slate-900 h-14 md:pl-8 text-sm">Partner Business</TableHead>
                    <TableHead className="font-bold text-slate-900 text-sm">Owner Executive</TableHead>
                    <TableHead className="font-bold text-slate-900 text-sm">Active Subscription</TableHead>
                    <TableHead className="font-bold text-slate-900 text-sm">Status</TableHead>
                    <TableHead className="text-right font-bold text-slate-900 pr-8 text-sm">Actions</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <CreditCard size={48} className="opacity-20" />
                      <p className="font-bold text-xl">No records found for the current selection.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50 transition-colors border-slate-50 h-24">
                    {activeTab === 'history' ? (
                      <>
                        <TableCell className="md:pl-8">
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-slate-900 tracking-tight text-base leading-tight">
                              {item.businessId?.name || "Deleted Business"}
                            </span>
                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-black tracking-widest mt-0.5">
                              <Download size={10} className="text-slate-300" />
                              ID: {item.razorpay_orderId?.slice(-8) || "Internal"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className="w-fit bg-emerald-50 border-emerald-100 text-emerald-700 font-black uppercase text-[9px] tracking-widest px-2 py-0.5">
                              {item.plan}
                            </Badge>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                              Asset Count: {item.no_of_booking || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-base font-black text-slate-900 flex items-center gap-0.5">
                              <IndianRupee size={14} className="text-emerald-500" />
                              {item.total_price?.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              {item.paymentMethod} • PROCESSED
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-tight">
                              <Calendar size={12} className="text-slate-400" />
                              {item.createdAt ? format(new Date(item.createdAt), "dd MMM, yyyy") : "N/A"}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 font-black text-[9px] uppercase tracking-widest leading-none">
                              <Clock size={10} />
                              SUCCESSFUL
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                            <Download className="h-5 w-5 text-slate-400" />
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="md:pl-8">
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-slate-900 tracking-tight text-base leading-tight">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold mt-0.5">
                              <MapPin size={10} className="text-slate-300" />
                              {item.address || "No Address"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-sm">
                              {item.owner?.firstName} {item.owner?.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {item.owner?.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            <Badge className={`w-fit font-black uppercase text-[9px] tracking-widest px-2 py-0.5 border-0 rounded-full ${statusColorMap[item.subscription?.status || ''] || 'bg-slate-100 text-slate-600'}`}>
                              {item.subscription?.status || 'NOT ACTIVE'}
                            </Badge>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                              <History size={10} />
                              Plan: {item.subscription?.plan || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.deleted ? (
                            <Badge className="bg-red-500 text-white border-0 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Terminated</Badge>
                          ) : item.disabled ? (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Suspended</Badge>
                          ) : (
                            <Badge className="bg-blue-500 text-white border-0 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Verified Account</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                            <Eye className="h-5 w-5 text-slate-400" />
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/10">
            <div className="text-sm text-slate-400 font-medium">
              Showing <span className="text-slate-900 font-bold">{(page - 1) * size + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(page * size, filtered.length)}</span> of <span className="text-slate-900 font-black">{filtered.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-xl font-bold border-slate-200 disabled:opacity-40"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 mx-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-10 w-10 rounded-xl font-black text-sm transition-all ${page === i + 1
                      ? "bg-slate-950 text-white shadow-lg scale-110"
                      : "text-slate-400 hover:bg-slate-100"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                className="rounded-xl font-bold border-slate-200 disabled:opacity-40"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

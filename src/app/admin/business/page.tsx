"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import {
  Building2,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Ban,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Phone,
  User as UserIcon,
  ShieldCheck
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function BusinessPage() {
  const [businessList, setBusinessList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchBusiness = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/business");
      const data = await res.json();
      setBusinessList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  const handleToggleStatus = async (business: any) => {
    try {
      const res = await apiFetch("/api/business", {
        method: "PUT",
        body: JSON.stringify({ id: business._id, disabled: !business.disabled })
      });
      if (res.ok) fetchBusiness();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    if (!confirm("Are you sure you want to archive this business? This action is reversible by system admins.")) return;
    try {
      const res = await apiFetch(`/api/business?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchBusiness();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBusiness = (businessList || []).filter((b: any) =>
    (b?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (b?.owner?.firstName || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBusiness.length / itemsPerPage);
  const paginatedBusiness = filteredBusiness.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading && businessList.length === 0) return <FullscreenLoader />;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="text-green-600" size={32} />
            Business Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage platform partners, subscriptions, and operational status.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search business or owner..."
              className="pl-12 h-12 bg-white border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-400/20 transition-all font-medium"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total:</span>
            <span className="text-lg font-black text-slate-900">{filteredBusiness.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table >
            <TableHeader className="bg-slate-50/50">
              <TableRow className="bg-slate-100 border-slate-100">
                <TableHead className="w-[300px] font-bold text-slate-900 h-14 md:pl-8">Business Details</TableHead>
                <TableHead className="font-bold text-slate-900">Owner Contact</TableHead>
                <TableHead className="font-bold text-slate-900">Subscription</TableHead>
                <TableHead className="font-bold text-slate-900">Status</TableHead>
                <TableHead className="text-right font-bold text-slate-900 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBusiness.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <Ban size={48} className="opacity-20" />
                      <p className="font-bold text-xl">No businesses found matching your criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBusiness.map((business) => (
                  <TableRow key={business._id} className="hover:bg-slate-50/50 transition-colors border-slate-50 h-24">
                    <TableCell className="md:pl-8">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-900 tracking-tight text-lg">{business.name}</span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                          <MapPin size={12} />
                          {business.address || "No address provided"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-bold text-slate-700">
                          <UserIcon size={14} className="text-slate-400" />
                          {business.owner?.firstName} {business.owner?.lastName}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                            <Phone size={10} />
                            {business.owner?.countryCode}{business.owner?.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 px-3 py-1 font-black uppercase tracking-wider text-[10px]">
                            {business.subscription?.plan || "Free Trial"}
                          </Badge>
                          <span className="font-bold text-slate-900 text-xs">₹{business.subscription?.unitPrice || "0"}/unit</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-slate-400">
                          <ShieldCheck size={12} className="text-blue-500" />
                          {business.subscription?.status || "Pending"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {business.deleted ? (
                        <Badge className="bg-red-500 text-white border-0 px-3 py-1 rounded-full font-bold">Archived</Badge>
                      ) : business.disabled ? (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1 rounded-full font-bold">Limited Access</Badge>
                      ) : (
                        <Badge className="bg-green-500 text-white border-0 px-3 py-1 rounded-full font-bold">Active Partner</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100">
                          <div className="flex flex-col gap-1">
                            <button className="flex items-center h-11 px-3 rounded-xl hover:bg-slate-50 transition-colors group">
                              <Eye className="mr-3 h-4 w-4 text-slate-400 group-hover:text-green-600" />
                              <span className="font-bold text-sm">View Portfolio</span>
                              <ExternalLink size={12} className="ml-auto opacity-30" />
                            </button>
                            <button
                              className="flex items-center h-11 px-3 rounded-xl hover:bg-slate-50 transition-colors group text-left w-full"
                              onClick={() => handleToggleStatus(business)}
                            >
                              {business.disabled ? (
                                <>
                                  <CheckCircle2 className="mr-3 h-4 w-4 text-green-500" />
                                  <span className="font-bold text-sm">Restore Service</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="mr-3 h-4 w-4 text-amber-500" />
                                  <span className="font-bold text-sm">Suspend Access</span>
                                </>
                              )}
                            </button>
                            <div className="my-1 border-t border-slate-50" />
                            <button
                              className="flex items-center h-11 px-3 rounded-xl hover:bg-red-50 transition-colors group text-red-600 text-left w-full"
                              onClick={() => handleDeleteBusiness(business._id)}
                            >
                              <Trash2 className="mr-3 h-4 w-4 text-red-400" />
                              <span className="font-bold text-sm tracking-tight">Archive Business</span>
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/10">
            <div className="text-sm text-slate-400 font-medium">
              Showing <span className="text-slate-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(currentPage * itemsPerPage, filteredBusiness.length)}</span> of <span className="text-slate-900 font-black">{filteredBusiness.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-xl font-bold border-slate-200 disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 mx-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-10 w-10 rounded-xl font-black text-sm transition-all ${currentPage === i + 1
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
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
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

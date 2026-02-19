"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import {
  MessageSquare,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  User,
  ArrowRight,
  Clock,
  AlertCircle
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
import { format } from "date-fns";

export default function EnquiryPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const size = 8;

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/enquiry");
      const data = await res.json();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await apiFetch(`/api/enquiry?id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await apiFetch(`/api/enquiry?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = enquiries.filter((e: any) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase()) ||
    e.message?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / size);
  const paginated = filtered.slice((page - 1) * size, page * size);

  if (loading && enquiries.length === 0) return <FullscreenLoader />;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <MessageSquare className="text-purple-600" size={32} />
            Platform Enquiries
          </h1>
          <p className="text-slate-500 font-medium mt-1">Monitor communications from prospective partners and external leads.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search enquiries by name, email, or message..."
              className="pl-12 h-12 bg-white border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-400/20 transition-all font-medium"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total:</span>
            <span className="text-lg font-black text-slate-900">{filtered.length} Requests</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="bg-slate-100 border-slate-100">
                <TableHead className="w-[280px] font-bold text-slate-900 h-14 md:pl-8 text-sm">Sender Details</TableHead>
                <TableHead className="w-[350px] font-bold text-slate-900 text-sm">Communication Context</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Priority Status</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Timeline</TableHead>
                <TableHead className="text-right font-bold text-slate-900 pr-8 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <MessageSquare size={48} className="opacity-20" />
                      <p className="font-bold text-xl">No active enquiries requiring attention.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((e) => (
                  <TableRow key={e._id} className="hover:bg-slate-50/50 transition-colors border-slate-50 min-h-24">
                    <TableCell className="md:pl-8">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center font-black text-purple-600 text-xs">
                            {e.name?.[0]}
                          </div>
                          <span className="font-black text-slate-900 tracking-tight text-base leading-tight">
                            {e.name}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 ml-10">
                          {e.email && <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                            <Mail size={10} />
                            {e.email}
                          </div>}
                          {e.phone && (
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                              <Phone size={10} />
                              {e.countryCode} {e.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="py-2">
                        <p className="text-slate-600 text-sm font-medium line-clamp-2 leading-relaxed italic">
                          "{e.message}"
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`px-3 py-1 font-black uppercase text-[10px] tracking-widest border-0 rounded-full ${e.status === 'new' ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' :
                        e.status === 'processed' ? 'bg-green-500 text-white' :
                          'bg-slate-200 text-slate-600'
                        }`}>
                        {e.status || 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-tight">
                          <Calendar size={12} className="text-slate-400" />
                          {e.createdAt ? format(new Date(e.createdAt), "dd MMM, yyyy") : "N/A"}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-black text-[9px] uppercase tracking-widest leading-none">
                          <Clock size={10} />
                          {e.createdAt ? format(new Date(e.createdAt), "hh:mm a") : ""}
                        </div>
                      </div>
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
                              <Eye className="mr-3 h-4 w-4 text-slate-400 group-hover:text-purple-600" />
                              <span className="font-bold text-sm">Open Inquiry</span>
                              <ArrowRight size={12} className="ml-auto opacity-30" />
                            </button>
                            {e.status === 'new' && (
                              <button
                                className="flex items-center h-11 px-3 rounded-xl hover:bg-green-50 transition-colors group text-left w-full"
                                onClick={() => handleUpdateStatus(e._id, 'processed')}
                              >
                                <CheckCircle2 className="mr-3 h-4 w-4 text-green-500" />
                                <span className="font-bold text-sm">Mark Resolved</span>
                              </button>
                            )}
                            <div className="my-1 border-t border-slate-50" />
                            <button
                              className="flex items-center h-11 px-3 rounded-xl hover:bg-red-50 transition-colors group text-red-600 text-left w-full"
                              onClick={() => handleDeleteEnquiry(e._id)}
                            >
                              <Trash2 className="mr-3 h-4 w-4 text-red-400" />
                              <span className="font-bold text-sm tracking-tight">Dismiss Lead</span>
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

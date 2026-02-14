"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import {
  BarChart3,
  Search,
  MoreHorizontal,
  Edit3,
  Trash2,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Layers,
  Flag,
  ChevronRight,
  UserCircle2,
  Inbox
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
import LeadForm from "./LeadForm";
import { format } from "date-fns";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const size = 8;

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/lead");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to permanently remove this lead intelligence?")) return;
    try {
      const res = await apiFetch(`/api/admin/lead?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = leads.filter((l) =>
    l?.name?.toLowerCase().includes(search?.toLowerCase()) ||
    l?.email?.toLowerCase().includes(search?.toLowerCase()) ||
    l?.lead_from?.toLowerCase().includes(search?.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / size);
  const paginated = filtered.slice((page - 1) * size, page * size);

  if (loading && leads.length === 0) return <FullscreenLoader />;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={32} />
            Leads Intelligence
          </h1>
          <p className="text-slate-500 font-medium mt-1">Strategic pipeline management and conversion tracking across the platform.</p>
        </div>
        <Button
          onClick={() => { setEditData(null); setOpen(true); }}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 px-8 font-black shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <UserPlus size={18} />
          Manual Entry
        </Button>
      </div>

      <div className="bg-white rounded-[1rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search leads, sources, or emails..."
              className="pl-12 h-12 bg-white border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-400/20 transition-all font-medium"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pipeline:</span>
            <span className="text-lg font-black text-slate-900">{filtered.length} Leads</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="bg-slate-100 border-slate-100">
                <TableHead className="w-[280px] font-bold text-slate-900 h-14 md:pl-8 text-sm">Lead Identity</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Origination</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Engagement</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Status</TableHead>
                <TableHead className="text-right font-bold text-slate-900 pr-8 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <Inbox size={48} className="opacity-20" />
                      <p className="font-bold text-xl">No leads currently in the intelligence pipeline.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((l) => (
                  <TableRow key={l._id} className="hover:bg-slate-50/50 transition-colors border-slate-50 h-24">
                    <TableCell className="md:pl-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                          {l.name?.[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 tracking-tight text-base leading-tight">
                            {l.name}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold mt-0.5">
                            <Mail size={10} className="text-slate-300" />
                            {l.email || "No Email"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit bg-slate-50 border-slate-200 text-slate-600 font-bold uppercase text-[9px] tracking-widest px-2 py-0.5">
                          {l.lead_from || "Direct"}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Calendar size={10} />
                          {l.createdAt ? format(new Date(l.createdAt), "dd MMM, yy") : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <Badge className={`px-2 py-0.5 font-black uppercase text-[9px] tracking-widest border-0 ${l.label === 'hot' ? 'bg-red-500 text-white' :
                            l.label === 'warm' ? 'bg-orange-500 text-white' :
                              l.label === 'cold' ? 'bg-blue-500 text-white' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                            {l.label || 'Unlabeled'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <UserCircle2 size={12} className="text-slate-300" />
                          Assignee: {l.assign || 'System'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`px-3 py-1 font-bold uppercase text-[10px] border-0 rounded-full ${l.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        l.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          l.status === 'in-progress' ? 'bg-indigo-100 text-indigo-700' :
                            l.status === 'closed' ? 'bg-green-100 text-green-700' :
                              'bg-slate-100 text-slate-600'
                        }`}>
                        {l.status}
                      </Badge>
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
                            <button
                              className="flex items-center h-11 px-3 rounded-xl hover:bg-slate-50 transition-colors group text-left w-full"
                              onClick={() => {
                                setEditData(l);
                                setOpen(true);
                              }}
                            >
                              <Edit3 className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                              <span className="font-bold text-sm">Refine Intel</span>
                            </button>
                            <div className="my-1 border-t border-slate-50" />
                            <button
                              className="flex items-center h-11 px-3 rounded-xl hover:bg-red-50 transition-colors group text-red-600 text-left w-full"
                              onClick={() => handleDeleteLead(l._id)}
                            >
                              <Trash2 className="mr-3 h-4 w-4 text-red-400" />
                              <span className="font-bold text-sm tracking-tight">Purge Record</span>
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

      <LeadForm
        open={open}
        onClose={() => setOpen(false)}
        editData={editData}
        refresh={fetchLeads}
      />
    </div>
  );
}

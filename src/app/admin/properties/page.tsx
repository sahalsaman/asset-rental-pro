"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import {
  Building,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Ban,
  CheckCircle2,
  MapPin,
  Home,
  Building2,
  Tag,
  ArrowRight
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

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/property");
      const data = await res.json();
      setProperties(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleToggleStatus = async (property: any) => {
    try {
      const res = await apiFetch(`/api/property?id=${property._id}`, {
        method: "PUT",
        body: JSON.stringify({ disabled: !property.disabled })
      });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property? All associated data will be archived.")) return;
    try {
      const res = await apiFetch(`/api/property?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProperties = (properties || []).filter((pro: any) =>
    (pro?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (pro?.businessId?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading && properties.length === 0) return <FullscreenLoader />;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Building className="text-orange-600" size={32} />
            Platform Inventory
          </h1>
          <p className="text-slate-500 font-medium mt-1">Global view of all properties and assets across all businesses.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search by property or business..."
              className="pl-12 h-12 bg-white border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-400/20 transition-all font-medium"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Inventory:</span>
            <span className="text-lg font-black text-slate-900">{filteredProperties.length} Assets</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="bg-slate-100 border-slate-100">
                <TableHead className="w-[300px] font-bold text-slate-900 h-14 md:pl-8 text-sm">Property Asset</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Partner Business</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Classification</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Status</TableHead>
                <TableHead className="text-right font-bold text-slate-900 pr-8 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <Home size={48} className="opacity-20" />
                      <p className="font-bold text-xl">No properties found in the platform inventory.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProperties.map((pro) => (
                  <TableRow key={pro._id} className="hover:bg-slate-50/50 transition-colors border-slate-50 h-24">
                    <TableCell className="md:pl-8">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-900 tracking-tight text-base leading-tight">
                          {pro.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                          <MapPin size={12} />
                          {pro.address || "No address assigned"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <Building2 size={16} className="text-orange-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">
                            {pro.businessId?.name || "Independent"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Partner ID: {pro.businessId?._id?.slice(-6) || "N/A"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <Badge variant="outline" className="w-fit bg-slate-50 border-slate-200 text-slate-600 font-black uppercase text-[9px] tracking-widest px-2 py-0.5">
                          {pro.category || "General"}
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 tracking-tight">
                          <Tag size={10} className="text-slate-300" />
                          Asset Type: {pro.propertyType || "Standard"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {pro.deleted ? (
                        <Badge className="bg-red-500 text-white border-0 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Retired</Badge>
                      ) : pro.disabled ? (
                        <Badge className="bg-amber-100 text-amber-600 border-amber-200 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Suspended</Badge>
                      ) : (
                        <Badge className="bg-green-500 text-white border-0 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Operational</Badge>
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
                              <Eye className="mr-3 h-4 w-4 text-slate-400 group-hover:text-orange-600" />
                              <span className="font-bold text-sm">Asset Preview</span>
                              <ArrowRight size={12} className="ml-auto opacity-30" />
                            </button>
                            <button
                              className="flex items-center h-11 px-3 rounded-xl hover:bg-slate-50 transition-colors group text-left w-full"
                              onClick={() => handleToggleStatus(pro)}
                            >
                              {pro.disabled ? (
                                <>
                                  <CheckCircle2 className="mr-3 h-4 w-4 text-green-500" />
                                  <span className="font-bold text-sm">Resume Operations</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="mr-3 h-4 w-4 text-amber-500" />
                                  <span className="font-bold text-sm">Halt Operations</span>
                                </>
                              )}
                            </button>
                            <div className="my-1 border-t border-slate-50" />
                            <button
                              className="flex items-center h-11 px-3 rounded-xl hover:bg-red-50 transition-colors group text-red-600 text-left w-full"
                              onClick={() => handleDeleteProperty(pro._id)}
                            >
                              <Trash2 className="mr-3 h-4 w-4 text-red-400" />
                              <span className="font-bold text-sm tracking-tight">Decommission Asset</span>
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
              Showing <span className="text-slate-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(currentPage * itemsPerPage, filteredProperties.length)}</span> of <span className="text-slate-900 font-black">{filteredProperties.length}</span> results
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

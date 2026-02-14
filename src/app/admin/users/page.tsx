"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import {
  Users,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Ban,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  UserCircle2,
  Lock,
  Unlock
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

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/user");
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: any) => {
    try {
      const res = await apiFetch("/api/admin/user", {
        method: "PUT",
        body: JSON.stringify({ id: user._id, disabled: !user.disabled })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This will restrict their access to the platform.")) return;
    try {
      const res = await apiFetch(`/api/admin/user?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = (users || []).filter((user: any) =>
    (`${user?.firstName || ""} ${user?.lastName || ""}`).toLowerCase().includes(search.toLowerCase()) ||
    (user?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading && users.length === 0) return <FullscreenLoader />;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            User Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Platform-wide user accounts, roles, and security controls.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search by name or email..."
              className="pl-12 h-12 bg-white border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-400/20 transition-all font-medium"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Users:</span>
            <span className="text-lg font-black text-slate-900">{filteredUsers.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="bg-slate-100 border-slate-100">
                <TableHead className="w-[300px] font-bold text-slate-900 h-14 md:pl-8 text-sm">Full Name</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Role & Identity</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Contact Info</TableHead>
                <TableHead className="font-bold text-slate-900 text-sm">Status</TableHead>
                <TableHead className="text-right font-bold text-slate-900 pr-8 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <UserCircle2 size={48} className="opacity-20" />
                      <p className="font-bold text-xl">No users found on the platform.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user._id} className="hover:bg-slate-50/50 transition-colors border-slate-50 h-24">
                    <TableCell className="md:pl-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 tracking-tight text-base leading-tight">
                            {user.firstName} {user.lastName}
                          </span>
                          <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-black tracking-widest mt-0.5">
                            <Calendar size={10} />
                            Joined {user.createdAt ? format(new Date(user.createdAt), "MMM yyyy") : "N/A"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`px-2 py-0.5 font-black uppercase text-[9px] tracking-widest ${user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            user.role === 'OWNER' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <ShieldCheck size={12} className="text-slate-300" />
                          {user.businessId ? "Partner Employee" : "Independent"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-bold text-slate-700 text-xs">
                          <Mail size={12} className="text-slate-300" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 font-bold text-slate-400 text-[11px]">
                            <Phone size={10} className="text-slate-300" />
                            {user.countryCode} {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.deleted ? (
                        <Badge className="bg-red-500 text-white border-0 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Deleted</Badge>
                      ) : user.disabled ? (
                        <Badge className="bg-slate-200 text-slate-600 border-0 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Inactive</Badge>
                      ) : (
                        <Badge className="bg-blue-500 text-white border-0 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Verified</Badge>
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
                              <Eye className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                              <span className="font-bold text-sm">User Details</span>
                            </button>
                            <button
                              className="flex items-center h-11 px-3 rounded-xl hover:bg-slate-50 transition-colors group text-left w-full"
                              onClick={() => handleToggleStatus(user)}
                            >
                              {user.disabled ? (
                                <>
                                  <Unlock className="mr-3 h-4 w-4 text-green-500" />
                                  <span className="font-bold text-sm">Enable Access</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="mr-3 h-4 w-4 text-slate-500" />
                                  <span className="font-bold text-sm">Restrict Access</span>
                                </>
                              )}
                            </button>
                            <div className="my-1 border-t border-slate-50" />
                            <button
                              className="flex items-center h-11 px-3 rounded-xl hover:bg-red-50 transition-colors group text-red-600 text-left w-full"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <Trash2 className="mr-3 h-4 w-4 text-red-400" />
                              <span className="font-bold text-sm tracking-tight">Delete Account</span>
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
              Showing <span className="text-slate-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="text-slate-900 font-black">{filteredUsers.length}</span> results
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

"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { IUser } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Edit3,
  LogOut,
  ShieldCheck,
  User,
  Mail,
  Phone,
  ChevronRight,
  Lock,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Settings2,
  History
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/me");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading || !user) return <FullscreenLoader />;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-12 max-w-[1000px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-[1rem] bg-slate-900 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-slate-300 border-4 border-white ring-1 ring-slate-100 italic">
            {user?.firstName?.slice(0, 1).toUpperCase()}
            {user?.lastName?.slice(0, 1).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {user?.firstName} {user?.lastName}
              </h1>
              <Badge className="bg-blue-600 text-white border-0 px-3 py-1 font-black uppercase text-[10px] tracking-widest rounded-full">
                {user?.role}
              </Badge>
            </div>
            <p className="text-slate-500 font-bold flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-500" />
              Platform Administrator Privilege
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push('/admin/profile/edit')}
          className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl h-12 px-6 font-black shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <Edit3 size={18} />
          Edit Identity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <User size={14} /> Security & Identification
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-100/50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Email</p>
                  <p className="text-sm font-bold text-slate-900">{user?.email || 'Not provided'}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-100/50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</p>
                  <p className="text-sm font-bold text-slate-900">{user?.countryCode} {user?.phone}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-100/50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                  <Lock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Access</p>
                  <p className="text-sm font-bold text-slate-900">Protected via Multi-Factor</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <Settings2 size={14} /> Platform Resources
          </h3>
          <div className="space-y-4">
            <a href="/privacy" target="_blank" className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <BookOpen size={18} />
                </div>
                <span className="text-sm font-bold text-slate-700">Privacy Policy</span>
              </div>
              <ExternalLink size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
            </a>
            <div className="h-[1px] bg-slate-50" />
            <a href="/terms" target="_blank" className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <History size={18} />
                </div>
                <span className="text-sm font-bold text-slate-700">Terms of Service</span>
              </div>
              <ExternalLink size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
            </a>
            <div className="h-[1px] bg-slate-50" />
            <a href="/#faq" target="_blank" className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                  <HelpCircle size={18} />
                </div>
                <span className="text-sm font-bold text-slate-700">Audit Documentation</span>
              </div>
              <ExternalLink size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
            </a>
            <div className="h-[1px] bg-slate-50" />
            <button
              onClick={logout}
              className="flex items-center justify-between group w-full text-left"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                  <LogOut size={18} />
                </div>
                <span className="text-sm font-black text-red-600 uppercase tracking-tighter italic">Terminate Session</span>
              </div>
              <ChevronRight size={14} className="text-red-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

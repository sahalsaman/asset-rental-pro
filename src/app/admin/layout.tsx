'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Building,
  Building2,
  Home,
  LayoutDashboard,
  Users,
  CreditCard,
  Share2,
  MessageSquare,
  Tags,
  User,
  LogOut,
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { app_config } from '../../../app-config';
import { UserRoles } from '@/utils/contants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const options = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { title: 'Business', path: '/admin/business', icon: <Building2 size={20} /> },
    { title: 'Properties', path: '/admin/properties', icon: <Building size={20} /> },
    { title: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { title: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { title: 'Channel', path: '/admin/channel', icon: <Share2 size={20} /> },
    { title: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare size={20} /> },
    { title: 'Leads', path: '/admin/leads', icon: <Tags size={20} /> },
  ]

  const fetchUser = async () => {
    try {
      const res = await apiFetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data)
        if (data.role !== UserRoles.ADMIN) router.push('/');
      } else if (res.status === 401) {
        router.push('/admin-login');
      }
    }
    catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser()
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      router.push('/admin-login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* 🏰 Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950 text-white h-full border-r border-white/5 shadow-2xl z-50 flex-shrink-0">
        <div className="p-8">
          <div
            className="flex items-center gap-3 cursor-pointer group mb-10"
            onClick={() => router.push('/admin/dashboard')}
          >
            <div className="bg-white/10 p-2.5 rounded-2xl group-hover:bg-white/20 transition-all shadow-lg ring-1 ring-white/10">
              <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={24} height={24} className="brightness-110" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
                Rentities
              </h1>
              <span className="text-[10px] text-green-400 font-bold tracking-widest uppercase">Admin Portal</span>
            </div>
          </div>

          <nav className="space-y-1.5 mt-4">
            {options.map((item, idx) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <button
                  key={idx}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group
                    ${isActive
                      ? "bg-green-500 text-slate-950 shadow-[0_8px_20px_rgba(34,197,94,0.3)] scale-[1.02]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                >
                  <span className={`${isActive ? "text-slate-950" : "text-slate-500 group-hover:text-green-400 transition-colors"}`}>
                    {item.icon}
                  </span>
                  {item.title}
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-green-400 font-black italic shadow-inner">
              {user?.firstName?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white leading-tight">{user?.firstName}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Administrator</span>
            </div>
            <button onClick={logout} className="ml-auto p-2 text-slate-500 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* 📱 Mobile Layout Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-y-auto">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 w-full bg-slate-950 text-white px-5 py-4 flex items-center justify-between border-b border-white/5 shadow-lg">
          <div className="flex items-center gap-3" onClick={() => router.push('/admin/dashboard')}>
            <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={24} height={24} />
            <span className="text-lg font-black tracking-tighter italic uppercase">Rentities</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 bg-white/5 rounded-xl border border-white/10"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Desktop Mini Header */}
        <header className="hidden lg:flex sticky top-0 z-30 h-16 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 items-center justify-end px-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/profile')}
              className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-xl transition-all group"
            >
              <div className="flex flex-col items-end mr-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-0.5">System Admin</span>
                <span className="text-xs font-bold text-slate-900">{user?.firstName} {user?.lastName}</span>
              </div>
              <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <User size={18} className="text-white" />
              </div>
            </button>
            <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* 🎬 Main Content Area */}
        <main className="relative flex-1 focus:outline-none py-2 lg:py-1">
          <div className="max-w-[1500px] mx-auto min-h-screen">
            {children}
          </div>
        </main>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-black text-white italic tracking-tighter">ADMIN MENU</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/10 rounded-2xl text-white">
                  <X size={24} />
                </button>
              </div>
              <nav className="grid grid-cols-1 gap-3">
                {options.map((item, idx) => {
                  const isActive = pathname.startsWith(item.path);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        router.push(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-lg font-black transition-all
                        ${isActive ? "bg-green-500 text-slate-950" : "text-white/40 hover:text-white"}`}
                    >
                      {item.icon}
                      {item.title}
                    </button>
                  );
                })}
              </nav>
              <div className="mt-auto pt-8 border-t border-white/5">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-red-500/10 text-red-500 font-black"
                >
                  <LogOut size={20} />
                  SECURE SIGN OUT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 📱 Bottom Navigation (Quick Access) */}
        {!isMobileMenuOpen && (
          <nav className="fixed lg:hidden bottom-4 left-4 right-4 h-16 bg-slate-950 border border-white/10 shadow-2xl rounded-2xl flex justify-around items-center px-4 z-40 ring-1 ring-white/5">
            {options.slice(0, 4).map((item, idx) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <button
                  key={idx}
                  onClick={() => router.push(item.path)}
                  className={`flex flex-col items-center gap-1 transition-all duration-300
                    ${isActive ? "text-green-400 scale-110" : "text-slate-500"}`}
                >
                  {item.icon}
                  <span className="text-[8px] font-black uppercase tracking-tighter">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}

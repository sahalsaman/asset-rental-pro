"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FullscreenLoader, DashboardSkeleton } from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { UserRoles } from "@/utils/contants";
import { IUser } from "@/app/types";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit } from "lucide-react";

export default function PropertiesPage() {
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    const res = await apiFetch("/api/me");
    const data = await res.json();
    setUser(data);
  };

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

  const breadcrumbItems = [
    { label: "Home", href: "/business" },
    { label: "Profile" },
  ];
  if (!user) return <div className="p-8 md:px-16 px-5"><DashboardSkeleton /></div>;

  return (
    <div>
      <div className="flex flex-col justify-between items-start md:items-center gap-3 bg-slate-100 md:p-14 md:px-16 p-8 shadow-sm">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <div className="w-full flex justify-between ">
          <div className="w-full flex flex-col md:flex-row md:gap-4 gap-2">
            <div className="w-18 h-18 bg-blue-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-bold">
              {user?.firstName?.slice(0, 2).toUpperCase()}
            </div>
            <div >
              <h1 className="text-2xl md:text-3xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <p>{user?.countryCode} {user?.phone}</p>
              <Badge variant="default">{user?.role}</Badge>
            </div>
          </div>

          <Button size="icon" variant="outline" onClick={() => router.push('/business/profile/edit')} >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col text-md m-4 md:mx-16">
        <a className="p-4 border-b-1 border-b-gray-200 flex justify-between items-center" href='/privacy'
          target="_blank">
          Privacy and policy <ChevronRight />
        </a>
        <a className="p-4 border-b-1 border-b-gray-200 flex justify-between items-center" href='/terms'
          target="_blank">
          Terms & Conditions <ChevronRight />
        </a>
        <a className="p-4 border-b-1 border-b-gray-200 flex justify-between items-center" href='/#faq'
          target="_blank">
          FAQ <ChevronRight />
        </a>
        <a className="p-4 border-b-1 border-b-gray-200 flex justify-between items-center" href='/#contact'
          target="_blank">
          Help & Support <ChevronRight />
        </a>
        <a onClick={() => { logout(); }}
          className="p-4 border-b-1 border-b-gray-200 text-red-600 cursor-pointer">
          Logout
        </a>
      </div>
    </div>
  );
}

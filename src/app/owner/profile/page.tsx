"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FullscreenLoader } from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import {  useRouter } from 'next/navigation';
import { UserRoles } from "@/utils/contants";
import { IUser } from "@/app/types";

export default function PropertiesPage() {
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    const res = await apiFetch("/api/user");
    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Profile" },
  ];
  if (!user) return <FullscreenLoader />;

  return (
    <div>
      <div className="flex flex-col justify-between items-start md:items-center gap-3 bg-slate-100 md:p-14 md:px-32 p-5 shadow-sm">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <div className="w-full flex justify-between ">
          <div className="">
            <div className="w-18 h-18 bg-blue-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-bold">
              {user?.firstName?.slice(0,2).toUpperCase()}
            </div>
            <div className="mt-2">
              <h1 className="text-2xl md:text-3xl font-bold">{user?.firstName}</h1>
              <p>{user?.countryCode} {user?.phone}</p>
              <Badge variant="default">{user?.role}</Badge>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col text-md m-4">
         {user?.role===UserRoles.OWNER?   <a  className="p-4 border-b-1 border-b-gray-200"  onClick={() => router.push('/owner/organisation')}>
           Organisation
          </a>:""}
            <a  className="p-4 border-b-1 border-b-gray-200"  onClick={() => router.push('/owner/subscription-plan')}>
           Subscription
          </a>
              <a  className="p-4 border-b-1 border-b-gray-200"   >
           Change mobile number
          </a>
              <a  className="p-4 border-b-1 border-b-gray-200"  onClick={() => router.push('/privacy')}>
           Privacy
          </a>
               <a  className="p-4 border-b-1 border-b-gray-200" onClick={() => router.push('/terms')}>
           Terms
          </a>
               <a  className="p-4 border-b-1 border-b-gray-200" >
           FAQ
          </a>
             <a  className="p-4 border-b-1 border-b-gray-200"  >
           Help and Support
          </a>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PropertyCard from "../../../components/PropertyCard";
import PropertyFormModal from "../../../components/PropertyFormModal";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FullscreenLoader } from "@/components/Loader";
import { Badge } from "@/components/ui/badge";

export default function PropertiesPage() {
  const [user, setUser] = useState<any | null>(null);



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
        <Breadcrumbs items={breadcrumbItems} />
        <div className="w-full flex justify-between ">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-200 rounded-md flex items-center justify-center text-gray-500 text-2xl">
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            <div>
                <Badge variant="default">{user?.role}</Badge>
              <h1 className="text-2xl md:text-3xl font-bold">{user?.firstName}</h1>
         <p>{user?.phone}</p>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
}

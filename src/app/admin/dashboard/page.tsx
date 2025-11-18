"use client";

import { Building2, Users, Paperclip, Bed } from "lucide-react";
import { useState, useEffect } from "react";
import DashboardCard from "../../../components/card";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { FullscreenLoader } from "@/components/Loader";


export default function OwnerDashboard() {
  const router = useRouter();
  const [loader, setLoader] = useState(true);

  const [status, setStatus] = useState({
    organisationCount: 0,
    vendorCount: 0,
    userCount: 0,
    propertyCount: 0,
    bookingCount: 0,
    subcriptionPaymentLastMonth: 0
  });
  const current_property = localStorageServiceSelectedOptions.getItem()?.property


  // Fetch status from backend API
  const fetchDashboardData = async (id?: any) => {
    const start = Date.now();
    if (!current_property?._id && !id) {
      setLoader(false);
      return;
    }

    setLoader(true);
    try {
      const res = await apiFetch(`/api/admin/dashboard`); // replace with your API route
      console.log(res);

      if (!res.ok) throw new Error("Failed to fetch dashboard status");
      const data = await res.json();
      setStatus({
        organisationCount: data.organisationCount,
        vendorCount: data.vendorCount,
        userCount: data.userCount,
        propertyCount: data.propertyCount,
        bookingCount: data.bookingCount,
        subcriptionPaymentLastMonth: data.subcriptionPaymentLastMonth.total || 0
      });
      setLoader(false);
      console.log("Execution time:", Date.now() - start, "ms");
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);


  if (loader) return <FullscreenLoader />;

  return (
    <main className=" bg-white text-gray-800 pt-8 md:px-32 px-5 mb-10 ">

      <h1 className="text-2xl hidden md:block font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2  lg:grid-cols-3 gap-4">
        <DashboardCard title="Total Organisation" value={status?.organisationCount} icon={Bed} />
        <DashboardCard title="Total Vendors" value={status?.vendorCount} icon={Paperclip} />
        <DashboardCard title="Total Users" value={status?.userCount} icon={Building2} />
        <DashboardCard title="Total Properties" value={status?.propertyCount} icon={Users} />
        <DashboardCard title="Total bookings" value={status?.bookingCount} icon={Users} />
        <DashboardCard title="Subcription Payments" value={status?.subcriptionPaymentLastMonth} icon={Users} />
      </div>


    </main>
  );
}

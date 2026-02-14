"use client";

import { Building2, Users, DollarSign, Calendar, NotepadTextDashed, Megaphone, PlusIcon, BadgeDollarSign, QrCodeIcon, Headset, Tickets, Paperclip, Bed, Share, Crown, MessageCircleMore, Lamp, ReceiptIndianRupee, Stars } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { IProperty } from "@/app/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DashboardCard from "../../../components/card";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import BookingAddEditModal from "@/components/BookingFormModal";
import toast from "react-hot-toast";
import { FullscreenLoader, DashboardSkeleton } from "@/components/Loader";
import { RevenueChart } from "@/components/RevenueChart";
import { BookingTrendChart } from "@/components/BookingTrendChart";
import { RecentActivity } from "@/components/RecentActivity";
import { app_config } from "../../../../app-config";


export default function OwnerDashboard() {
  const router = useRouter();
  const [qrOpen, setQrOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [loader, setLoader] = useState(true);

  const [status, setStatus] = useState({
    total_units: 0,
    available_units: 0,
    enrollments: 0,
    totalInvoiceAmount: 0,
    totalReceivedAmount: 0,
    noticePeriod: 0,
    chartData: [],
    activities: []
  });
  const current_property = localStorageServiceSelectedOptions.getItem()?.property

  const setQRcodeUrl = () => {
    setQrUrl(`${app_config.PUBLIC_BASE_URL}/user/booking/${current_property?._id}`);
  }

  // Fetch status from backend API
  const fetchDashboardData = async (id?: any) => {
    if (!id) {
      setLoader(false);
      return;
    }

    setLoader(true);
    try {
      const res = await apiFetch(`/api/dashboard?prop=${id}`); // replace with your API route

      if (!res.ok) return;
      const data = await res.json();
      setStatus({
        total_units: data.total_units,
        available_units: data.available_units,
        enrollments: data.enrollments,
        totalInvoiceAmount: data.totalInvoiceAmount,
        totalReceivedAmount: data.totalReceivedAmount,
        noticePeriod: data.noticePeriod || 0,
        chartData: data.chartData || [],
        activities: data.activities || []
      });
      setLoader(false);
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  const fetchProperties = async () => {
    const res = await apiFetch("/api/property");
    const data = await res.json();
    if (data.length > 0) {
      fetchDashboardData(data[0]._id);
    };
  }

  useEffect(() => {
    fetchDashboardData(current_property?._id);
    if (!current_property?._id) {
      fetchProperties();
    }
  }, []);

  const openQR = () => {
    setQRcodeUrl();
    setQrOpen(true)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check this out!",
          text: "Hey, take a look at this awesome page!",
          url: `${app_config.PUBLIC_BASE_URL}/user/booking/${current_property?._id}`,
        });
      } else {
        alert("Sharing not supported in this browser.");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const options = [
    { title: 'Finances', path: '/business/revenue', icon: <ReceiptIndianRupee className="w-6 h-6" /> },
    { title: 'Broadcast', path: '/business/announcement', icon: <MessageCircleMore className="w-6 h-6" /> },
    { title: 'Managers', path: '/business/managers', icon: <Users className="w-6 h-6" /> },
    { title: 'New Booking', path: 'BOOKING_FORM', icon: <PlusIcon className="w-6 h-6" /> },
    { title: 'Booking QR', path: 'BOOKING_QR', icon: <QrCodeIcon className="w-6 h-6" /> },
    { title: 'Invoices', path: '/business/invoices', icon: <NotepadTextDashed className="w-6 h-6" /> },
    { title: 'Transactions', path: '/business/payments', icon: <BadgeDollarSign className="w-6 h-6" /> },
    { title: 'Reviews', path: '/business/review-management', icon: <Stars className="w-6 h-6" /> },
  ];

  return (
    <main className=" bg-[#FAFAFA] text-gray-800 pt-8 md:px-16 px-5 mobile-footer min-h-screen">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
      </div>
      {
        loader ? <DashboardSkeleton />
          :
          <>
            <div className="md:flex hidden flex-col gap-2 fixed bottom-12 right-4">
              <Button variant="green" size="xl" className="rounded-full" onClick={() => setShowBookingModal(true)}>
                <PlusIcon className="w-12 h-12" />
              </Button>
              <Button variant="lighGreen" size="xl" className="rounded-full" onClick={openQR}>
                <QrCodeIcon className="w-12 h-12" />
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <DashboardCard title="Total Units" value={status?.total_units} icon={Building2} color="green-700" />
              <DashboardCard title="Available" value={status?.available_units} icon={Lamp} color="green-700" />
              <DashboardCard title="Checked-in" value={status?.enrollments} icon={Users} color="green-700" />
              <DashboardCard title="Notice Per" value={status?.noticePeriod} icon={Paperclip} color="green-700" />
              <DashboardCard title="Monthly Target" value={`${current_property?.currency ?? "₹"}${status?.totalInvoiceAmount?.toLocaleString()}`} icon={Tickets} color="green-700" />
              <DashboardCard title="Monthly Rec" value={`${current_property?.currency ?? "₹"}${status?.totalReceivedAmount?.toLocaleString()}`} icon={BadgeDollarSign} color="green-700" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Charts Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions (Desktop Hidden, Mobile Visible if needed) - Keeping existing logic but refined */}
                <div className="lg:hidden grid grid-cols-4 gap-4 ">
                  {options.map((card, idx) => (
                    <div key={idx} className="flex flex-col justify-center items-center gap-2 cursor-pointer transition-all hover:scale-105"
                      onClick={() => card.path === "BOOKING_FORM" ? setShowBookingModal(true) : card.path === "BOOKING_QR" ? openQR() : router.push(card.path)} >
                      <div className="p-4 bg-green-700 text-white rounded-md">
                        {card.icon}
                      </div>
                      <span className="text-[10px] sm:text-xs text-center font-medium">{card.title}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RevenueChart data={status.chartData} currency={current_property?.currency} />
                  <BookingTrendChart data={status.chartData} />
                </div>
              </div>

              {/* Activity Section */}
              <div className="lg:col-span-1">
                <RecentActivity activities={status.activities} />
              </div>
            </div>

            {qrOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" >
                <div className="bg-white p-6 rounded-2xl shadow-2xl text-center flex flex-col justify-center gap-5 max-w-sm w-full">
                  <h2 className="text-xl font-bold">Booking QR Code</h2>

                  <div className="flex justify-center p-4 bg-gray-50 rounded-xl">
                    <QRCodeCanvas
                      value={qrUrl}
                      size={240}
                      bgColor="#F9FAFB"
                      fgColor="#000000"
                      level="H"
                    />
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700 h-11" onClick={handleShare}>
                      <Share className="mr-2 h-4 w-4" /> Share Link
                    </Button>
                    <Button variant="outline" className="w-full h-11" onClick={() => setQrOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Booking Modal */}
            <BookingAddEditModal
              open={showBookingModal}
              onClose={() => {
                setShowBookingModal(false);
              }}
              onSave={() => {
                setShowBookingModal(false);
                fetchDashboardData(current_property?._id); // Refresh data
              }}
            />
          </>}
    </main>
  );
}

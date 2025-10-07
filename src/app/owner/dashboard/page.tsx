"use client";

import { Building2, Users, QrCode, DollarSign, Plus, Calendar, NotepadTextDashed, Square, Building, EyeOff, Ligature, LightbulbIcon, Factory, BuildingIcon, Megaphone, PlusIcon, BadgeDollarSign, QrCodeIcon, Headset } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { IProperty } from "@/app/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DashboardCard from "../../../components/card";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import PropertyFormModal from "@/components/PropertyFormModal";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import BookingAddEditModal from "@/components/BookingFormModal";
import toast from "react-hot-toast";
import { FullscreenLoader } from "@/components/Loader";


export default function OwnerDashboard() {
  const router = useRouter();
  const [qrOpen, setQrOpen] = useState(false);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [loader, setLoader] = useState(true);

  const [stats, setStats] = useState({
    total_rooms: 0,
    available_rooms: 0,
    enrollments: 0,
    totalInvoiceAmount: 0,
    totalReceivedAmount: 0,
    noticePeriod: 0
  });

  const setQRcodeUrl = () => {
    const prop = localStorageServiceSelectedOptions.getItem()
    setQrUrl(`http://arp.webcos.co/booking-form?property_id=${prop?.property?._id}`);
  }

  // Fetch stats from backend API
  const fetchStats = async () => {
    const prop = localStorageServiceSelectedOptions.getItem()?.property?._id
    console.log(prop);

    if (!prop) {
      setLoader(false);
      toast.error("Select Property")
      return
    }
    setLoader(true);
    try {
      const res = await apiFetch(`/api/dashboard?prop=${prop}`); // replace with your API route
      console.log(res);

      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setStats({
        total_rooms: data.total_rooms,
        available_rooms: data.available_rooms,
        enrollments: data.enrollments,
        totalInvoiceAmount: data.totalInvoiceAmount,
        totalReceivedAmount: data.totalReceivedAmount,
        noticePeriod: data.noticePeriod || 0
      });
      setLoader(false);
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const openQR = () => {
    setQRcodeUrl();
    setQrOpen(true)
  }

  const options = [
    { title: 'Bookings', path: '/owner/bookings', icon: <Calendar className="w-6 h-6 min-w-6 min-h-6" /> },
    { title: 'Invoices', path: '/owner/invoices', icon: <NotepadTextDashed className="w-6 h-6 min-w-6 min-h-6" /> },
    { title: 'Broadcast', path: '/owner/announcement', icon: <Megaphone className="w-6 h-6 min-w-6 min-h-6" /> },
    { title: 'Managers', path: '/owner/managers', icon: <Users className="w-6 h-6 min-w-6 min-h-6" /> },

    { title: 'Add Bookings', path: 'BOOKING_FORM', icon: <PlusIcon className="w-6 h-6 min-w-6 min-h-6" /> },
    { title: 'Pricing', path: '/owner/subscription-plan', icon: <BadgeDollarSign className="w-6 h-6 min-w-6 min-h-6" /> },
    { title: 'Booking QR', path: 'BOOKING_QR', icon: <QrCodeIcon className="w-6 h-6 min-w-6 min-h-6" /> },
    { title: 'Support', path: '/owner/supoort', icon: <Headset className="w-6 h-6 min-w-6 min-h-6" /> },
  ];

  if (loader) return <FullscreenLoader />;

  return (
    <main className=" bg-white text-gray-800 pt-8 md:px-32 px-5 mb-10 ">
      {/* <div className=" w-full "  >
      <div className=" w-full">
        Current Property
          <div className=" h-15 shadow-md rounded-2xl p-4 text-center flex justify-between items-center mb-6 gap-2 w-full" style={{maxWidth:"600px"}}>
          <select
            name="frequency"
            value={selectedProperty || ""}
            onChange={handleChange}
            className="w-full  "
            required
          >
            <option value=""> Select Property</option>
            {properties.map((property: any) => (
              <option key={property?._id} value={property?._id}>
                {property?.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      </div> */}

      <h1 className="text-2xl hidden md:block font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard title="Total Rooms" value={stats.total_rooms} icon={Building2} />
        <DashboardCard title="Available Rooms" value={stats.available_rooms} icon={BuildingIcon} />
        <DashboardCard title="Notice Period" value={stats.noticePeriod} icon={BuildingIcon} />
        <DashboardCard title="Enrollments" value={stats.enrollments} icon={Users} />
        <DashboardCard title="Target" value={`₹${0}`} icon={DollarSign} />
        <DashboardCard title="Monthly Received" value={`₹${0}`} icon={DollarSign} />
      </div>

      <div className=" md:hidden grid grid-cols-4 gap-4 mt-8">
        {options.map((card, idx) => (
          <div key={idx} className="flex flex-col justify-center items-center gap-1"
            onClick={() => card.path === "BOOKING_FORM" ? setShowBookingModal(true) : card.path === "BOOKING_QR" ? openQR() : router.push(card.path)} >
            <Button className="h-15 w-15 bg-green-700">
              {card.icon}
            </Button>
            <span className="text-xs text-nowrap">{card.title}</span>
          </div>
        ))}
      </div>

      {qrOpen && (
        <div className="fixed inset-0  flex justify-center items-center z-50" >
          <div className="bg-white p-6 rounded-lg shadow-2xl text-center flex flex-col justify-center gap-5">
            <h2 className="text-lg font-semibold mb-3">Booking QR Code</h2>

            {/* ✅ Actual QR Code */}
            <QRCodeCanvas
              value={qrUrl}
              size={300}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            // includeMargin={true}
            />

            {/* <p className="text-sm text-gray-500 mt-2 break-all">
              {qrUrl}
            </p> */}

            <Button
              className="mt-4 w-full"
              onClick={() => setQrOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {/* Booking Modal */}
      <BookingAddEditModal
        open={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
        }}
        onSave={() => {
          setShowBookingModal(false);
        }}
      />
    </main>
  );
}

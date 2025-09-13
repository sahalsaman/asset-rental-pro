"use client";

import { Building2, Users, QrCode, DollarSign, Plus, Calendar, NotepadTextDashed, Square, Building, EyeOff, Ligature, LightbulbIcon, Factory, BuildingIcon, Megaphone } from "lucide-react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DashboardCard from "../../../components/card";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import PropertyFormModal from "@/components/PropertyFormModal";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";


export default function OwnerDashboard() {
  const router = useRouter();
  const [qrOpen, setQrOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState("");
  const [addEditOpen, setAddEditOpen] = useState(false);

  const [stats, setStats] = useState({
    properties: 0,
    rooms: 0,
    enrollments: 0,
    monthlyReceived: 0,
  });

  // Fetch stats from backend API
  const fetchStats = async () => {
    try {
      const res = await apiFetch("/api/dashboard"); // replace with your API route
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setStats({
        properties: data.properties,
        rooms: data.availableRooms,
        enrollments: data.enrollments,
        monthlyReceived: data.monthlyReceived,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProperties = async () => {
    const res = await apiFetch("/api/property");
    const data = await res.json();
    setProperties(data);
    if (data.length > 0) {
      setSelectedProperties(data[0]._id);
      localStorageServiceSelectedOptions.setItem({ property: data[0] });
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProperties();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setSelectedProperties(value);
    localStorageServiceSelectedOptions.setItem({ property: value });
  };

  const options = [
    { title: 'Bookings', path: '/owner/bookings', icon: <Calendar className="w-6 h-6 min-w-6 min-h-6" /> },
    { title: 'Invoices', path: '/owner/invoices', icon: <NotepadTextDashed className="w-6 h-6 min-w-6 min-h-6" /> },
    { title: 'Broadcast', path: '/owner/announcement', icon: <Megaphone className="w-6 h-6 min-w-6 min-h-6" /> },
    { title: 'Managers', path: '/owner/enrolments', icon: <Users className="w-6 h-6 min-w-6 min-h-6" /> },
  ];

  return (
    <main className=" bg-white text-gray-800 pt-12 md:px-32 px-5 mb-10 relative">
      <div className="absolute -top-8 left-0 w-full z-10 px-10" >
        <div className="bg-white h-15 shadow-md rounded-2xl p-4 text-center flex justify-between items-center mb-6 gap-2">
          <select
            name="frequency"
            value={selectedProperties || ""}
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
          <Button onClick={() => { setAddEditOpen(true); }}>
            Add
          </Button>
        </div>

      </div>

      <h1 className="text-2xl hidden md:block font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard title="Total Rooms" value={stats.properties} icon={Building2} />
        <DashboardCard title="Available Rooms" value={stats.rooms} icon={BuildingIcon} />
        <DashboardCard title="Notice Period" value={stats.rooms} icon={BuildingIcon} />
        <DashboardCard title="Enrollments" value={stats.enrollments} icon={Users} />
        <DashboardCard title="Target" value={`₹${stats.monthlyReceived}`} icon={DollarSign} />
        <DashboardCard title="Monthly Received" value={`₹${stats.monthlyReceived}`} icon={DollarSign} />
      </div>

      <div className=" md:hidden grid grid-cols-4 gap-4 mt-8">
        {options.map((card, idx) => (
          <div key={idx} className="flex flex-col justify-center items-center gap-1"
            onClick={() => router.push(card.path)}>
            <Button className="h-15 w-15 bg-green-900">
              {card.icon}
            </Button>
            <span className="text-xs text-nowrap">{card.title}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button variant="outline" onClick={() => alert("Add Enrollment Clicked")} className="flex items-center gap-2 h-18 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Booking
        </Button>

        <Button variant="outline" onClick={() => setQrOpen(true)} className="flex items-center gap-2 h-18 cursor-pointer">
          <QrCode className="w-4 h-4" /> Show QR Code
        </Button>
      </div>

      {qrOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* <QRCode value="https://your-enrollment-link.com" /> */}
            <img src="https://img.freepik.com/free-vector/scan-me-qr-code_78370-2915.jpg?semt=ais_hybrid&w=740&q=80" alt="" />
            <Button className="mt-4 w-full" onClick={() => setQrOpen(false)}>Close</Button>
          </div>
        </div>
      )}
      <PropertyFormModal
        open={addEditOpen}
        onClose={() => setAddEditOpen(false)}
      />
    </main>
  );
}

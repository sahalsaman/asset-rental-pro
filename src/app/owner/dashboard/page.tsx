"use client";

import { Building2, Users, QrCode, DollarSign, Plus } from "lucide-react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DashboardCard from "./card";


export default function OwnerDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const [stats, setStats] = useState({
    properties: 0,
    spaces: 0,
    enrollments: 0,
    monthlyReceived: 0,
  });

  useEffect(() => {
    // Fetch stats from API
    // Example:
    setStats({
      properties: 5,
      spaces: 12,
      enrollments: 20,
      monthlyReceived: 45000,
    });
  }, []);

  return (
    <main className=" bg-white text-gray-800 p-6">
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard title="Properties" value={stats.properties} icon={Building2} />
        <DashboardCard title="Available Spaces" value={stats.spaces} icon={Building2} />
        <DashboardCard title="Enrollments" value={stats.enrollments} icon={Users} />
        <DashboardCard title="Monthly Received" value={`₹${stats.monthlyReceived}`} icon={DollarSign} />
      </div>

      <div className="flex gap-4 mt-6">
        <Button onClick={() => alert("Add Enrollment Clicked")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Enrollment
        </Button>

        <Button variant="outline" onClick={() => setQrOpen(true)} className="flex items-center gap-2">
          <QrCode className="w-4 h-4" /> Show QR Code
        </Button>
      </div>

      {qrOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* <QRCode value="https://your-enrollment-link.com" /> */}
            <Button className="mt-4 w-full" onClick={() => setQrOpen(false)}>Close</Button>
          </div>
        </div>
      )}
    </main>
  );
}

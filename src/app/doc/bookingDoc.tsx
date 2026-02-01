// app/documentation/bookings/page.tsx
import React from "react";
import {
  Building2,
  ListChecks,
  Filter,
  Sliders,
  Search,
  Calendar,
  DoorClosed,
  Check,
  Zap
} from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1a5f7a]">
              Bookings System
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              End-to-end reservation management and tracking
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col xl:flex-row gap-10">
          {/* Left – Features */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
              <FeatureCard
                icon={ListChecks}
                title="Booking Management"
              >
                <span>
                  <strong>Centralized List:</strong> View all bookings for the
                  selected property in a single unified list.
                </span>
                <span>
                  <strong>Manual Booking Creation:</strong> Add bookings for
                  walk-ins or phone reservations directly from the app.
                </span>
                <span>
                  <strong>Detailed View:</strong> Access guest details, payment
                  status, special requests, and booking timeline.
                </span>
              </FeatureCard>

              <FeatureCard
                icon={Filter}
                title="Filters & Search"
              >
                <span>
                  <strong>Smart Filters:</strong> Quickly switch between
                  Upcoming, Active, Completed, and Canceled bookings.
                </span>
                <span>
                  <strong>Powerful Search:</strong> Find bookings by guest name,
                  unit number, or booking ID.
                </span>
                <span>
                  <strong>Date Range:</strong> Analyze occupancy using custom
                  calendar filters.
                </span>
              </FeatureCard>

              <FeatureCard
                icon={Sliders}
                title="Actions & Controls"
              >
                <span>
                  <strong>Check-In / Check-Out:</strong> Update guest arrival
                  and departure with a single tap.
                </span>
                <span>
                  <strong>Easy Modifications:</strong> Change dates, units, or
                  guest contact details effortlessly.
                </span>
                <span>
                  <strong>Cancellation Handling:</strong> Automatically release
                  inventory back to availability.
                </span>
              </FeatureCard>
            </div>
          </div>

          {/* Right – Visual Preview */}
          <div className="w-full xl:w-[35%] flex flex-col gap-6">
            <div className="bg-gray-50 border rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">
                Interface Preview
              </p>

              {/* Search */}
              <div className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2 text-sm text-gray-400 mb-5">
                <Search size={16} />
                Search guest, unit, or date...
              </div>

              {/* Booking Cards */}
              <BookingCard
                name="Sarah Jenkins"
                bookingId="#BK-7829"
                date="Oct 12 – 15"
                unit="Unit 402"
                status="Confirmed"
              />

              <BookingCard
                name="Michael Chang"
                bookingId="#BK-7830"
                date="Oct 14 – 18"
                unit="Unit 105"
                status="Pending"
              />
            </div>

            {/* Tip Box */}
            <div className="bg-[#1a5f7a] rounded-xl p-6 text-white">
              <h4 className="font-bold font-montserrat mb-2 flex items-center gap-2">
                <Zap className="text-yellow-300" size={16} />
                Quick Tip
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Long-press on any booking card to access quick actions like
                status updates or contacting guests via WhatsApp or Email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function FeatureCard({
  icon: Icon,
  title,
  children,
}: any) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="flex items-center gap-3 font-montserrat font-bold text-lg text-gray-800 mb-4 border-b pb-3">
        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-100 text-sky-600 text-sm">
          <Icon size={16} />
        </span>
        {title}
      </h3>
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}

function BookingCard({
  name,
  bookingId,
  date,
  unit,
  status,
}: any) {
  const statusStyles: any = {
    Confirmed: "bg-green-100 text-green-700 border-green-500",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-500",
    Cancelled: "bg-red-100 text-red-700 border-red-500",
  };

  return (
    <div
      className={`bg-white border-l-4 rounded-xl p-4 mb-4 shadow-sm ${statusStyles[status] || ""
        }`}
    >
      <div className="flex justify-between mb-2">
        <p className="font-semibold text-sm text-gray-800">{name}</p>
        <p className="text-xs text-gray-400">{bookingId}</p>
      </div>

      <div className="flex gap-4 text-xs text-gray-500 mb-2">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {date}
        </span>
        <span className="flex items-center gap-1">
          <DoorClosed size={12} />
          {unit}
        </span>
      </div>

      <span className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full bg-opacity-20">
        {status}
      </span>
    </div>
  );
}

function CheckItem({ children }: any) {
  return (
    <li className="relative pl-8">
      <Check className="absolute left-0 top-1 text-green-500" size={16} />
      {children}
    </li>
  );
}

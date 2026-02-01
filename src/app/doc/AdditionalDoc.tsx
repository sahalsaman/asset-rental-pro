import React from "react";
import {
  Building2,
  IdCard,
  CalendarPlus,
  QrCode,
  Headset,
  Check
} from "lucide-react";

export default function AdditionalFeaturesPage() {
  return (
    <div className=" p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1a5f7a]">
              Additional Features
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Essential tools designed to enhance daily operations
            </p>
          </div>

        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={IdCard}
            title="Profile Management"
            description="Manage your personal account details and security settings. The central hub for user-specific configurations and session management."
            tags={["Personal Details", "Password Reset", "Preferences", "Avatar Upload"]}
            color="sky"
          />

          <FeatureCard
            icon={CalendarPlus}
            title="Quick Booking Creation"
            description="Create new reservations instantly from the dashboard. Streamlined flow for walk-ins or phone bookings without navigating complex menus."
            tags={["One-Tap Access", "Guest Lookup", "Price Override", "Instant Confirm"]}
            color="green"
          />

          <FeatureCard
            icon={QrCode}
            title="Booking QR Code"
            description="Generate unique QR codes for each property or specific booking. Facilitate seamless check-ins and digital key access for guests."
            tags={["Property Specific", "Guest Sharing", "Check-in Verify", "Digital Entry"]}
            color="purple"
          />

          <FeatureCard
            icon={Headset}
            title="Help & Support"
            description="Direct access to assistance when you need it. Browse FAQs, submit tickets, or contact support agents directly from the app."
            tags={["Ticketing System", "Knowledge Base", "Chat Support", "System Status"]}
            color="red"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function FeatureCard({ icon: Icon, title, description, tags, color }: any) {
  const colorMap: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700 border-sky-100 ring-sky-500/20",
    green: "bg-green-50 text-green-700 border-green-100 ring-green-500/20",
    purple: "bg-purple-50 text-purple-700 border-purple-100 ring-purple-500/20",
    red: "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/20",
  };

  const iconColorMap: Record<string, string> = {
    sky: "bg-sky-100 text-sky-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-rose-100 text-rose-600",
  };

  return (
    <div className={`relative flex flex-col sm:flex-row gap-6 bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all`}>
      {/* Icon */}
      <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${iconColorMap[color]}`}>
        <Icon size={32} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-montserrat font-bold text-lg text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag: string, idx: number) => (
            <span key={idx} className="bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1 text-xs flex items-center gap-1 text-gray-600 font-medium">
              <Check size={12} className="text-gray-400" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import {
  Building2,
  Megaphone,
  ClipboardList,
  History,
  User,
  UserCog,
  Lightbulb,
  Send,
  Eye,
  Check
} from "lucide-react";

export default function AnnouncementsPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1a5f7a]">
              Announcements
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Broadcast messaging & tenant communication tools
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#1a5f7a] font-bold">
            <Building2 size={24} />
            <span className="hidden md:inline">RENTITIES</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col xl:flex-row gap-10">
          {/* Left – Features */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
              <FeatureCard icon={Megaphone} title="Broadcast Messaging">
                <span>
                  <strong>Property-Wide Reach:</strong> Send one announcement to
                  all tenants in the selected property instantly.
                </span>
                <span>
                  <strong>Targeted Context:</strong> Messages are automatically
                  tied to the correct property.
                </span>
                <span>
                  <strong>Instant Delivery:</strong> Push notifications ensure
                  time-sensitive updates are seen quickly.
                </span>
              </FeatureCard>

              <FeatureCard icon={ClipboardList} title="Common Use Cases">
                <span>
                  <strong>Maintenance Alerts:</strong> Inform residents about
                  repairs, shutdowns, or service interruptions.
                </span>
                <span>
                  <strong>Policy Updates:</strong> Communicate changes to rules,
                  parking, or amenities.
                </span>
                <span>
                  <strong>Community Events:</strong> Share events, safety
                  notices, or important updates.
                </span>
              </FeatureCard>

              <FeatureCard icon={History} title="Audit & Tracking">
                <span>
                  <strong>Sender Transparency:</strong> Every message logs the
                  sender for accountability.
                </span>
                <span>
                  <strong>History Log:</strong> Maintain a permanent record of
                  all announcements.
                </span>
                <span>
                  <strong>Delivery Status:</strong> Track sent and seen counts
                  for each broadcast.
                </span>
              </FeatureCard>
            </div>
          </div>

          {/* Right – Preview */}
          <div className="w-full xl:w-[35%] flex flex-col gap-6">
            <div className="bg-gray-50 border rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">
                Message Preview
              </p>

              <MessageCard
                property="Sunset Apts"
                sender="Property Manager"
                time="Today, 09:30 AM"
                title="⚠️ Water Shut-off Notice"
                message="Scheduled maintenance will affect water supply tomorrow between 10 AM and 2 PM."
                sent={24}
                seen={18}
                color="border-blue-500"
                icon={User}
              />

              <MessageCard
                property="Highland Tower"
                sender="System Admin"
                time="Yesterday, 4:15 PM"
                title="🎉 New Gym Equipment"
                message="The fitness center has been upgraded with new treadmills. Available from today."
                sent={45}
                seen={42}
                color="border-green-500"
                icon={UserCog}
              />
            </div>

            {/* Tip Box */}
            <div className="bg-[#1a5f7a] rounded-xl p-6 text-white">
              <h4 className="font-bold font-montserrat mb-2 flex items-center gap-2">
                <Lightbulb className="text-yellow-300" size={16} />
                Best Practice
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Use prefixes like <strong>[URGENT]</strong> or{" "}
                <strong>[INFO]</strong> to help tenants prioritize messages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function FeatureCard({ icon: Icon, title, children }: any) {
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

function MessageCard({
  property,
  sender,
  time,
  title,
  message,
  sent,
  seen,
  color,
  icon: Icon,
}: any) {
  return (
    <div
      className={`bg-white border-l-4 rounded-xl p-4 mb-4 shadow-sm relative ${color}`}
    >
      <span className="absolute right-6 top-4 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
        {property}
      </span>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
          <Icon size={16} />
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-800">{sender}</p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mb-3">
        <strong className="block mb-1">{title}</strong>
        {message}
      </div>

      <div className="flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Send className="text-blue-400" size={12} />
          Sent: {sent}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="text-green-400" size={12} />
          Seen: {seen}
        </span>
      </div>
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

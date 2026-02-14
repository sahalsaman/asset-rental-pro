// app/documentation/business-management/page.tsx
import { Building2, CircleCheck, CreditCard, Wallet, Settings, Coins, Map, Info } from "lucide-react";
import React from "react";

export default function BusinessManagementPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-green-700">
              Business Management
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Centralized control for multi-property portfolios
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col xl:flex-row gap-10 items-center xl:items-start">
          {/* Left – Visual Mockup */}
          <div className="w-full xl:w-[45%] relative flex justify-center items-center py-6">
            {/* Blobs */}
            <div className="absolute w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-60 -top-6 -right-6" />
            <div className="absolute w-52 h-52 bg-lime-200 rounded-full blur-3xl opacity-60 bottom-6 left-6" />

            {/* Business Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-sm overflow-hidden z-10">
              {/* Header */}
              <div className="bg-green-700 text-white text-center p-6">
                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center text-green-700 text-2xl shadow">
                  <Building2 className="w-8 h-8" />
                </div>
                <p className="font-montserrat font-bold text-lg">
                  Global Estates LLC
                </p>
                <span className="inline-block mt-2 text-xs font-semibold bg-amber-500 px-3 py-1 rounded-full uppercase">
                  Pro Plan
                </span>
              </div>

              {/* Stats */}
              <div className="flex border-b border-gray-100">
                <BusinessStat value="12" label="Properties" />
                <BusinessStat value="145" label="Total Units" />
                <BusinessStat value="5" label="Managers" />
              </div>

              {/* List */}
              <BusinessItem icon={<CreditCard className="w-5 h-5" />} title="Billing & Subscription" desc="Manage plan and invoices" />
              <BusinessItem icon={<Wallet className="w-5 h-5" />} title="Payment Methods" desc="Configure payout accounts" bg="bg-green-100" color="text-green-600" />
              <BusinessItem icon={<Settings className="w-5 h-5" />} title="Business Settings" desc="General preferences" bg="bg-gray-100" color="text-gray-600" />
            </div>
          </div>

          {/* Right – Text Content */}
          <div className="flex-1 flex flex-col justify-center w-full">
            {/* Feature 1 */}
            <div className="mb-10">
              <h3 className="flex items-center gap-3 text-2xl font-bold font-montserrat text-gray-800 mb-4">
                <Map className="text-green-700 w-6 h-6" />
                Unified Business Structure
              </h3>
              <ul className="space-y-4 text-gray-600 text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <CircleCheck className="text-green-400 mt-1 flex-shrink-0" size={20} />
                  <span>
                    <strong>Single Sign-On Access:</strong> Manage multiple properties under one business without switching logins.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CircleCheck className="text-green-400 mt-1 flex-shrink-0" size={20} />
                  <span>
                    <strong>Centralized Dashboard:</strong> Aggregated views at business level with property-wise control.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CircleCheck className="text-green-400 mt-1 flex-shrink-0" size={20} />
                  <span>
                    <strong>Team Management:</strong> Assign roles globally or per property.
                  </span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold font-montserrat text-gray-800 mb-4">
                <Coins className="text-green-700 w-6 h-6" />
                Financial & Subscription Control
              </h3>
              <ul className="space-y-4 text-gray-600 text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <CircleCheck className="text-green-400 mt-1 flex-shrink-0" size={20} />
                  <span>
                    <strong>Business-Level Billing:</strong> One subscription covers all linked properties.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CircleCheck className="text-green-400 mt-1 flex-shrink-0" size={20} />
                  <span>
                    <strong>Flexible Payouts:</strong> Configure different payment accounts per property.
                  </span>
                </li>
              </ul>

              {/* Info box */}
              <div className="mt-6 bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-lg">
                <p className="text-sky-700 text-sm flex items-start gap-2">
                  <Info className="flex-shrink-0 mt-0.5" size={16} />
                  <span>
                    <strong>Pro Tip:</strong> Upgrading the business plan instantly unlocks premium features for all properties.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */
function BusinessStat({ value, label }: any) {
  return (
    <div className="flex-1 text-center p-4 border-r last:border-r-0 border-gray-100">
      <p className="text-lg font-bold text-gray-700">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function BusinessItem({ icon, title, desc, bg = "bg-sky-100", color = "text-sky-600" }: any) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition">
      <div className={`w-10 h-10 rounded-lg ${bg} ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

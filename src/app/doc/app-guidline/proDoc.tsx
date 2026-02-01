// app/documentation/property-management/page.tsx
import React from "react";
import {
  Building2,
  Home,
  Store,
  Plus,
  CheckCircle,
  ListChecks,
  PlusCircle,
  AlertTriangle,
  Building,
} from "lucide-react";

export default function PropertyManagementPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1a5f7a]">
              Property Management
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Efficiently manage details, status, and settings for each property
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#1a5f7a] font-bold">
            <Building className="w-8 h-8" />
            <span className="hidden md:inline">RENTITIES</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col xl:flex-row gap-10 items-center xl:items-start">
          {/* Left – App Mockup */}
          <div className="w-full xl:w-[45%] relative flex justify-center items-center py-6">
            {/* Blobs */}
            <div className="absolute w-72 h-72 bg-sky-200 rounded-full blur-3xl opacity-60 -top-6 -right-6" />
            <div className="absolute w-52 h-52 bg-rose-200 rounded-full blur-3xl opacity-60 bottom-6 left-6" />

            {/* App Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-sm h-auto overflow-hidden flex flex-col z-10">
              {/* Header */}
              <div className="bg-[#1a5f7a] text-white flex justify-between items-center px-5 py-4">
                <p className="font-semibold text-sm">My Properties</p>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Selected
                </span>
              </div>

              {/* Property List */}
              <div className="flex-1 bg-gray-50 p-4 space-y-3 min-h-[300px]">
                <PropertyCard
                  active
                  icon={<Building2 className="w-5 h-5" />}
                  title="Sunrise Apartments"
                  meta="12 Units • Downtown"
                  color="bg-blue-500"
                />

                <PropertyCard
                  icon={<Home className="w-5 h-5" />}
                  title="Lakeside Villa"
                  meta="1 Unit • West Side"
                />

                <PropertyCard
                  icon={<Store className="w-5 h-5" />}
                  title="Main St Commercial"
                  meta="3 Units • Business District"
                />
              </div>

              {/* Add Button */}
              <div className="absolute bottom-5 right-5 w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Right – Text Content */}
          <div className="flex-1 flex flex-col justify-center w-full">
            {/* Feature 1 */}
            <div className="mb-10">
              <h3 className="flex items-center gap-3 text-2xl font-bold font-montserrat text-gray-800 mb-4">
                <ListChecks className="text-[#468faf] w-6 h-6" />
                Property Listing & Selection
              </h3>

              <ul className="space-y-4 text-gray-600 text-base leading-relaxed">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1a5f7a] flex-shrink-0" />
                  <span>
                    <strong>Centralized View:</strong> Access all real estate
                    assets from a single list view.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1a5f7a] flex-shrink-0" />
                  <span>
                    <strong>Current Selection:</strong> Active property remains
                    visible across the app for clarity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1a5f7a] flex-shrink-0" />
                  <span>
                    <strong>Quick Editing:</strong> Update details, photos, and
                    status instantly.
                  </span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold font-montserrat text-gray-800 mb-4">
                <PlusCircle className="text-[#468faf] w-6 h-6" />
                Adding New Properties
              </h3>

              <ul className="space-y-4 text-gray-600 text-base leading-relaxed">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1a5f7a] flex-shrink-0" />
                  <span>
                    <strong>Simple Onboarding:</strong> Add properties via a
                    streamlined popup form.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1a5f7a] flex-shrink-0" />
                  <span>
                    <strong>Essential Details:</strong> Name, address, and
                    configuration to get started fast.
                  </span>
                </li>
              </ul>

              {/* Note */}
              <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <p className="text-amber-700 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <strong>Note:</strong> Virtual account integration is under
                    development and will be available soon.
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

function PropertyCard({
  icon,
  title,
  meta,
  active = false,
  color = "bg-gray-500",
}: any) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition cursor-pointer hover:shadow-sm ${active
        ? "border-sky-500 bg-sky-50"
        : "border-gray-200 bg-white hover:bg-gray-50"
        }`}
    >
      <div
        className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white flex-shrink-0`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{meta}</p>
      </div>

      {active && <CheckCircle className="text-sky-500 ml-auto w-5 h-5 flex-shrink-0" />}
    </div>
  );
}

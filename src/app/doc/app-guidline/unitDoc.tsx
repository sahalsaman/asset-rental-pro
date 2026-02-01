// app/documentation/unit-management/page.tsx
import React from "react";
import {
  Building2,
  Filter,
  ChevronDown,
  DoorOpen,
  PlusCircle,
  Lightbulb,
  Check
} from "lucide-react";

export default function UnitManagementPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1a5f7a]">
              Unit & Room Management
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Detailed inventory control for your properties
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#1a5f7a] font-bold">
            <Building2 size={24} />
            <span className="hidden md:inline">RENTITIES</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col xl:flex-row gap-10 items-center xl:items-start">
          {/* Left – App Mockup */}
          <div className="w-full xl:w-[45%] relative flex justify-center items-center py-6">
            {/* Blobs */}
            <div className="absolute w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-60 -top-10 -left-10" />
            <div className="absolute w-52 h-52 bg-sky-200 rounded-full blur-3xl opacity-60 bottom-10 right-10" />

            {/* App */}
            <div className="relative bg-white rounded-2xl shadow-2xl border-8 border-slate-700 w-full max-w-sm overflow-hidden z-10">
              {/* Header */}
              <div className="bg-[#1a5f7a] text-white px-5 py-4 flex justify-between items-center">
                <p className="font-semibold text-sm">Sunrise Apartments</p>
                <Filter size={16} />
              </div>

              {/* Unit List */}
              <div className="bg-gray-50 p-4 space-y-3">
                <UnitCard
                  title="Unit 101"
                  meta="2 Bed • 850 sqft"
                  price="$1,200"
                  status="Available"
                />
                <UnitCard
                  title="Unit 102"
                  meta="1 Bed • 600 sqft"
                  price="$950"
                  status="Occupied"
                  occupied
                />
                <UnitCard
                  title="Unit 103"
                  meta="Studio • 450 sqft"
                  price="$800"
                  status="Available"
                />
              </div>

              {/* Modal Overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-end">
                <div className="bg-white w-full rounded-t-2xl p-5 animate-slideUp">
                  <div className="w-10 h-1 bg-gray-300 rounded mx-auto mb-4" />

                  <h4 className="text-[#1a5f7a] font-semibold mb-4">
                    Add New Unit
                  </h4>

                  <FormField label="Unit Number / Name" value="Unit 104" />
                  <FormField
                    label="Unit Type"
                    value={
                      <div className="flex justify-between items-center">
                        Apartment
                        <ChevronDown className="text-gray-400" size={16} />
                      </div>
                    }
                  />

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <p className="text-sm font-semibold">
                      Bulk Creation Mode
                    </p>
                    <Toggle />
                  </div>

                  <button className="mt-4 w-full bg-[#1a5f7a] text-white py-2 rounded-lg text-sm font-medium">
                    Create Unit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right – Text */}
          <div className="flex-1 flex flex-col justify-center w-full">
            {/* Feature 1 */}
            <div className="mb-10">
              <h3 className="flex items-center gap-3 text-2xl font-bold font-montserrat text-gray-800 mb-4">
                <DoorOpen className="text-[#468faf]" size={24} />
                Comprehensive Unit Control
              </h3>

              <div className="space-y-4 text-gray-600 text-base leading-relaxed">
                <CheckItem>
                  <strong>Property-Specific Views:</strong> Units are filtered
                  automatically based on the selected property.
                </CheckItem>
                <CheckItem>
                  <strong>Status at a Glance:</strong> Instantly identify
                  available and occupied units visually.
                </CheckItem>
                <CheckItem>
                  <strong>Detailed Attributes:</strong> Manage pricing, unit
                  type, size, and amenities with ease.
                </CheckItem>
              </div>
            </div>

            {/* Feature 2 */}
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold font-montserrat text-gray-800 mb-4">
                <PlusCircle className="text-[#468faf]" size={24} />
                Efficient Creation Tools
              </h3>

              <div className="space-y-4 text-gray-600 text-base leading-relaxed">
                <CheckItem>
                  <strong>Quick Add Modal:</strong> Add units without leaving
                  the current screen.
                </CheckItem>
                <CheckItem>
                  <strong>Bulk Creation Toggle:</strong> Create multiple units
                  in one action.
                </CheckItem>
                <CheckItem>
                  <strong>Instant Updates:</strong> Newly added units appear
                  immediately.
                </CheckItem>
              </div>

              <div className="mt-6 bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-lg">
                <p className="text-sky-700 text-sm flex items-center">
                  <Lightbulb className="mr-2" size={16} />
                  <strong>Tip:</strong> Use bulk creation for hotels or large
                  apartments to save hours of setup time.
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

function UnitCard({
  title,
  meta,
  price,
  status,
  occupied = false,
}: any) {
  return (
    <div
      className={`flex justify-between items-center p-4 rounded-xl bg-white shadow border-l-4 ${occupied ? "border-red-500" : "border-green-500"
        }`}
    >
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-gray-500">{meta}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-[#1a5f7a]">{price}</p>
        <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-600">
          {status}
        </span>
      </div>
    </div>
  );
}

function FormField({ label, value }: any) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700">
        {value}
      </div>
    </div>
  );
}

function Toggle() {
  return (
    <div className="w-9 h-5 bg-green-500 rounded-full relative">
      <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 right-0.5 shadow" />
    </div>
  );
}

function CheckItem({ children }: any) {
  return (
    <div className="flex gap-2 items-start">
      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
      <span>{children}</span>
    </div>
  );
}

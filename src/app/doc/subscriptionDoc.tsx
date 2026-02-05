import React from "react";
import { Building2, Check, X, Info } from "lucide-react";
import { subscription_plans } from "@/utils/data";

export default function SubscriptionPlansPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-green-700">
              App Subscription Plans
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Flexible pricing tiers scaled for your organization
            </p>
          </div>

        </div>

        {/* Billing Toggle */}
        <div className="flex items-center bg-gray-200 rounded-full p-1 justify-center mb-6 w-max mx-auto">
          <ToggleOption label="Monthly" active={true} />
          <ToggleOption label="Yearly" active={false} />
        </div>

        {/* Pricing Cards */}
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {subscription_plans.map((i) =>
            <PricingCard
              name={i.name}
              price={i.amount}
              period="/mo"
              description={i.description}
              features={i.features}
              button={{ label: i.buttonText, primary: i.highlight }}
            />)}


        </div>

        {/* Organization Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg px-5 py-4 flex items-start gap-4 text-blue-800 max-w-3xl mx-auto">
          <Info className="mt-0.5" size={24} />
          <div className="text-sm">
            <strong>Organization-Level Billing:</strong> Subscriptions are applied
            to your entire organization. Upgrading creates a single invoice
            covering all properties and units managed under your account.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function ToggleOption({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`px-6 py-2 rounded-full cursor-pointer text-sm font-medium transition-all ${active
        ? "bg-green-700 text-white shadow-md"
        : "text-gray-500 hover:text-green-700"
        }`}
    >
      {label}
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  button,
  featured = false,
}: any) {
  return (
    <div
      className={`h-full relative flex flex-col bg-white border rounded-2xl p-8 transition-transform w-full ${featured
        ? "lg:scale-105 border-2 border-green-700 shadow-xl z-10"
        : "hover:-translate-y-2 hover:shadow-lg"
        }`}
    >
      {featured && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase shadow-md whitespace-nowrap">
          Most Popular
        </div>
      )}
      <h3 className="font-montserrat font-bold text-lg text-gray-800 text-center mb-2">
        {name}
      </h3>
      <div className="text-center text-green-700 mb-4">
        <span className="text-xl font-semibold align-top">$</span>
        <span className="text-4xl font-extrabold font-montserrat mx-1">{price}</span>
        <span className="text-sm text-gray-500">{period}</span>
      </div>
      <p className="text-center text-gray-500 text-sm mb-6 border-b border-gray-200 pb-4 min-h-[60px]">
        {description}
      </p>
      <div className="flex-1 mb-6 space-y-3">
        {features.map((f: any, idx: number) => (
          <div key={idx} className="flex items-center text-sm text-gray-600">

            <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />

            <span >
              {f}
            </span>
          </div>
        ))}
      </div>
      <button
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${button.primary
          ? "bg-green-700 text-white shadow-md hover:bg-[#164e63]"
          : "border-2 border-gray-200 text-gray-600 hover:border-green-700 hover:text-green-700"
          }`}
      >
        {button.label}
      </button>
    </div>
  );
}

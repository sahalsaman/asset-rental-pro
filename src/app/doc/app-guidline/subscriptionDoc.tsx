import React from "react";
import { Building2, Check, X, Info } from "lucide-react";

export default function SubscriptionPlansPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1a5f7a]">
              App Subscription Plans
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Flexible pricing tiers scaled for your organization
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#1a5f7a] font-bold">
            <Building2 size={24} />
            <span className="hidden md:inline">RENTITIES</span>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center bg-gray-200 rounded-full p-1 justify-center mb-6 w-max mx-auto">
          <ToggleOption label="Monthly" active={false} />
          <ToggleOption label="Yearly (Save 20%)" active={true} />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <PricingCard
            name="Basic"
            price={29}
            period="/mo"
            description="Essential tools for single property owners getting started."
            features={[
              { text: "Up to 5 Units", included: true },
              { text: "Basic Dashboard", included: true },
              { text: "Manual Bookings", included: true },
              { text: "Tenant Invoicing", included: true },
              { text: "Multi-property Support", included: false },
              { text: "Manager Accounts", included: false },
            ]}
            button={{ label: "Start Basic", primary: false }}
          />

          <PricingCard
            name="Professional"
            price={79}
            period="/mo"
            description="Advanced features for growing portfolios and management."
            features={[
              { text: "Up to 50 Units", included: true },
              { text: "Multi-Property Management", included: true },
              { text: "3 Manager Seats", included: true },
              { text: "Advanced Reports & Analytics", included: true },
              { text: "Broadcast Messaging", included: true },
              { text: "Priority Support", included: true },
            ]}
            button={{ label: "Upgrade to Pro", primary: true }}
            featured
          />

          <PricingCard
            name="Enterprise"
            price={199}
            period="/mo"
            description="Maximum power for large scale property organizations."
            features={[
              { text: "Unlimited Units", included: true },
              { text: "Unlimited Properties", included: true },
              { text: "Unlimited Managers", included: true },
              { text: "API Access", included: true },
              { text: "White-label Options", included: true },
              { text: "Dedicated Account Manager", included: true },
            ]}
            button={{ label: "Contact Sales", primary: false }}
          />
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
        ? "bg-[#1a5f7a] text-white shadow-md"
        : "text-gray-500 hover:text-[#1a5f7a]"
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
      className={`relative flex flex-col bg-white border rounded-2xl p-8 transition-transform w-full ${featured
        ? "lg:scale-105 border-2 border-[#1a5f7a] shadow-xl z-10"
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
      <div className="text-center text-[#1a5f7a] mb-4">
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
            {f.included ? (
              <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
            ) : (
              <X className="mr-2 text-gray-300 flex-shrink-0" size={16} />
            )}
            <span className={f.included ? "" : "text-gray-400 line-through"}>
              {f.text}
            </span>
          </div>
        ))}
      </div>
      <button
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${button.primary
          ? "bg-[#1a5f7a] text-white shadow-md hover:bg-[#164e63]"
          : "border-2 border-gray-200 text-gray-600 hover:border-[#1a5f7a] hover:text-[#1a5f7a]"
          }`}
      >
        {button.label}
      </button>
    </div>
  );
}

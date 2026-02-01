// app/documentation/invoices-financials/page.tsx
import React from "react";
import {
  Building2,
  FileText,
  ArrowRightLeft,
  PieChart,
  Lightbulb,
  Check
} from "lucide-react";

export default function InvoicesFinancialsPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1a5f7a]">
              Invoices & Financials
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Track and manage invoices, payments, and property finances
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
              <FeatureCard
                icon={FileText}
                title="Invoice Management"
              >
                <span>
                  <strong>Tracking & Filtering:</strong> View invoices by Paid,
                  Unpaid, Overdue, or Draft status per property.
                </span>
                <span>
                  <strong>Invoice Generation:</strong> Create and send
                  professional invoices directly to tenants or guests.
                </span>
                <span>
                  <strong>Payment Updates:</strong> Record manual payments or
                  track automated updates from integrations.
                </span>
              </FeatureCard>

              <FeatureCard
                icon={ArrowRightLeft}
                title="Financial Operations"
              >
                <span>
                  <strong>Property-Specific Accounts:</strong> Configure
                  different receiving accounts for each property.
                </span>
                <span>
                  <strong>Payment Reminders:</strong> Automatically or manually
                  notify tenants with outstanding balances.
                </span>
                <span>
                  <strong>Multi-Currency Support:</strong> Handle regional
                  currencies based on property settings.
                </span>
              </FeatureCard>

              <FeatureCard
                icon={PieChart}
                title="Reporting & Exports"
              >
                <span>
                  <strong>Export Data:</strong> Download invoice lists and
                  financial summaries for accounting software.
                </span>
                <span>
                  <strong>Revenue Insights:</strong> Monitor total revenue,
                  pending payments, and overdue amounts.
                </span>
                <span>
                  <strong>Audit Trail:</strong> Maintain a secure history of all
                  invoice changes and transactions.
                </span>
              </FeatureCard>
            </div>
          </div>

          {/* Right – Visual Preview */}
          <div className="w-full xl:w-[35%] flex flex-col gap-6">
            <div className="bg-gray-50 border rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">
                Financial Overview
              </p>

              {/* Stats */}
              <div className="flex gap-3 mb-6">
                <StatCard label="Paid" value="$4,250" color="text-green-600" />
                <StatCard
                  label="Overdue"
                  value="$850"
                  color="text-red-500"
                />
              </div>

              {/* Invoice Cards */}
              <InvoiceCard
                title="Unit 301 – Oct Rent"
                amount="$1,200.00"
                due="Oct 01, 2025"
                status="Paid"
              />

              <InvoiceCard
                title="Unit 405 – Maintenance"
                amount="$150.00"
                due="Sep 15, 2025"
                status="Overdue"
              />

              <InvoiceCard
                title="Unit 102 – Nov Rent"
                amount="$1,100.00"
                due="Nov 01, 2025"
                status="Sent"
              />
            </div>

            {/* Tip Box */}
            <div className="bg-[#1a5f7a] rounded-xl p-6 text-white">
              <h4 className="font-bold font-montserrat mb-2 flex items-center gap-2">
                <Lightbulb className="text-yellow-300" size={16} />
                Accounting Tip
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Use <strong>Export Summary</strong> to generate monthly CSV
                reports of paid invoices, grouped by property for easier tax
                filing.
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

function InvoiceCard({ title, amount, due, status }: any) {
  const statusStyles: any = {
    Paid: "border-green-500 bg-green-50 text-green-700",
    Overdue: "border-red-500 bg-red-50 text-red-700",
    Sent: "border-yellow-500 bg-yellow-50 text-yellow-700",
  };

  return (
    <div
      className={`bg-white border-l-4 rounded-xl p-4 mb-4 shadow-sm ${statusStyles[status]
        }`}
    >
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-sm text-gray-800">{title}</p>
        <p className="font-bold text-sm text-gray-800">{amount}</p>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Due: {due}</span>
        <span className="font-semibold uppercase">{status}</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  return (
    <div className="flex-1 bg-white border rounded-lg p-3 text-center">
      <p className={`font-bold text-lg ${color}`}>{value}</p>
      <p className="text-[10px] uppercase text-gray-400 mt-1">{label}</p>
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

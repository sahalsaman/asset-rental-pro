// app/documentation/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import CoverSlidePage from "./coverDoc";
import AuthenticationFlowPage from "./authDoc";
import DashboardOverviewPage from "./dashboardDoc";
import OrganizationManagementPage from "./orgDoc";
import PropertyManagementPage from "./proDoc";
import UnitManagementPage from "./unitDoc";
import BookingsPage from "./bookingDoc";
import InvoicesFinancialsPage from "./finDoc";
import AnnouncementsPage from "./announcementDoc";
import ManagerManagementPage from "./managerDoc";
import AdditionalFeaturesPage from "./AdditionalDoc";
import SubscriptionPlansPage from "./subscriptionDoc";
import ThankYouSlide from "./endDoc";

const sections = [
  { id: "cover", label: "RENTITIES", page: 1 },
  { id: "auth", label: "Auth", page: 2 },
  { id: "dashboard", label: "Dashboard", page: 3 },
  { id: "org", label: "Organization", page: 4 },
  { id: "property", label: "Property", page: 5 },
  { id: "units", label: "Units", page: 6 },
  { id: "bookings", label: "Bookings", page: 7 },
  { id: "invoices", label: "Invoices", page: 8 },
  { id: "announcements", label: "Announce", page: 9 },
  { id: "managers", label: "Managers", page: 10 },
  { id: "additional", label: "Features", page: 11 },
  { id: "plans", label: "Plans", page: 12 },
  { id: "thankyou", label: "End", page: 13 },
];

export default function RentitiesDocumentation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("cover");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element &&
          element.offsetTop <= scrollPosition &&
          (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(el.getAttribute("href")!);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsMobileMenuOpen(false);
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header trigger */}
      <div className="lg:hidden bg-white border-b p-4 sticky top-[76px] z-30 flex items-center justify-between">
        <span className="font-semibold text-gray-700">Jump to section</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] overflow-y-auto
        ${isMobileMenuOpen ? "translate-x-0 top-[138px]" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">
            Contents
          </h3>
          <nav className="space-y-1">
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`
                  flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${activeSection === item.id
                    ? "bg-green-200 text-green-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                `}
              >
                <span>{item.label}</span>
                {activeSection === item.id && <ChevronRight size={14} />}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* OVERLAY for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden top-[138px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 w-full">
        <div className=" py-8 lg:py-12 space-y-12 lg:space-y-24 pb-24">
          <section id="cover" className="scroll-mt-24"><CoverSlidePage /></section>
          <section id="auth" className="scroll-mt-24"><AuthenticationFlowPage /></section>
          <section id="dashboard" className="scroll-mt-24"><DashboardOverviewPage /></section>
          <section id="org" className="scroll-mt-24"><OrganizationManagementPage /></section>
          <section id="property" className="scroll-mt-24"><PropertyManagementPage /></section>
          <section id="units" className="scroll-mt-24"><UnitManagementPage /></section>
          <section id="bookings" className="scroll-mt-24"><BookingsPage /></section>
          <section id="invoices" className="scroll-mt-24"><InvoicesFinancialsPage /></section>
          <section id="announcements" className="scroll-mt-24"><AnnouncementsPage /></section>
          <section id="managers" className="scroll-mt-24"><ManagerManagementPage /></section>
          <section id="additional" className="scroll-mt-24"><AdditionalFeaturesPage /></section>
          <section id="plans" className="scroll-mt-24"><SubscriptionPlansPage /></section>
          <section id="thankyou" className="scroll-mt-24"><ThankYouSlide /></section>
        </div>
      </main>
    </div>
  );
}
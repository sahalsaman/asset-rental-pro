"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutList, Calendar as CalendarIcon, PieChart } from "lucide-react";

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { id: "overview", label: "Overview", icon: <PieChart size={18} />, href: "/business/bookings/overview" },
        { id: "list", label: "List View", icon: <LayoutList size={18} />, href: "/business/bookings/list" },
        { id: "calendar", label: "Calendar View", icon: <CalendarIcon size={18} />, href: "/business/bookings/calendar" },
    ];

    const activeTab = tabs.find(tab => pathname.startsWith(tab.href))?.id || "overview";

    return (
        <div className="p-5 md:pt-10 md:px-16 min-h-screen mobile-footer mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="w-full md:w-auto">
                    <h1 className="text-2xl font-bold text-gray-900">Bookings Hub</h1>
                    <p className="text-gray-500 text-sm mt-1">Monitor trends and manage all property bookings</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <Link key={tab.id} href={tab.href} className="flex-1 md:flex-none">
                            <TabButton
                                active={activeTab === tab.id}
                                icon={tab.icon}
                                label={tab.label}
                            />
                        </Link>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function TabButton({ active, icon, label }: any) {
    return (
        <div
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${active
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
        >
            {icon}
            {label}
        </div>
    );
}

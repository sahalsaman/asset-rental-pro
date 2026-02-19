"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { CalendarSkeleton } from "@/components/Loader";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BookingsCalendar() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const prop = localStorageServiceSelectedOptions.getItem()?.property;

    useEffect(() => {
        if (prop?._id) fetchBookings();
    }, [currentDate, prop?._id]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            // Fetch all bookings for the year/month? 
            // For now, fetching same list as List view but we might need to filter by range in API ideally.
            // Using existing API for simplicity as per plan.
            const res = await apiFetch(`/api/list?page=booking&&propertyId=${prop?._id}`);
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getBookingsForDate = (day: number) => {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return bookings.filter(booking => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            // Normalize dates to compare without time
            targetDate.setHours(0, 0, 0, 0);
            const cIn = new Date(checkIn); cIn.setHours(0, 0, 0, 0);
            const cOut = new Date(checkOut); cOut.setHours(0, 0, 0, 0);

            return targetDate >= cIn && targetDate <= cOut;
        });
    };

    if (loading && bookings.length === 0) return <CalendarSkeleton />;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium text-gray-500">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-24 md:h-32 bg-gray-50/50 rounded-lg"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayBookings = getBookingsForDate(day);
                    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

                    return (
                        <div key={day} className={`h-24 md:h-32 border rounded-lg p-1 overflow-y-auto custom-scrollbar relative ${isToday ? 'border-green-500 bg-green-50/30' : 'border-gray-100'}`}>
                            <span className={`text-xs font-semibold block mb-1 ${isToday ? 'text-green-600' : 'text-gray-400'}`}>{day}</span>
                            <div className="space-y-1">
                                {dayBookings.map(booking => (
                                    <div key={booking._id} className="text-[10px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate cursor-pointer hover:bg-blue-200 transition" title={`${booking.userId?.firstName} - ${booking.unitId?.name}`}>
                                        {booking.userId?.firstName} ({booking.unitId?.name})
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

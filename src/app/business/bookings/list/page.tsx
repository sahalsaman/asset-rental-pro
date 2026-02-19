"use client";

import { useEffect, useState } from "react";
import { IBooking } from "@/app/types";
import BookingCard from "@/components/BookingCard";
import { apiFetch } from "@/lib/api";
import { CardGridSkeleton } from "@/components/Loader";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

export default function BookingsList() {
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [loader, setLoader] = useState(false);
    const prop = localStorageServiceSelectedOptions.getItem()?.property

    const fetchBookings = () => {
        setLoader(true);
        apiFetch(`/api/list?page=booking&&propertyId=${prop?._id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch bookings");
                return res.json();
            })
            .then(data => setBookings(data))
            .catch(err => console.error("Error fetching bookings:", err))
            .finally(() => setLoader(false));
    };

    useEffect(() => {
        if (prop?._id) fetchBookings();
    }, [prop?._id]);

    if (loader && bookings.length === 0) return <CardGridSkeleton count={3} />;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <BookingCard
                            key={booking._id}
                            booking={booking}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No bookings found.</p>
                )}
            </div>
        </div>
    );
}

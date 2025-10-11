"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {  IBooking } from "@/app/types";
import BookingCard from "../../../components/BookingCard";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

export default function BookingListPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loader, setLoader] = useState(false);
  const prop=localStorageServiceSelectedOptions.getItem()?.property

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
    fetchBookings();
  }, []);

  if (loader) return <FullscreenLoader />;

  return (
    <div className="p-5 md:pt-10 md:px-32 mb-10">
      {/* Room Header */}
      <div className="flex justify-between items-center  mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          {/* <p className="text-gray-600">Capacity: {room.capacity}</p>
          <p className="text-gray-600">Price: ${room.price}</p> */}
        </div>
        {/* <Button onClick={() => setShowBookingModal(true)}>Add Booking</Button> */}
      </div>

      {/* Bookings List */}
      <div>
        {/* <h2 className="text-xl font-semibold mb-3">Bookings</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
              />
            ))
          ) : (
            <p className="text-gray-500">No bookings yet for this room.</p>
          )}
        </div>
      </div>

    
    </div>
  );
}

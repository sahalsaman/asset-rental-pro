"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ISpace, IBooking } from "@/app/types";
import BookingCard from "../properties/[id]/[spaceId]/BookingCard";
import BookingAddEditModal from "../properties/[id]/BookingFormModal";
import BookingDeleteDialog from "../properties/[id]/[spaceId]/BookingDelete";

export default function SpaceDetailPage() {
    const data = useParams();
    
  
  const [bookings, setBookings] = useState<IBooking[]>([]);

  // Booking modals state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState<IBooking | null>(null);
  
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const fetchBookings = () => {
    fetch(`/api/list?page=booking`, { credentials: "include" })
      .then(res => res.json())
      .then(setBookings);
  };

  const handleSaveBooking = async (data: Partial<IBooking>) => {
    const method = editBookingData ? "PUT" : "POST";
    const url = editBookingData
      ? `/api/booking?id=${editBookingData._id}`
      : `/api/booking`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...data,
        // id,
        // spaceId
      }),
    });

    setShowBookingModal(false);
    setEditBookingData(null);
    fetchBookings();
  };

  const handleDeleteBooking = async () => {
    if (!deleteId) return;
    await fetch(`/api/booking?id=${deleteId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setShowDelete(false);
    setDeleteId(null);
    fetchBookings();
  };

    useEffect(() => {
    fetchBookings();
  }, []);

  if (!bookings) return <p className="p-6">Loading booking details...</p>;

  return (
    <div className="pt-10 md:px-32 px-5 mb-10">
      {/* Space Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          {/* <p className="text-gray-600">Capacity: {space.capacity}</p>
          <p className="text-gray-600">Price: ${space.price}</p> */}
        </div>
        <Button onClick={() => setShowBookingModal(true)}>Add Booking</Button>
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
                onEdit={(b) => {
                  setEditBookingData(b);
                  setShowBookingModal(true);
                }}
                onDelete={(id) => {
                  setDeleteId(id);
                  setShowDelete(true);
                }}
              />
            ))
          ) : (
            <p className="text-gray-500">No bookings yet for this space.</p>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingAddEditModal
        open={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setEditBookingData(null);
        }}
        onSave={handleSaveBooking}
        editData={editBookingData}
      />

      {/* Booking Delete Dialog */}
      <BookingDeleteDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteBooking}
      />
    </div>
  );
}

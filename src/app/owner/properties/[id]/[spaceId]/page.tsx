"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ISpace, IBooking } from "@/app/types";
import BookingCard from "./BookingCard";
import BookingAddEditModal from "../BookingFormModal";
import BookingDeleteDialog from "./BookingDelete";

export default function SpaceDetailPage() {
    const data = useParams();
    console.log("Params:", data);
    
  const { id, spaceId } = useParams();
  const router = useRouter();
  
  const [space, setSpace] = useState<ISpace | null>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);

  // Booking modals state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState<IBooking | null>(null);
  
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {

    if (!spaceId || !id) router.push(`/owner/properties/${id}`);
    
    fetch(`/api/space?propertyId=${id}&spaceId=${spaceId}`, { credentials: "include" })
      .then(res => res.json())
      .then(setSpace);

    fetchBookings();
  }, [id, spaceId]);

  const fetchBookings = () => {
    fetch(`/api/booking?propertyId=${id}&spaceId=${spaceId}`, { credentials: "include" })
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
        id,
        spaceId
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

  if (!space) return <p className="p-6">Loading space details...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Space Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{space.name}</h1>
          {/* <p className="text-gray-600">Capacity: {space.capacity}</p>
          <p className="text-gray-600">Price: ${space.price}</p> */}
        </div>
        <Button onClick={() => setShowBookingModal(true)}>Add Booking</Button>
      </div>

      {/* Bookings List */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Bookings</h2>
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

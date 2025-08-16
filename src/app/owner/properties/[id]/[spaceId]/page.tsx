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
        propertyId:id,
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
    <div >
      {/* Space Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 bg-slate-50 p-8  shadow-sm border md:px-32 px-5">
        <div className="flex items-center gap-4">
          {/* Space Image */}
          {space?.images?.length > 0 ? (
            <img
              src={space.images[0]}
              alt={space.name}
              className="w-20 h-20 object-cover rounded-md border"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          {/* Space Info */}
          <div>
            <h1 className="text-2xl font-bold">{space?.name}</h1>
            {space?.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{space.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-2">
              {space?.type && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                  {space.type}
                </span>
              )}
         
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                ₹{space.amount?.toLocaleString()} {space?.rentType && ` / ${space.rentType}`}
              </span>
              {space?.advanceAmount && space?.advanceAmount > 0 ? (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                  Advance: ₹{space.advanceAmount?.toLocaleString()}
                </span>
              ):""}
              {space?.noOfSlots && (
                <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-md text-xs">
                  Slots: {space.noOfSlots}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Booking Button */}
        <Button onClick={() => setShowBookingModal(true)} className="whitespace-nowrap">
          Add Booking
        </Button>
      </div>


      {/* Bookings List */}
      <div className="pt-10 md:px-32 px-5 ">
        <h1 className="text-2xl font-bold mb-5">Bookings</h1>
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

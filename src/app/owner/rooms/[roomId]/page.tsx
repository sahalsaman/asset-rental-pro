"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IRoom, IBooking } from "@/app/types";
import BookingCard from "../../../../components/BookingCard";
import BookingAddEditModal from "../../../../components/BookingFormModal";
import BookingDeleteDialog from "../../../../components/BookingDelete";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { Pencil } from "lucide-react";

export default function RoomDetailPage() {
  const { roomId } = useParams();
  const id = localStorageServiceSelectedOptions.getItem()?.property?._id;
  const router = useRouter();

  const [room, setRoom] = useState<IRoom | null>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);

  // Booking modals state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState<IBooking | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {

    if (!roomId || !id) router.push(`/owner/rooms`);

    apiFetch(`/api/room?propertyId=${id}&roomId=${roomId}`)
      .then(res => res.json())
      .then(setRoom);

    fetchBookings();
  }, [id, roomId]);

  const fetchBookings = () => {
    apiFetch(`/api/booking?propertyId=${id}&roomId=${roomId}`)
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
        propertyId: id,
        roomId
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

  if (!room) return <p className="p-6">Loading room details...</p>;

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Property", href: `/owner/rooms/${id}` },
    { label: room.name || "Room" },
  ];
  function onEdit() {

  }

  return (
    <div >
      {/* Room Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 bg-slate-50 p-8 pt-5 shadow-sm border md:px-32 px-5">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="w-full flex justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-200 rounded-md flex items-center justify-center text-gray-500 text-2xl">
              R
            </div>

            {/* Room Info */}
            <div>
              <h1 className="text-2xl font-bold">Room {room?.name}</h1>
              {/* {room?.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
            )} */}

              <div className="flex flex-wrap items-center gap-3 ">
                {room?.type && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                    {room.type}
                  </span>
                )}

                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                  ₹{room.amount?.toLocaleString()} {room?.frequency && ` / ${room.frequency}`}
                </span>
                {room?.advanceAmount && room?.advanceAmount > 0 ? (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                    Advance: ₹{room.advanceAmount?.toLocaleString()}
                  </span>
                ) : ""}
                {room?.noOfSlots > 1 && (
                  <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-md text-xs">
                    Slots: {room.noOfSlots}
                  </span>
                )}
              </div>
            </div>
          </div>
        <Pencil className="w-4 h-4 mr-1 mt-2" onClick={() => onEdit()} />
        </div>

      </div>


      {/* Bookings List */}
      <div className=" md:px-32 px-5 ">
        <div className="flex justify-between  items-center  mb-5">
          <h1 className="text-2xl font-bold">Bookings</h1>
          {/* Booking Button */}
          <Button onClick={() => setShowBookingModal(true)} className="whitespace-nowrap">
            Add Booking
          </Button>
        </div>
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
            <p className="text-gray-500">No bookings yet for this room.</p>
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
        roomData={room}
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

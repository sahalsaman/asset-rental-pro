"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IRoom, IBooking } from "@/app/types";
import BookingCard from "../../../../components/BookingCard";
import BookingAddEditModal from "../../../../components/BookingFormModal";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { Edit, Pencil, ReceiptIndianRupee, Trash } from "lucide-react";
import RoomAddEditModal from "@/components/RoomFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { FullscreenLoader } from "@/components/Loader";
import { RoomStatus } from "@/utils/contants";

export default function RoomDetailPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<IRoom | null>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState<IBooking | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const current_property = localStorageServiceSelectedOptions.getItem()?.property;


  useEffect(() => {
    if (!roomId || !current_property?._id) router.push(`/owner/rooms`);
    fetchRoom()
    fetchBookings();
  }, [current_property?._id, roomId]);

  const fetchRoom = () => {
    apiFetch(`/api/room?propertyId=${current_property?._id}&roomId=${roomId}`)
      .then(res => res.json())
      .then(setRoom);
  };

  const fetchBookings = () => {
    apiFetch(`/api/booking?propertyId=${current_property?._id}&roomId=${roomId}`)
      .then(res => res.json())
      .then(setBookings);
  };

  if (!room) return <FullscreenLoader />;

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Rooms", href: `/owner/rooms/${roomId}` },
    { label: room.name || "Room" },
  ];


  return (
    <div >
      {/* Room Header */}
      <div className="flex flex-col justify-between items-start  gap-6 mb-6 bg-slate-50 p-8 pt-5 shadow-sm border md:px-32 px-5">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="w-full flex justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-200 rounded-md flex items-center justify-center text-gray-500 text-2xl">
              R
            </div>

            {/* Room Info */}
            <div>
              <h1 className="text-2xl font-bold">{room?.name}</h1>
              {/* {room?.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
            )} */}

              {room?.type && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                  {room.type}
                </span>
              )}
              <div className="flex flex-wrap items-center gap-1 ">

                <p className=" text-xs flex gap-1">
                  <ReceiptIndianRupee size={16} className="text-gray-700" />
                  <span>  {current_property?.currency}{room.amount?.toLocaleString()} {room?.frequency && ` Per ${room.frequency}`}</span>
                </p>
                {room?.advanceAmount && room?.advanceAmount > 0 ? (
                  <span className=" text-xs">
                    Advance: {current_property?.currency}{room.advanceAmount?.toLocaleString()}
                  </span>
                ) : ""}
                {room?.noOfSlots > 1 && (
                  <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-md text-xs">
                    Available Slots: {room.noOfSlots-(room?.currentBooking??0)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={() => { setShowRoomModal(true) }} >
              <Edit className="w-4 h-4" />
            </Button>
            {/* <Trash className="w-4 h-4 text-red-600 mr-1 mt-2" onClick={() => {
              setShowDelete(true);
            }} /> */}
          </div>
        </div>
      </div>
      <div className=" md:px-32 px-5 ">
        <div className="flex justify-between  items-center  mb-5">
          <h1 className="text-2xl font-bold">Bookings</h1>
          {/* Booking Button */}
          {room.status === RoomStatus.AVAILABLE||room.status === RoomStatus.PARTIALLY_BOOKED ? <Button onClick={() => setShowBookingModal(true)} variant="green" className="whitespace-nowrap">
            Add Booking
          </Button> : ""}
        </div>
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

      {/* Add Booking Modal */}
      <BookingAddEditModal
        open={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setEditBookingData(null);
        }}
        onSave={() => {
          setShowBookingModal(false);
          setEditBookingData(null);
           fetchRoom()
    fetchBookings();
        }}
        roomData={room}
      />

      {/* Booking Delete Dialog */}
      <DeleteConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
          setShowDelete(false);
          fetchBookings();
        }}
        item={room}
      />


      {/* Room Modals */}
      <RoomAddEditModal
        property={current_property}
        open={showRoomModal}
        onClose={() => {
          setShowRoomModal(false);
        }}
        onSave={() => {
          setShowRoomModal(false);
          fetchRoom();
        }}
        editData={room}
      />

    </div>
  );
}

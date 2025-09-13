"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IRoom } from "@/app/types";
import BookingAddEditModal from "../../../components/BookingFormModal";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import RoomCard from "@/components/RoomCard";
import RoomAddEditModal from "@/components/RoomFormModal";
import RoomDeleteDialog from "@/components/RoomDeleteConfirmModal";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { Pencil } from "lucide-react";

export default function PropertyDetailPage() {
  const id = localStorageServiceSelectedOptions.getItem()?.property?._id;
  const [property, setProperty] = useState<any>(null);
  const [rooms, setRooms] = useState<IRoom[]>([]);

  // Room modal state
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editRoomData, setEditRoomData] = useState<IRoom | null>(null);

  // Room delete state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);

  useEffect(() => {
    apiFetch(`/api/property?propertyId=${id}`)
      .then(res => res.json())
      .then(setProperty);

    fetchRooms();
  }, [id]);

  const fetchRooms = () => {
    ;
    apiFetch(`/api/room?propertyId=${id}`)
      .then(res => res.json())
      .then(setRooms);
  };

  const handleSaveRoom = async (data: Partial<IRoom>) => {
    const method = editRoomData ? "PUT" : "POST";
    const url = editRoomData ? `/api/room?id=${editRoomData._id}` : `/api/room`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...data, propertyId: id }),
    });

    setShowRoomModal(false);
    setEditRoomData(null);
    fetchRooms();
  };

  const handleDeleteRoom = async () => {
    if (!deleteId) return;
    await fetch(`/api/room?id=${deleteId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setShowDelete(false);
    setDeleteId(null);
    fetchRooms();
  };

  const handleSaveBooking = async (data: any) => {
    const method = editBookingData ? "PUT" : "POST";
    const url = editBookingData ? `/api/booking?id=${editBookingData._id}` : `/api/booking`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...data,
        propertyId: id,
        roomId: selectedRoom?._id,
      }),
    });

    setShowBookingModal(false);
    setEditBookingData(null);
    setSelectedRoom(null);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: property?.name || "Property" },
  ];

  function onEdit() {

  }

  return (
    <div className="">
      {/* Property Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-100 md:p-14 md:px-32 p-5 shadow-sm">


        <Breadcrumbs items={breadcrumbItems} />
        <div className="w-full flex justify-between ">
          <div className="flex items-center gap-4">

            <div className="w-14 h-14 bg-blue-200 rounded-md flex items-center justify-center text-gray-500 text-2xl">
              {property?.name?.charAt(0).toUpperCase()}
            </div>


            {/* Property Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{property?.name}</h1>
              <p className="text-sm text-gray-600">
                {property?.address}, {property?.city}, {property?.state} {property?.zipCode}, {property?.country}
              </p>
              <Badge variant="default">{property?.category}</Badge>
              {/* {property?.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {property.description}
              </p>
            )} */}
            </div>
          </div>
          <Pencil className="w-4 h-4 mr-1 mt-2" onClick={() => onEdit()} />
        </div>

        {/* Add Room Button */}
        <Button onClick={() => setShowRoomModal(true)} className="whitespace-nowrap hidden sm:block">
          Add Room
        </Button>
      </div>
      <div className="p-5 md:pt-10 md:px-32 mb-10">
        <div className="flex justify-between  items-center">
          <h1 className="text-2xl font-bold mb-5">Rooms</h1>
          <Button onClick={() => setShowRoomModal(true)} className="whitespace-nowrap sm:hidden block">
            Add Room
          </Button>
        </div>
        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {rooms.map(room => (
            <RoomCard
              key={room._id}
              room={room}
              property={property}
              onEdit={(room) => {
                setEditRoomData(room);
                setShowRoomModal(true);
              }}
              onDelete={(id) => {
                setDeleteId(id);
                setShowDelete(true);
              }}
              onBook={(room) => {
                setSelectedRoom(room);
                setShowBookingModal(true);
              }}
            />
          ))}
        </div>
      </div>



      {/* Room Modals */}
      <RoomAddEditModal
        property={property}
        open={showRoomModal}
        onClose={() => {
          setShowRoomModal(false);
          setEditRoomData(null);
        }}
        onSave={handleSaveRoom}
        editData={editRoomData}
      />

      <RoomDeleteDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteRoom}
      />

      {/* Booking Modal */}
      <BookingAddEditModal
        open={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setEditBookingData(null);
          setSelectedRoom(null);
        }}
        onSave={handleSaveBooking}
        editData={editBookingData}
        roomData={selectedRoom}
      />
    </div>
  );
}

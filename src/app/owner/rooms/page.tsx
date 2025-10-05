"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IRoom } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import RoomCard from "@/components/RoomCard";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import RoomAddEditModal from "@/components/RoomFormModal";
import  { FullscreenLoader, } from "@/components/Loader";

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
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);


  useEffect(() => {

    fetchProperty()
    fetchRooms();
  }, [id]);

  const fetchProperty = () => {
    apiFetch(`/api/property?propertyId=${id}`)
      .then(res => res.json())
      .then(setProperty);
  }

  const fetchRooms = () => {
    apiFetch(`/api/room?propertyId=${id}`)
      .then(res => res.json())
      .then(setRooms);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: property?.name || "Property" },
  ];

  if (!property) return <FullscreenLoader />;

  return (
    <div className="">
      {/* Property Header */}
      <div className="flex flex-col justify-between items-start md:items-center gap-3 bg-slate-100 md:p-14 md:px-32 p-5 shadow-sm">


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
          <div className="flex gap-2"> 
            {/* <Pencil className="w-4 h-4 mr-1 mt-2" onClick={() => onEdit()} /> */}

            {/* Add Room Button */}
            <Button onClick={() => setShowRoomModal(true)} className="whitespace-nowrap hidden sm:block">
              Add Room
            </Button></div>
        </div>
      </div>
      <div className="p-5 md:pt-10 md:px-32 mb-10">
        <div className="flex justify-between  items-center  mb-5">
          <h1 className="text-2xl font-bold">Rooms</h1>
          <Button onClick={() => setShowRoomModal(true)} className="whitespace-nowrap sm:hidden block">
            Add Room
          </Button>
        </div>
        {/* Rooms Grid */}
              {rooms.length === 0 ? (
        <p className="text-gray-500 text-center">No rooms/space found. <br/>Add a room/space to get started.</p>
      ) : (
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
        </div>)}
      </div>
     <RoomAddEditModal
        property={property}
        open={showRoomModal}
        onClose={() => {
          setShowRoomModal(false);
        }}
        onSave={() => {
          setShowRoomModal(false);
          fetchRooms();
        }}
      />

    </div>
  );
}

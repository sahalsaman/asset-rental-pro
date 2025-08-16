"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ISpace } from "@/app/types";
import SpaceCard from "./SpaceCard";
import SpaceAddEditModal from "./SpaceFormModal";
import SpaceDeleteDialog from "./SpaceDeleteConfirmModal";
import BookingAddEditModal from "./BookingFormModal";
import { Badge } from "@/components/ui/badge";

export default function PropertyDetailPage() {
  const { id } = useParams();

  const [property, setProperty] = useState<any>(null);
  const [spaces, setSpaces] = useState<ISpace[]>([]);

  // Space modal state
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [editSpaceData, setEditSpaceData] = useState<ISpace | null>(null);

  // Space delete state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState<any>(null);
  const [selectedSpace, setSelectedSpace] = useState<ISpace | null>(null);

  useEffect(() => {
    fetch(`/api/property?propertyId=${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(setProperty);

    fetchSpaces();
  }, [id]);

  const fetchSpaces = () => {
    fetch(`/api/space?propertyId=${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(setSpaces);
  };

  const handleSaveSpace = async (data: Partial<ISpace>) => {
    const method = editSpaceData ? "PUT" : "POST";
    const url = editSpaceData ? `/api/space?id=${editSpaceData._id}` : `/api/space`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...data, propertyId: id }),
    });

    setShowSpaceModal(false);
    setEditSpaceData(null);
    fetchSpaces();
  };

  const handleDeleteSpace = async () => {
    if (!deleteId) return;
    await fetch(`/api/space?id=${deleteId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setShowDelete(false);
    setDeleteId(null);
    fetchSpaces();
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
        spaceId: selectedSpace?._id,
      }),
    });

    setShowBookingModal(false);
    setEditBookingData(null);
    setSelectedSpace(null);
  };

  return (
    <div className="">
      {/* Property Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 bg-slate-100 p-14 md:px-32 px-5 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Logo / First Image */}
          {property?.images?.length > 0 ? (
            <img
              src={property.images[0]}
              alt={`${property.name} logo`}
              className="w-20 h-20 object-cover rounded-md border"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              No Logo
            </div>
          )}

          {/* Property Info */}
          <div>
            <h1 className="text-3xl font-bold">{property?.name}</h1>
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

        {/* Add Space Button */}
        <Button onClick={() => setShowSpaceModal(true)} className="whitespace-nowrap">
          Add Space
        </Button>
      </div>
      <div className="pt-10 md:px-32 px-5 mb-10">
        <h1 className="text-2xl font-bold mb-5">Spaces</h1>
        {/* Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spaces.map(space => (
            <SpaceCard
              key={space._id}
              space={space}
              property={property}
              onEdit={(space) => {
                setEditSpaceData(space);
                setShowSpaceModal(true);
              }}
              onDelete={(id) => {
                setDeleteId(id);
                setShowDelete(true);
              }}
              onBook={(space) => {
                setSelectedSpace(space);
                setShowBookingModal(true);
              }}
            />
          ))}
        </div>
      </div>



      {/* Space Modals */}
      <SpaceAddEditModal
      property={property}
        open={showSpaceModal}
        onClose={() => {
          setShowSpaceModal(false);
          setEditSpaceData(null);
        }}
        onSave={handleSaveSpace}
        editData={editSpaceData}
      />

      <SpaceDeleteDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteSpace}
      />

      {/* Booking Modal */}
      <BookingAddEditModal
        open={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setEditBookingData(null);
          setSelectedSpace(null);
        }}
        onSave={handleSaveBooking}
        editData={editBookingData}
      />
    </div>
  );
}

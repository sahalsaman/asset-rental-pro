"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ISpace } from "@/app/types";
import SpaceCard from "./SpaceCard";
import SpaceAddEditModal from "./SpaceFormModal";
import SpaceDeleteDialog from "./SpaceDeleteConfirmModal";
import BookingAddEditModal from "./BookingFormModal";

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
    <div className="p-6">
      {/* Property Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">{property?.name}</h1>
        <Button onClick={() => setShowSpaceModal(true)}>Add Space</Button>
      </div>

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

      {/* Space Modals */}
      <SpaceAddEditModal
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

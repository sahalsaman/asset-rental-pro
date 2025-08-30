"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ISpace } from "@/app/types";
import SpaceCard from "../../../../components/SpaceCard";
import SpaceAddEditModal from "../../../../components/SpaceFormModal";
import SpaceDeleteDialog from "../../../../components/SpaceDeleteConfirmModal";
import BookingAddEditModal from "../../../../components/BookingFormModal";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";

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
    apiFetch(`/api/property?propertyId=${id}`)
      .then(res => res.json())
      .then(setProperty);

    fetchSpaces();
  }, [id]);

  const fetchSpaces = () => {
    apiFetch(`/api/space?propertyId=${id}`)
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

     const breadcrumbItems = [
            { label: "Home", href: "/owner" },
            { label: "Properties", href: "/owner/properties" },
            { label: property?.name || "Property" },
          ];

  return (
    <div className="">
      {/* Property Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-100 md:p-14 md:px-32 p-5 shadow-sm">
         
        
                <Breadcrumbs items={breadcrumbItems}/>
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

        {/* Add Space Button */}
        <Button onClick={() => setShowSpaceModal(true)} className="whitespace-nowrap hidden md:block">
          Add Space
        </Button>
      </div>
      <div className="p-5 md:pt-10 md:px-32 mb-10">
        <div className="flex justify-between  items-center">
          <h1 className="text-2xl font-bold mb-5">Spaces</h1>
          <Button onClick={() => setShowSpaceModal(true)} className="whitespace-nowrap md:hidden block">
            Add Space
          </Button>
        </div>
        {/* Spaces Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
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
        spaceData={selectedSpace}
      />
    </div>
  );
}

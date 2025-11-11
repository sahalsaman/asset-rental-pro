"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IUnit, IBooking } from "@/app/types";
import BookingCard from "../../../../components/BookingCard";
import BookingAddEditModal from "../../../../components/BookingFormModal";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { Edit, Pencil, ReceiptIndianRupee, Trash } from "lucide-react";
import UnitAddEditModal from "@/components/UnitFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { FullscreenLoader } from "@/components/Loader";
import { UnitStatus } from "@/utils/contants";

export default function UnitDetailPage() {
  const { unitId } = useParams();
  const router = useRouter();
  const [unit, setUnit] = useState<IUnit | null>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState<IBooking | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const current_property = localStorageServiceSelectedOptions.getItem()?.property;


  useEffect(() => {
    if (!unitId || !current_property?._id) router.push(`/owner/units`);
    fetchUnit()
    fetchBookings();
  }, [current_property?._id, unitId]);

  const fetchUnit = () => {
    apiFetch(`/api/unit?propertyId=${current_property?._id}&unitId=${unitId}`)
      .then(res => res.json())
      .then(setUnit);
  };

  const fetchBookings = () => {
    apiFetch(`/api/booking?propertyId=${current_property?._id}&unitId=${unitId}`)
      .then(res => res.json())
      .then(setBookings);
  };

  if (!unit) return <FullscreenLoader />;

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Units", href: `/owner/units/${unitId}` },
    { label: unit.name || "Unit" },
  ];


  return (
    <div >
      {/* Unit Header */}
      <div className="flex flex-col justify-between items-start  gap-6 mb-6 bg-slate-50 p-8 pt-5 shadow-sm border md:px-32 px-5">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="w-full flex justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-200 rounded-md flex items-center justify-center text-gray-500 text-2xl">
              R
            </div>

            {/* Unit Info */}
            <div>
              <h1 className="text-2xl font-bold">{unit?.name}</h1>
              {/* {unit?.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{unit.description}</p>
            )} */}

              {unit?.type && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                  {unit.type}
                </span>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2 ">

                <p className=" text-xs flex gap-1">
                  <ReceiptIndianRupee size={16} className="text-gray-700" />
                  <span>  {current_property?.currency}{unit.amount?.toLocaleString()} {unit?.frequency && ` Per ${unit.frequency}`}</span>
                </p>
                {unit?.advanceAmount && unit?.advanceAmount > 0 ? (
                  <p className=" text-xs">
                    Advance: {current_property?.currency}{unit.advanceAmount?.toLocaleString()}
                  </p>
                ) : ""}
                {unit?.noOfSlots > 1 && (
                  <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-md text-xs">
                    Available Slots: {unit.noOfSlots - (unit?.currentBooking ?? 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={() => { setShowUnitModal(true) }} >
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
          {unit.status === UnitStatus.AVAILABLE || unit.status === UnitStatus.PARTIALLY_BOOKED ? <Button onClick={() => setShowBookingModal(true)} variant="green" className="whitespace-nowrap">
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
            <p className="text-gray-500">No bookings yet for this unit.</p>
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
          fetchUnit()
          fetchBookings();
        }}
        unitData={unit}
      />

      {/* Booking Delete Dialog */}
      <DeleteConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
          setShowDelete(false);
          fetchBookings();
        }}
        item={unit}
      />


      {/* Unit Modals */}
      <UnitAddEditModal
        property={current_property}
        open={showUnitModal}
        onClose={() => {
          setShowUnitModal(false);
        }}
        onSave={() => {
          setShowUnitModal(false);
          fetchUnit();
        }}
        editData={unit}
      />

    </div>
  );
}

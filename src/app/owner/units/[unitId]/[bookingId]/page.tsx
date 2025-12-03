"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IBooking, IInvoice } from "@/app/types";
import InvoiceFormModal from "../../../../../components/InvoiceFormModal";
import InvoiceCard from "../../../../../components/InvoiceCard";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { Edit, Pencil, Trash } from "lucide-react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { FullscreenLoader } from "@/components/Loader";
import { statusColorMap } from "@/utils/contants";
import BookingEditModal from "@/components/BookingEditModal";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { unitId } = useParams();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editInvoiceData, setEditInvoiceData] = useState<IInvoice | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const id = localStorageServiceSelectedOptions.getItem()?.property?._id;
  const bookingId = Array.isArray(params?.bookingId)
    ? params.bookingId[0]
    : params?.bookingId;

  useEffect(() => {
    ftechBooking()
    fetchInvoices();

    const prop=localStorageServiceSelectedOptions.getItem().property
    setProperty(prop)
  }, [bookingId]);

  const ftechBooking = () => {
    if (!bookingId) {
      router.push("/owner/bookings");
      return;
    }
    apiFetch(`/api/booking?bookingId=${bookingId}`)
      .then((res) => res.json())
      .then(setBooking);
  };

  const fetchInvoices = () => {
    if (!bookingId) return;
    apiFetch(`/api/invoice?bookingId=${bookingId}`)
      .then((res) => res.json())
      .then(setInvoices);
  };

  if (!booking) return <FullscreenLoader />;

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Unit", href: `/owner/units/${unitId}` },
    { label: booking.userId?.firstName || "Enrolment", },
  ];

  return (
    <div >
      {/* Booking Header */}
      <div className="flex flex-col justify-between items-start  gap-6 mb-6 bg-slate-50 p-8  shadow-sm border md:px-32 px-5 pt-5">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="w-full flex justify-between">
          <div className="flex items-center gap-4">
            {/* Logo (first 2 letters of firstName) */}
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-600 text-white text-3xl font-semibold">

              {booking.userId?.firstName?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold">{booking.userId?.firstName} {booking.userId?.lastName}</h1>
              <p className="text-gray-600">
                {booking.userId?.countryCode} {booking.userId?.phone}
              </p>
              {booking.checkIn && booking.checkOut && (
                <p className="text-gray-500 text-sm">
                  {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
              )}
              {booking.status && (
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${statusColorMap[booking?.status ?? ""] || "bg-gray-100 text-gray-800"
                    }`}
                >
                  {booking.status}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={() => { setShowBookingModal(true) }} >
              <Edit className="w-4 h-4" />
            </Button>
            {/* <Trash className="w-4 h-4 text-red-600 mr-1 mt-2" onClick={() => {
              setShowDelete(true);
            }} /> */}
          </div>
        </div>
      </div>


      {/* Invoice List */}
      <div className=" md:px-32 px-5">
        {/* <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Invoices</h2>
          <Button onClick={() => setShowInvoiceModal(true)}>Add Invoice</Button>
        </div> */}
        <div className="flex flex-col gap-4 mb-10">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <InvoiceCard
                key={invoice._id}
                invoice={invoice}
                onEdit={(i) => {
                  setEditInvoiceData(i);
                  setShowInvoiceModal(true);
                }}
                onDelete={(id) => {
                  setShowDelete(true);
                }}
                property={property}
              />
            ))
          ) : (
            <p className="text-gray-500">No invoices yet for this booking.</p>
          )}
        </div>
      </div>

      {/* Booking Delete Dialog */}
      <DeleteConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
          setShowDelete(false);
          window.location.href = `/owner/units/${unitId}`;
        }}
        item={booking}
        type="booking"
      />


      {/* Invoice Modal */}
      <InvoiceFormModal
        open={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setEditInvoiceData(null);
        }}
        onSave={() => {
          setShowInvoiceModal(false);
          setEditInvoiceData(null);
          fetchInvoices();
        }}
        editData={editInvoiceData}
      />

      <BookingEditModal
        open={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
        }}
        onSave={() => {
          setShowBookingModal(false);
          ftechBooking()
        }}
        editData={booking}
      />
    </div>
  );
}

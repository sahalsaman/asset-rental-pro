"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IBooking, IInvoice } from "@/app/types";
import InvoiceFormModal from "../../../../../../components/InvoiceFormModal";
import InvoiceCard from "../../../../../../components/InvoiceCard";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();

  // Safely extract bookingId

  const { id, spaceId } = useParams();
  const bookingId = Array.isArray(params?.bookingId)
    ? params.bookingId[0]
    : params?.bookingId;

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);

  // Modal states
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editInvoiceData, setEditInvoiceData] = useState<IInvoice | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      router.push("/owner/bookings");
      return;
    }

    apiFetch(`/api/booking?bookingId=${bookingId}`)
      .then((res) => res.json())
      .then(setBooking);

    fetchInvoices();
  }, [bookingId]);

  const fetchInvoices = () => {
    if (!bookingId) return;
    apiFetch(`/api/invoice?bookingId=${bookingId}`)
      .then((res) => res.json())
      .then(setInvoices);
  };

  const handleSaveInvoice = async (data: Partial<IInvoice>) => {
    const method = editInvoiceData ? "PUT" : "POST";
    const url = editInvoiceData
      ? `/api/invoice?id=${editInvoiceData._id}`
      : `/api/invoice`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...data, bookingId }),
    });

    setShowInvoiceModal(false);
    setEditInvoiceData(null);
    fetchInvoices();
  };

  const handleDeleteInvoice = async () => {
    if (!deleteId) return;
    await fetch(`/api/invoice?id=${deleteId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setShowDelete(false);
    setDeleteId(null);
    fetchInvoices();
  };

  if (!booking) return <p className="p-6">Loading booking details...</p>;

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Properties", href: "/owner/properties" },
    { label: "Property", href: `/owner/properties/${id}` },
    { label: "Space", href: `/owner/properties/${id}/${spaceId}` },
    { label: booking.fullName || "Space", },
  ];

  return (
    <div >
      {/* Booking Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 bg-slate-50 p-8  shadow-sm border md:px-32 px-5 pt-5">
        <Breadcrumbs items={breadcrumbItems} />
        <div>
          <div className="flex items-center gap-4">
            {/* Logo (first 2 letters of fullName) */}
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-600 text-white text-3xl font-semibold">

              {booking.fullName?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold">{booking.fullName}</h1>
              <p className="text-gray-600">
                {booking.phone}
              </p>
              {booking.checkIn && booking.checkOut && (
                <p className="text-gray-500 text-sm">
                  {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
              )}
              {booking.status && (
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${booking.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {booking.status}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>


      {/* Invoice List */}
      <div className=" md:px-32 px-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Invoices</h2>
          <Button onClick={() => setShowInvoiceModal(true)}>Add Invoice</Button>
        </div>
        <div className="space-y-3">
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
                  setDeleteId(id);
                  setShowDelete(true);
                }}
              />
            ))
          ) : (
            <p className="text-gray-500">No invoices yet for this booking.</p>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceFormModal
        open={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setEditInvoiceData(null);
        }}
        onSave={handleSaveInvoice}
        editData={editInvoiceData}
      />
    </div>
  );
}

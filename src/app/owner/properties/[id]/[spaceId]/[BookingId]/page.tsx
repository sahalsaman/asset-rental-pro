"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IBooking, IInvoice } from "@/app/types";
import InvoiceFormModal from "./InvoiceFormModal";
import InvoiceCard from "./InvoiceCard";

export default function BookingDetailPage() {
  const { bookingId } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);

  // Modal states
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editInvoiceData, setEditInvoiceData] = useState<IInvoice | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return router.push("/owner/bookings");

    fetch(`/api/booking/${bookingId}`, { credentials: "include" })
      .then(res => res.json())
      .then(setBooking);

    fetchInvoices();
  }, [bookingId]);

  const fetchInvoices = () => {
    fetch(`/api/invoice?bookingId=${bookingId}`, { credentials: "include" })
      .then(res => res.json())
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

  return (
    <div className="p-6 space-y-6">
      {/* Booking Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Booking #{booking._id}</h1>
          <p className="text-gray-600">
            {booking.fullName} — {booking.phone}
          </p>
          <p className="text-gray-600">
            {/* {new Date(booking?.checkIn).toLocaleDateString()} →{" "}
            {new Date(booking?.checkOut).toLocaleDateString()} */}
          </p>
        </div>
        <Button onClick={() => setShowInvoiceModal(true)}>Add Invoice</Button>
      </div>

      {/* Invoice List */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Invoices</h2>
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

      {/* Delete Dialog */}
      {/* <InvoiceDeleteDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteInvoice}
      /> */}
    </div>
  );
}

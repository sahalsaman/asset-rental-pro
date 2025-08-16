"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ISpace, IInvoice } from "@/app/types";
import InvoiceCard from "../properties/[id]/[spaceId]/[bookingId]/InvoiceCard";
import InvoiceFormModal from "../properties/[id]/[spaceId]/[bookingId]/InvoiceFormModal";

export default function SpaceDetailPage() {
    const data = useParams();
    
  
  const [invoices, setInvoices] = useState<IInvoice[]>([]);

  // Invoice modals state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editInvoiceData, setEditInvoiceData] = useState<IInvoice | null>(null);
  
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const fetchInvoices = () => {
    fetch(`/api/list?page=invoice`, { credentials: "include" })
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
      body: JSON.stringify({
        ...data,
        // id,
        // spaceId
      }),
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

    useEffect(() => {
    fetchInvoices();
  }, []);

  if (!invoices) return <p className="p-6">Loading invoice details...</p>;

  return (
    <div className="pt-10 md:px-32 px-5 mb-10">
      {/* Space Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          {/* <p className="text-gray-600">Capacity: {space.capacity}</p>
          <p className="text-gray-600">Price: ${space.price}</p> */}
        </div>
        <Button onClick={() => setShowInvoiceModal(true)}>Add Invoice</Button>
      </div>

      {/* Invoices List */}
      <div>
        {/* <h2 className="text-xl font-semibold mb-3">Invoices</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <InvoiceCard
                key={invoice._id}
                invoice={invoice}
                onEdit={(b) => {
                  setEditInvoiceData(b);
                  setShowInvoiceModal(true);
                }}
                onDelete={(id) => {
                  setDeleteId(id);
                  setShowDelete(true);
                }}
              />
            ))
          ) : (
            <p className="text-gray-500">No invoices yet for this space.</p>
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

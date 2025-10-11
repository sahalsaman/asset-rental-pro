"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IInvoice } from "@/app/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InvoiceFormModal from "../../../components/InvoiceFormModal";
import { apiFetch } from "@/lib/api";
import InvoiceCard from "@/components/InvoiceCard";
import { FullscreenLoader } from "@/components/Loader";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

export default function RoomDetailPage() {
  const data = useParams();
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editInvoiceData, setEditInvoiceData] = useState<IInvoice | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);
  const property = localStorageServiceSelectedOptions.getItem()?.property;

  const fetchInvoices = () => {
    setLoader(true);
    apiFetch(`/api/list?page=invoice&&propertyId=${property?._id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch invoices");
        return res.json();
      })
      .then(data => setInvoices(data))
      .catch(err => console.error("Error fetching invoices:", err))
      .finally(() => setLoader(false));
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

  if (loader) return <FullscreenLoader />;

  return (
    <div className="p-5 md:pt-10 md:px-32 mb-10">
      {/* Room Header */}
      <div className="flex justify-between items-center  mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          {/* <p className="text-gray-600">Capacity: {room.capacity}</p>
          <p className="text-gray-600">Price: ${room.price}</p> */}
        </div>
        {/* <Button onClick={() => setShowInvoiceModal(true)}>Add Invoice</Button> */}
      </div>

      {/* Invoice List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <InvoiceCard
              key={invoice._id}
              invoice={invoice}
              property={property}
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


    </div>
  );
}

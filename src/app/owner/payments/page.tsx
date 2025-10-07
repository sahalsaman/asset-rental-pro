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
import PaymentCard from "@/components/PaymentCard";

export default function RoomDetailPage() {

  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [property, setProperty] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editInvoiceData, setEditInvoiceData] = useState<IInvoice | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);

  const fetchInvoices = () => {
    setLoader(true);
    apiFetch("/api/list?page=invoice&&payments=true")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch invoices");
        return res.json();
      })
      .then(data => setInvoices(data))
      .catch(err => console.error("Error fetching invoices:", err))
      .finally(() => setLoader(false));
  };

  const fetchProperty = () => {
    const id = localStorageServiceSelectedOptions.getItem()?.property?._id;
    apiFetch(`/api/property?propertyId=${id}`)
      .then(res => res.json())
      .then(setProperty);
  }

  useEffect(() => {
    fetchInvoices();
    fetchProperty()
  }, []);

  if (loader) return <FullscreenLoader />;

  return (
    <div className="p-5 md:pt-10 md:px-32 mb-10">
      {/* Room Header */}
      <div className="flex justify-between items-center  mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <PaymentCard
              key={invoice._id}
              invoice={invoice}
              property={property}
            />
          ))
        ) : (
          <p className="text-gray-500">No invoices yet for this booking.</p>
        )}
      </div>
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

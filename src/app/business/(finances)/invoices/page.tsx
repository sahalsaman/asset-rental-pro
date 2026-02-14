"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ReceiptIndianRupee,
    NotepadTextDashed,
    TrendingDown,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    TrendingUp,
    CreditCard,
    Plus,
    Search,
    Filter,
    Trash2,
    Edit,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { DashboardSkeleton, TableSkeleton, CardGridSkeleton } from "@/components/Loader";
import { InvoiceStatus } from "@/utils/contants";
import { IInvoice } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InvoiceFormModal from "@/components/InvoiceFormModal";
import InvoiceCard from "@/components/InvoiceCard";
import { toast } from "react-hot-toast";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

export default function InvoicesPage() {
    const property = localStorageServiceSelectedOptions.getItem()?.property;
    const [invoices, setInvoices] = useState<IInvoice[]>([]);
    const [loader, setLoader] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [editInvoiceData, setEditInvoiceData] = useState<IInvoice | null>(null);

    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchInvoices = (status: string) => {
        setLoader(true);
        apiFetch(`/api/list?page=invoice&&propertyId=${property?._id}${status ? '&&status=' + status : ''}`)
            .then(res => res.json())
            .then(data => setInvoices(data))
            .catch(err => console.error("Error fetching invoices:", err))
            .finally(() => setLoader(false));
    };

    const handleDeleteInvoice = async () => {
        if (!deleteId) return;
        try {
            await apiFetch(`/api/invoice?id=${deleteId}`, {
                method: "DELETE",
            });
            setShowDelete(false);
            setDeleteId(null);
            toast.success("Invoice deleted successfully");
            fetchInvoices(selectedFilter);
        } catch (err) {
            toast.error("Failed to delete invoice");
        }
    };

    useEffect(() => {
        if (property?._id) fetchInvoices("");
    }, [property?._id]);

    if (loader && invoices.length === 0) return <CardGridSkeleton count={3} />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-lg font-bold text-gray-900">Invoice History</h2>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    {[
                        { label: "All", value: "" },
                        { label: "Paid", value: InvoiceStatus.PAID },
                        { label: "Pending", value: InvoiceStatus.PENDING },
                    ].map((item) => (
                        <button
                            key={item.value || "all"}
                            onClick={() => {
                                setSelectedFilter(item.value);
                                fetchInvoices(item.value);
                            }}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${selectedFilter === item.value
                                ? "bg-white text-green-700 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="col-span-full h-60 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400">
                        <NotepadTextDashed size={48} className="mb-4 opacity-20" />
                        <p>No invoices found matching your criteria.</p>
                    </div>
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
                    fetchInvoices(selectedFilter);
                }}
                editData={editInvoiceData}
            />

            <Dialog open={showDelete} onOpenChange={setShowDelete}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Invoice</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-gray-500">Are you sure you want to delete this invoice? This action cannot be undone.</p>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setShowDelete(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteInvoice}>Delete Invoice</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
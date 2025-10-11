"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import DeleteConfirmModal from "@/components/DeleteConfirmModal"
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import BankFormModal from "@/components/BankFormModal";
import { Edit } from "lucide-react";

export default function BanksPage() {
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState<any | null>(null);
    const [addEditOpen, setAddEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const fetchBanks = async () => {
        const res = await apiFetch("/api/banks");
        const data = await res.json();
        setBanks(data);
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    if (!banks) return <FullscreenLoader />;

    return (
        <div className="p-5 md:pt-10 md:px-32 mb-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Bank & UPI Details</h1>
                <Button
                    onClick={() => {
                        setAddEditOpen(true);
                        setSelectedBank(null);
                    }}
                    variant="green"
                >
                    Add Bank / UPI
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banks.length ? (
                    banks.map((bank: any) => (
                        <div
                            key={bank._id}
                            className="border p-4 rounded-xl shadow-sm bg-white"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="font-semibold text-lg mb-1">
                                    {bank.paymentRecieverOption || "UPI"}{" "}

                                </h2>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedBank(bank);
                                        setAddEditOpen(true);
                                    }}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </div>
                            {bank.accountHolderName && (
                                <p className="text-gray-600 text-sm"><b>Holder Name:</b> {bank.accountHolderName}</p>
                            )}
                            {bank.accountNo && (
                                <p className="text-gray-600 text-sm">
                                    <b> A/C No: </b>{bank.accountNo}
                                </p>
                            )}
                            {bank.ifsc && (
                                <p className="text-gray-600 text-sm"><b>IFSC: </b>{bank.ifsc}</p>
                            )}
                            {bank.upiId && (
                                <p className="text-gray-600 text-sm"><b>UPI:</b> {bank.upiId}</p>
                            )}

                            <div className="flex gap-3 mt-3">

                                {/* <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSelectedBank(bank);
                    setDeleteOpen(true);
                  }}
                >
                  Delete
                </Button> */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No bank/UPI details found.</p>
                )}
            </div>

            <BankFormModal
                open={addEditOpen}
                onClose={() => setAddEditOpen(false)}
                onSave={() => {
                    setAddEditOpen(false);
                    fetchBanks();
                }}
                initialData={selectedBank}
            />

            <DeleteConfirmModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={fetchBanks}
                item={selectedBank}
            />
        </div>
    );
}

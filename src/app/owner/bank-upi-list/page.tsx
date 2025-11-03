"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import BankFormModal from "@/components/BankFormModal";
import { Edit } from "lucide-react";
import { PaymentRecieverOptions } from "@/utils/contants";

interface Bank {
  _id: string;
  paymentRecieverOption: string;
  accountHolderName?: string;
  value?: string;
  ifsc?: string;
  upiPhoneCountryCode?: string;
}

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [qrImages, setQrImages] = useState<Record<string, string>>({}); // key: bank._id, value: QR base64

  const fetchBanks = async () => {
    const res = await apiFetch("/api/banks");
    const data: Bank[] = await res.json();
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
          banks.map((bank) => (
            <div key={bank._id} className="border p-4 rounded-xl shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg mb-1">
                  {bank.paymentRecieverOption || "UPI"}
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
                <p className="text-gray-600 text-sm">
                  <b>Holder Name:</b> {bank.accountHolderName}
                </p>
              )}

              {bank.value && (
                <p className="text-gray-600 text-sm">
                  <b>
                    {bank.paymentRecieverOption === PaymentRecieverOptions.BANK
                      ? "A/C No"
                      : bank.paymentRecieverOption === PaymentRecieverOptions.UPIPHONE
                      ? "UPI Phone"
                      : bank.paymentRecieverOption === PaymentRecieverOptions.UPIQR
                      ? "UPI QR"
                      : "UPI ID"}
                    :
                  </b>{" "}
                  {bank.paymentRecieverOption === PaymentRecieverOptions.UPIPHONE
                    ? bank?.upiPhoneCountryCode
                    : ""}{" "}
                  {bank.paymentRecieverOption != PaymentRecieverOptions.UPIQR?bank.value:""}
                </p>
              )}

              {/* Generate QR Code dynamically for UPI QR */}
              {bank.paymentRecieverOption === PaymentRecieverOptions.UPIQR && (
                <div className="mt-2 flex flex-col items-center">
                  <img
                    src={bank.value}
                    alt="Generated QR Code"
                    className="w-40 h-40 object-contain "
                  />
                </div>
              )}

              {bank.ifsc && (
                <p className="text-gray-600 text-sm">
                  <b>IFSC:</b> {bank.ifsc}
                </p>
              )}
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

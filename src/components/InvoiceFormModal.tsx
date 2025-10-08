"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { IInvoice } from "@/app/types";
import { Label } from "@radix-ui/react-label";
import { InvoiceStatus, RentAmountType, TransactionType } from "@/utils/contants";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editData?: IInvoice | null;
}

export default function InvoiceFormModal({ open, onClose, onSave, editData }: Props) {
  const [formData, setFormData] = useState<Partial<IInvoice>>({});

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        disabled: false,
        status: InvoiceStatus.PENDING,
        type: RentAmountType.RENT,
        transactionType: TransactionType.INHAND,
        recivedDate:new Date()
      });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveInvoice(formData);
  };

  const handleSaveInvoice = async (data: Partial<IInvoice>) => {
    const method = editData ? "PUT" : "POST";
    const url = editData
      ? `/api/invoice?id=${editData._id}`
      : `/api/invoice`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...data, bookingId: editData?.bookingId }),
    });

    onSave()
  };


  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Invoice" : "Add Invoice"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Label>Amount</Label>
          <Input
            name="amount"
            type="number"
            placeholder="Amount"
            value={formData.amount || ""}
            onChange={handleChange}
            required
          />

          {/* <Label>Amount Type</Label>
          <select name="type" value={formData.type || "Rent"} onChange={handleChange} required
            className="w-full border border-gray-300 rounded px-3 py-2">
            {Object.values(RentAmountType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select> */}

          <Label>Transaction type</Label>
          <select
            name="transactionType"
            value={formData.transactionType || "online"}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {Object.values(TransactionType).map((transactionType) => (
              <option key={transactionType} value={transactionType}>
                {transactionType}
              </option>
            ))}
          </select>

          <Label>Transaction Id</Label>
          <Input
            name="transactionId"
            placeholder="Transaction Id"
            value={formData.transactionId || ""}
            onChange={handleChange}
          />

          <Label>Payment Status</Label>
          <select name="status" value={formData.status || "unpaid"} onChange={handleChange} required
            className="w-full border border-gray-300 rounded px-3 py-2">
            {Object.values(InvoiceStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div>
            <Label>Recived date</Label>
            <Input
              name="recivedDate"
              type="date"
              value={formData.recivedDate ? formData.recivedDate.toString().split("T")[0] : ""}
              onChange={handleChange}
            /></div>

          <div>
            <Label>Due date</Label>
            <Input
              name="dueDate"
              type="date"
              value={formData.dueDate ? formData.dueDate.toString().split("T")[0] : ""}
              onChange={handleChange}
            /></div>

          <div className="w-full grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button> <Button type="submit" className='w-full' variant="green">
              {editData ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

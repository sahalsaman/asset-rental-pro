"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { IInvoice } from "@/app/types";

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
        status: "unpaid",
        type: "Rent",
        transactionType: "online",
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
      body: JSON.stringify({ ...data, bookingId:editData?.bookingId }),
    });

   onSave()
  };


  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Invoice" : "Add Invoice"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            name="amount"
            type="number"
            placeholder="Amount"
            value={formData.amount || ""}
            onChange={handleChange}
            required
          />

          <select name="type" value={formData.type || "Rent"} onChange={handleChange} required>
            <option value="Advance">Advance</option>
            <option value="Rent">Rent</option>
          </select>

          <select
            name="transactionType"
            value={formData.transactionType || "online"}
            onChange={handleChange}
            required
          >
            <option value="online">Online</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <Input
            name="transactionId"
            placeholder="Transaction ID"
            value={formData.transactionId || ""}
            onChange={handleChange}
          />

          <select name="status" value={formData.status || "unpaid"} onChange={handleChange} required>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="failed">Failed</option>
          </select>

          <div>    <label className="text-sm font-medium">Received Date</label>
            <Input
              name="recivedDate"
              type="date"
              value={formData.recivedDate ? formData.recivedDate.toString().split("T")[0] : ""}
              onChange={handleChange}
            /></div>

          <div>    <label className="text-sm font-medium ">Due Date</label>
            <Input
              name="dueDate"
              type="date"
              value={formData.dueDate ? formData.dueDate.toString().split("T")[0] : ""}
              onChange={handleChange}
            /></div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="disabled"
              checked={formData.disabled || false}
              onChange={(e) => setFormData((prev) => ({ ...prev, disabled: e.target.checked }))}
            />
            <label>Disabled</label>
          </div>

          <Button type="submit">{editData ? "Update Invoice" : "Save Invoice"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

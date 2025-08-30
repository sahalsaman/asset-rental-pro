"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { IBooking, ISpace } from "@/app/types";



interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<IBooking>) => void;
  editData?: IBooking | null;
  spaceData?: ISpace | null;
}

export default function BookingAddEditModal({ open, onClose, onSave, editData,spaceData }: Props) {
  const [formData, setFormData] = useState<Partial<IBooking>>({
    fullName: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    vericationIdCard: "",
    vericationIdCardNumber: "",
    checkIn: "",
    checkOut: "",
    amount: spaceData?.amount || 0,
    advanceAmount: spaceData?.advanceAmount || 0,
  });
console.log("spaceData",spaceData);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({});
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" || name === "advanceAmount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Booking" : "Add Booking"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input name="fullName" placeholder="Full Name" value={formData.fullName || ""} onChange={handleChange} required />
          <Input name="phone" placeholder="Phone" value={formData.phone || ""} onChange={handleChange} required />
          <Input name="whatsappNumber" placeholder="Whatsapp Number" value={formData.whatsappNumber || ""} onChange={handleChange} required />
          <Input name="address" placeholder="Address" value={formData.address || ""} onChange={handleChange} required />

          <Input name="vericationIdCard" placeholder="Verification ID Type" value={formData.vericationIdCard || ""} onChange={handleChange} />
          <Input name="vericationIdCardNumber" placeholder="Verification ID Number" value={formData.vericationIdCardNumber || ""} onChange={handleChange} />

          <Input name="checkIn" type="date" value={formData.checkIn ? formData.checkIn.split("T")[0] : ""} onChange={handleChange} required />
          <Input name="checkOut" type="date" value={formData.checkOut ? formData.checkOut.split("T")[0] : ""} onChange={handleChange}  />

          <Input name="amount" type="number" placeholder="Rent Amount" value={formData.amount || ""} onChange={handleChange} required />
          <Input name="advanceAmount" type="number" placeholder="Advance Amount" value={formData.advanceAmount || ""} onChange={handleChange} />

          <Button type="submit">{editData ? "Update Booking" : "Save Booking"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

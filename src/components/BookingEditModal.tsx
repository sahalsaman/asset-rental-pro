"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { IBooking, IProperty, IUnit } from "@/app/types";
import { Label } from "@radix-ui/react-label";
import { BookingStatus, UnitStatus } from "@/utils/contants";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { countryCodes, defaultData } from "@/utils/data";



interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<IBooking>) => void;
  editData?: IBooking | null;
  unitData?: IUnit | null;
  property_data?: IProperty
}

export default function BookingEditModal({ open, onClose, onSave, editData, unitData, property_data }: Props) {
  const property = property_data ? property_data : localStorageServiceSelectedOptions.getItem()?.property;
  const [formData, setFormData] = useState<Partial<IBooking>>({
    unitId: unitData ? unitData?._id : "",
    propertyId: property?._id || "",
    checkIn: "",
    checkOut: "",
    amount: unitData ? unitData?.amount : 0,
    advanceAmount: unitData ? unitData?.advanceAmount : 0,
    status: BookingStatus.CHECKED_IN,
  });
  const [units, setUnits] = useState<IUnit[]>([]);

  const fetchUnits = () => {
    apiFetch(`/api/unit?propertyId=${property?._id}`)
      .then(res => res.json())
      .then(setUnits);
  };

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      if (!unitData) fetchUnits();
      setFormData((prev) => ({
        ...prev,
        unitId: unitData?._id || "",
        amount: unitData?.amount || 0,
        advanceAmount: unitData?.advanceAmount || 0,
        propertyId: property?._id || "",
      }));
    }
  }, [editData, unitData]);

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleChange(e)
    const { name, value } = e.target;
    unitData = units.find(i => i._id === value)
    setFormData((prev) => ({
      ...prev,
      unitId: unitData?._id || "",
      amount: unitData?.amount || 0,
      advanceAmount: unitData?.advanceAmount || 0,
      propertyId: property?._id || "",
    }));

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" || name === "advanceAmount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveBooking(formData);
  };

  const handleSaveBooking = async (data: any) => {

    try {
      const res = await fetch(`/api/booking?id=${editData?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          unitId: unitData ? unitData._id : data?.unitId,
          propertyId: property?._id,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.error || "Failed to save booking");
        return;
      }

      toast.success(editData ? "Booking updated successfully" : "Booking added successfully");
      onSave(result);
    } catch (err) {
      console.error("Error saving booking:", err);
      toast.error("An error occurred. Please try again.");
    }
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto overscroll-contain p-6">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Booking" : "Add Booking"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-auto">
          {/* Full Name */}
          {!unitData && !editData && <div>
            <Label htmlFor="unitId">Unit*</Label>
            <select
              id="unitId"
              name="unitId"
              value={formData.unitId as string || ""}
              onChange={handleUnitChange}
              className="w-full h-12 border border-gray-300 rounded px-3 py-2"
              required={!unitData ? true : false}
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (unit.status === UnitStatus.AVAILABLE &&
                <option key={unit._id} value={unit._id}>
                  {unit.name} - {property?.currency}{unit.amount}
                </option>))}
            </select>
          </div>}

          {/* Check-in */}
          <div>
            <Label htmlFor="checkIn">Check-In Date*</Label>
            <Input
              id="checkIn"
              name="checkIn"
              type="date"
              value={
                formData.checkIn
                  ? (typeof formData.checkIn === "string"
                    ? formData.checkIn
                    : formData.checkIn.toISOString()
                  ).split("T")[0]
                  : ""
              }
              onChange={handleChange}
              required
            />

          </div>

          {/* Check-out */}
          <div>
            <Label htmlFor="checkOut">Check-Out Date</Label>
            <Input
              id="checkOut"
              name="checkOut"
              type="date"
              value={
                formData.checkOut
                  ? (typeof formData.checkOut === "string"
                    ? formData.checkOut
                    : formData.checkOut.toISOString()
                  ).split("T")[0]
                  : ""
              }
              onChange={handleChange}
            />

          </div>

          {/* Rent Amount */}
          <div>
            <Label htmlFor="amount">Rent Amount*</Label>
            <div className="flex items-center gap-1">
              {property?.currency}
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Rent Amount"
                value={formData.amount || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Advance Amount */}
          <div>
            <Label htmlFor="advanceAmount">Advance Amount</Label>
            <div className="flex items-center gap-1">
              {property?.currency}
              <Input
                id="advanceAmount"
                name="advanceAmount"
                type="number"
                placeholder="Advance Amount"
                value={formData.advanceAmount || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Booking Status*</Label>
            <select
              id="status"
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              className="w-full h-12 border border-gray-300 rounded px-3 py-2"
              required
              disabled={editData?.status === BookingStatus.CHECKED_OUT}
            >
              <option value="">Select unit status</option>
              {Object.values(BookingStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="w-full grid grid-cols-2 gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="w-full" variant="green" disabled={editData?.status === BookingStatus.CHECKED_OUT}>
              {editData ? "Update" : "Submit"}
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
}
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

export default function CheckoutModal({ open, onClose, onSave, editData, unitData, property_data }: Props) {
  const property = property_data ? property_data : localStorageServiceSelectedOptions.getItem()?.property;
  const [formData, setFormData] = useState<Partial<any>>({
    unitId: unitData ? unitData?._id : "",
    propertyId: property?._id || "",
    countryCodes: defaultData.countryCodes,
    phone: "",
    checkIn: "",
    checkOut: "",
    status: BookingStatus.CHECKED_OUT,
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
      propertyId: property?._id || "",
    }));

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveBooking(formData);
  };

  const handleSaveBooking = async (data: any) => {
    const url = editData ? `/api/booking?id=${editData._id}` : `/api/booking`;

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...data,
        unitId: unitData ? unitData?._id : data?.unitId,
        propertyId: property?._id,
        status: BookingStatus.CHECKED_OUT
      }),
    });
    toast.success("Successfully saved booking");
    onSave(data);
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
            <Label htmlFor="unitId">Unit</Label>
            <select
              id="unitId"
              name="unitId"
              value={formData.unitId as string || ""}
              onChange={handleUnitChange}
              className="h-12 w-full border border-gray-300 rounded px-3 py-2"
              required={!unitData ? true : false}
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (unit.status === UnitStatus.AVAILABLE &&
                <option key={unit._id} value={unit._id}>
                  {unit.name} - {property?.currency}{unit.amount}
                </option>))}
            </select>
          </div>}

          {/* WhatsApp Number */}
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <div className="flex items-center gap-2">
              <select
                name="whatsappCountryCode" // ✅ added
                value={formData.whatsappCountryCode || ""}
                onChange={handleChange}
                className="h-12 w-20 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                style={{ maxWidth: '80px' }}
              >
                {countryCodes.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code}
                  </option>
                ))}
              </select>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                placeholder="WhatsApp Number"
                value={formData.whatsappNumber || ""}
                onChange={handleChange}
                required
                maxLength={10}
              />
            </div>
          </div>


          {/* Check-in */}
          <div>
            <Label htmlFor="checkIn">Check-In Date</Label>
            <Input
              id="checkIn"
              name="checkIn"
              type="date"
              disabled
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

          {/* Buttons */}
          <div className="w-full grid grid-cols-2 gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="w-full" variant="green">
              Check out
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IProperty, ISpace } from "@/app/types";
import { useState, useEffect } from "react";
import { FLAT_TYPES, RentDuration } from "@/utils/contants";

interface Props {
  property: IProperty | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<ISpace>) => void;
  editData?: ISpace | null;
}


export default function SpaceAddEditModal({ property, open, onClose, onSave, editData }: Props) {
  const [formData, setFormData] = useState<Partial<ISpace>>({});

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({});
    }
  }, [editData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'advanceAmount' || name === 'noOfSlots' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isHostelOrPG = property?.category?.toLowerCase().includes("hostel") || property?.category?.toLowerCase().includes("pg")|| property?.category?.toLowerCase().includes("Co-Working");
  const isFlatOrApartment = property?.category?.toLowerCase().includes("flat") || property?.category?.toLowerCase().includes("apartment")|| property?.category?.toLowerCase().includes("house");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Space" : "Add Space"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          <Input
            name="name"
            placeholder="Space Name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />

          <Input
            name="description"
            placeholder="Description"
            value={formData.description || ""}
            onChange={handleChange}
          />

          <div className="flex gap-2">
            <Input
              name="amount"
              type="number"
              placeholder="Price"
              value={formData.amount || ""}
              onChange={handleChange}
              required
            />
            <select
              name="rentType"
              value={formData.rentType || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select Rent Duration</option>
              {Object.values(RentDuration).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {isFlatOrApartment && (
            <select
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select Flat Type</option>
              {FLAT_TYPES.map(flat => (
                <option key={flat} value={flat}>
                  {flat}
                </option>
              ))}
            </select>
          )}

          {isHostelOrPG && (
            <Input
              name="noOfSlots"
              type="number"
              placeholder="Number of Slots"
              value={formData.noOfSlots || ""}
              onChange={handleChange}
              required
            />
          )}

          <Input
            name="advanceAmount"
            type="number"
            placeholder="Advance Amount"
            value={formData.advanceAmount || ""}
            onChange={handleChange}
          />

          <Button type="submit">{editData ? "Update" : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

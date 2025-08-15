"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ISpace } from "@/app/types";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<ISpace>) => void;
  editData?: ISpace | null;
}

export default function SpaceAddEditModal({ open, onClose, onSave, editData }: Props) {
  const [formData, setFormData] = useState<Partial<ISpace>>({});

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({});
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Space" : "Add Space"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input name="name" placeholder="Space Name" value={formData.name || ""} onChange={handleChange} required />
          <Input name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange} />
          <Input name="amount" type="number" placeholder="Price" value={formData.amount || ""} onChange={handleChange} required />
          <Input name="type" placeholder="Type (e.g. 2BHK or 2 Share)" value={formData.type || ""} onChange={handleChange} required />
          <Input name="noOfSlots" type="number" placeholder="Price" value={formData.noOfSlots || ""} onChange={handleChange} required />
          <Button type="submit">{editData ? "Update" : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

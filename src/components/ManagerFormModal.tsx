"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import MultiSelect from "./ui/multiselect";

export default function ManagerFormModal({ open, onClose, onSave, editData }: any) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    properties: [] as string[],
  });

  const [properties, setProperties] = useState<any[]>([]);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/property");
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        firstName: editData.firstName || "",
        lastName: editData.lastName || "",
        phone: editData.phone || "",
        properties: editData.properties || [],
      });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePropertiesChange = (selected: string[]) => {
    setFormData({ ...formData, properties: selected });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Manager" : "Add Manager"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <MultiSelect
            placeholder="Select Properties"
            options={properties.map((p: any) => ({ label: p.name, value: p._id }))}
            value={formData.properties}
            onChange={handlePropertiesChange}
          />

          <Button type="submit">{editData ? "Update" : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

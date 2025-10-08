"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import MultiSelect from "./ui/multiselect";
import { Label } from "./ui/label";
import { countryCodes } from "@/utils/mock-data";

export default function ManagerFormModal({ open, onClose, onSave, editData }: any) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+91",
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
        countryCode: editData.countryCode || "",
        phone: editData.phone || "",
        properties: editData.properties?.map((p: any) => p.name) || [],
      });
    }
  }, [editData]);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePropertiesChange = (selected: string[]) => {
    setFormData({ ...formData, properties: selected });
  };

  const handleSubmit = (e: React.FormEvent) => {
    formData.properties = properties.filter(p => formData.properties.includes(p.name)).map(p => p._id)
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
          <div>
            <Label htmlFor="fullName">First Name</Label>
            <Input
              className="mt-1"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              className="mt-1"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex items-center gap-2">
              <select
                name="countryCode" // ✅ added
                value={formData.countryCode || ""}
                onChange={handleChange}
                className="w-20 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                style={{ maxWidth: '80px' }}
              >
                {countryCodes.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code}
                  </option>
                ))}
              </select>
              <Input
                className="mt-1"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength={10}
              />
            </div>
          </div>
          <div>
            <Label className="mb-1" htmlFor="properties">Select Properties</Label>
            <MultiSelect
              placeholder="Select Properties"
              options={properties.map((p: any) => ({ label: p.name, value: p.name }))}
              value={formData.properties}
              onChange={handlePropertiesChange}
            />
          </div>
          <Button type="submit" variant="green">{editData ? "Update" : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { IProperty } from '@/app/types';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // fixed "Inut" typo
import { Label } from '@radix-ui/react-label';
import { CurrencyType, PropertyStatus, PropertyType } from '@/utils/contants';

interface PropertyFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: IProperty | null;
}

export default function PropertyFormModal({
  open,
  onClose,
  initialData,
  onSave
}: PropertyFormModalProps) {
  const [formData, setFormData] = useState<IProperty>({
    name: '',
    description: '',
    address: '',
    city: '',
    category: 'Room',
    status: PropertyStatus.ACTIVE,
    state: "",
    country: '',
    zipCode: '',
    images: [],
    currency: "₹",
    disabled: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(prev => ({
        ...prev,
        name: '',
        address: '',
        city: '',
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(formData);
  };

  const handleSave = async (formData: any) => {
    if (initialData?._id) {
      await fetch(`/api/property?id=${initialData?._id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      onSave()
    } else {
      await fetch("/api/property", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      onSave()
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add'} Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Property name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Property name"
            required
          />
          <Label>Description</Label>
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <Label>Address</Label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
          <Label>State</Label>
          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            required
          />
          <Label>City</Label>
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />

          <Label>Status</Label>
          <select
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select a status</option>
            {Object.values(PropertyStatus).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>


          <Label>Category</Label>
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select a category</option>
            {Object.values(PropertyType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <Label>Currency</Label>
          <select
            name="currency"
            value={formData.currency || "₹"}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            {Object.entries(CurrencyType).map(([code, symbol]) => (
              <option key={code} value={symbol}>
                {code} - {symbol}
              </option>
            ))}
          </select>

          <div className="w-full grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button> <Button type="submit" className='w-full'>
              {initialData ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

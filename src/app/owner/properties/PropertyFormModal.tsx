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

interface PropertyFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: IProperty) => void;
  initialData?: IProperty | null;
}

export default function PropertyFormModal({
  open,
  onClose,
  onSave,
  initialData,
}: PropertyFormModalProps) {
  const [formData, setFormData] = useState<IProperty>({
    name: '',
    description: '',
    address: '',
    city: '',
    category: 'Room',
    state: '',
    country: '',
    zipCode: '',
    images: [],
    currency: 'INR',
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
      [name]: name === 'amount' || name === 'advance' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
          <Label>City</Label>
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
    

          <Label>Category</Label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="Room">Room</option>
            <option value="Hotel">Hotel</option>
            <option value="Hostel">Hostel</option>
          </select>

         
          <Label>Currency</Label>
          <Input name="currency" placeholder="Currency" value={formData.currency || "INR"} onChange={handleChange} />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

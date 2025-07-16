'use client';

import { IProperty } from '@/app/types';
import { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
  onSubmit: (data: IProperty) => void;
  data: IProperty | null;
}

export default function PropertyAddEditModal({ onClose, onSubmit, data }: Props) {
  const [formData, setFormData] = useState<IProperty>(
    data || {
      name: '',
      address: '',
      city: '',
      category: 'Room',
      amount: 0,
      rentType: 'Month',
      status: 'active',
      state: '',
      country: '',
      zipCode: '',
      images: [],
      advance: 0,
      advanceDescription: '',
      currency: 'INR',
      ownerId: '',
      disabled: false,
    }
  );

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'advance' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">{data ? 'Edit' : 'Add'} Property</h2>

        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input" required />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="input" required />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="input" required />
        <input name="amount" value={formData.amount} onChange={handleChange} type="number" placeholder="Amount" className="input" required />

        <select name="category" value={formData.category} onChange={handleChange} className="input" required>
          <option value="Room">Room</option>
          <option value="Hotel">Hotel</option>
          <option value="Hostel">Hostel</option>
        </select>

        <select name="rentType" value={formData.rentType} onChange={handleChange} className="input" required>
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </select>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            {data ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}

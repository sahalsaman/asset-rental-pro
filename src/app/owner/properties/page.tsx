'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { IProperty } from '@/app/types';
import PropertyAddEditModal from './PropertyAddEditModal';
import PropertyCard from './PropertyCard';

const mockProperties: IProperty[] = [
  {
    _id: '1',
    name: 'Sunrise Apartment',
    address: '123 Main St',
    city: 'Kozhikode',
    category: 'Room',
    amount: 5000,
    rentType: 'Month',
    status: 'active',
    state: '',
    country: '',
    zipCode: '',
    images: ["https://t3.ftcdn.net/jpg/00/83/92/82/360_F_83928200_mYGZqB0ozTtSS6J5EtW9834mjb5tLW6x.jpg"],
    advance: 0,
    advanceDescription: '',
    currency: 'INR',
    ownerId: 'owner1',
    disabled: false,
  },
  {
    _id: '2',
    name: 'Deluxe Hotel Suite',
    address: '456 Grand Road',
    city: 'Kochi',
    category: 'Hotel',
    amount: 2000,
    rentType: 'Day',
    status: 'inactive',
    state: '',
    country: '',
    zipCode: '',
    images: ["https://upload.wikimedia.org/wikipedia/commons/4/45/WilderBuildingSummerSolstice.jpg"],
    advance: 0,
    advanceDescription: '',
    currency: 'INR',
    ownerId: 'owner2',
    disabled: false,
  },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<IProperty[]>(mockProperties);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<IProperty | null>(null);

  const handleDelete = (id: string) => {
    setProperties(prev => prev.filter(p => p._id !== id));
  };

  const handleSubmit = (data: IProperty) => {
    if (editData) {
      setProperties(prev => prev.map(p => (p._id === data._id ? data : p)));
    } else {
      setProperties(prev => [{ ...data, _id: Date.now().toString() }, ...prev]);
    }

    setShowForm(false);
    setEditData(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Properties</h1>
        <button
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} /> Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {properties.map(property => (
  <PropertyCard
    key={property._id}
    property={property}
    onEdit={(data) => {
      setEditData(data);
      setShowForm(true);
    }}
    onDelete={handleDelete}
  />
))}
      </div>

      {showForm && (
        <PropertyAddEditModal
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSubmit={handleSubmit}
          data={editData}
        />
      )}
    </div>
  );
}

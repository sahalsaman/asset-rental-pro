'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { IProperty } from '@/app/types';

interface Props {
  property: IProperty;
  onEdit: (property: IProperty) => void;
  onDelete: (id: string) => void;
}

export default function PropertyCard({ property, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition">
      <div className='flex gap-2'>
        {property.images && property.images[0] && (
          <div className="w-32 h-32 overflow-hidden rounded-md">
            <img
              src={property.images[0]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className='w-full flex flex-col justify-between'>
      
            <div className='flex justify-between mt-2'>
            <p className="text-sm">{property.category}</p>
              <div className='flex gap-2'>
                <button
                  onClick={() => onEdit(property)}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDelete(property._id!)}
                >
                  <Trash2 size={14} />
                </button>   <div className="text-xs w-fit rounded bg-green-700 text-white px-2 py-1 ">{property.status}</div>

              </div>

            </div>
          <div>
            <h2 className="text-lg font-semibold">{property.name}</h2>
            <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
              <p className="text-sm"> ₹{property.amount} / {property.rentType}</p>
          </div>
       
        </div>

      </div>




    </div>
  );
}

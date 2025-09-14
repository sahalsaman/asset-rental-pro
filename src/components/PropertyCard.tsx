'use client';

import { ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { IProperty } from '@/app/types';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface Props {
  property: IProperty;
  onEdit: (property: IProperty) => void;
  onDelete: (property: IProperty) => void;
}

export default function PropertyCard({ property, onEdit, onDelete }: Props) {

  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition"
    >
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

          <div className='flex justify-between'>
              <Badge variant="default">{property.category}</Badge>
            <div className='flex  gap-3'>
              <button
                onClick={() => onEdit(property)}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(property)}
              >
                <Trash2 size={16} />
              </button>
              {/* <div className="text-xs w-fit rounded bg-green-700 text-white px-2 py-1 ">{property.status}</div> */}

            </div>

          </div>
          <div>
            <h2 className="text-lg font-semibold mt-1">{property.name}</h2>
            <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
            {/* <p className="text-sm"> ₹{property.amount} / {property.frequency}</p> */}
          </div>
          {/* <div className='flex justify-end  '>
          
            <button className='hover:text-gray-700 transition flex items-center gap-1 cursor-pointer '
              onClick={() => router.push(`/owner/properties/${property._id}`)}
            >  <span className="text-sm">View Details</span>
              <ArrowRight size={18} />
            </button>
          </div> */}

        </div>
      </div>
    </div>
  );
}

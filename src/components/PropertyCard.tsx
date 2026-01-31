'use client';

import { ArrowRight, Edit, Pencil, Trash2 } from 'lucide-react';
import { IProperty } from '@/app/types';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';

interface Props {
  property: IProperty;
  currentProperty: IProperty;
  onEdit: (property: IProperty) => void;
  onDelete: (property: IProperty) => void;
}

export default function PropertyCard({ property, currentProperty,onEdit, onDelete }: Props) {

  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition relative"
    >
      <div className='flex gap-2'>
        {property.images && property.images[0] && (
          <div className="w-24 h-24 overflow-hidden rounded-md">
            <img
              src={property.images[0]?.url}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className='w-full'>

          <div className='flex justify-between'>
            <h2 className="text-lg font-semibold mt-1">{property.name}</h2>
            <div className='flex  gap-3'>

              <Button size="icon" variant="outline" onClick={() => onEdit(property)}>
                <Edit className="w-4 h-4" />
              </Button>
              <button
                onClick={() => onDelete(property)}
              >
                {/* <Trash2 size={16} /> */}
              </button>
              {/* <div className="text-xs w-fit rounded bg-green-700 text-white px-2 py-1 ">{property.status}</div> */}

            </div>

          </div>
          <div>
            <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
          </div>
          <Badge className='mt-2' variant="default">{property.category}</Badge>
          {/* <div className='flex justify-end  '>
          
            <button className='hover:text-gray-700 transition flex items-center gap-1 cursor-pointer '
              onClick={() => router.push(`/owner/properties/${property._id}`)}
            >  <span className="text-sm">View Details</span>
              <ArrowRight size={18} />
            </button>
          </div> */}
        </div>
      </div>
 {currentProperty._id===property._id?     <div className='bg-green-700 text-white w-fit absolute bottom-0 right-0 rounded-br-xl rounded-tl-xl px-4 py-1 text-sm font-bold'>Selected</div>:""}
    </div>
  );
}

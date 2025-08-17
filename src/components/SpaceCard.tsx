"use client";

import { IProperty, ISpace } from "@/app/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SpaceCardProps {
  space: ISpace;
  property: IProperty;
  onEdit: (space: ISpace) => void;
  onDelete: (id: string) => void;
  onBook: (space: ISpace) => void;
}

export default function SpaceCard({ space, property, onEdit, onDelete, onBook }: SpaceCardProps) {
  const router = useRouter();
  return (
    <Card className="shadow-md">
 
      <CardContent>

        <CardTitle className="flex justify-between items-center">
          <h2>{space.name}</h2>
              <button className='hover:text-gray-700 transition flex items-center gap-1 cursor-pointer '
              onClick={() => router.push(`/owner/properties/${property._id}/${space._id}`)}
            >  <span className="text-sm">View Details</span>
              <ArrowRight size={18} />
            </button>
        </CardTitle>
        <p className="text-gray-700">{space.description}</p>
        <p className="font-bold mt-2">
           {property?.currency}{space.amount}
        </p>
        <p className="text-sm text-gray-500">Type: {space.type}</p>
        <p className="text-sm text-gray-500">Status: {space.status}</p>
        <p className="text-sm text-gray-500">Slots: {(space?.bookingsCount??0)}/{space.noOfSlots}</p>
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" onClick={() => onEdit(space)}>
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button variant="destructive" onClick={() => onDelete(space._id!)}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
          <Button variant="default" onClick={() => onBook(space)}>
            Add Enrolment
          </Button>
        
        </div>

      </CardContent>
    </Card>
  );
}

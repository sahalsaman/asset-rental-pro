"use client";

import { IProperty, IUnit } from "@/app/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { statusColorMap } from "@/utils/contants";

interface UnitCardProps {
  unit: IUnit;
  property: IProperty;
  onEdit: (unit: IUnit) => void;
  onDelete: (id: string) => void;
  onBook: (unit: IUnit) => void;
}

export default function UnitCard({ unit, property, onEdit, onDelete, onBook }: UnitCardProps) {
  const router = useRouter();
  return (
    <Card className="shadow-md py-3" onClick={() => router.push(`/owner/units/${unit._id}`)}>

      <CardContent className="px-3 ">

        <CardTitle className="flex justify-between items-center">
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${statusColorMap[unit.status] || "bg-gray-100 text-gray-800"
              }`}
          >
            {unit.status}
          </span>
          <p className="font-bold">
            {property?.currency}{unit.amount?.toLocaleString()}
          </p>
        </CardTitle>
        <h2 className="font-bold mt-1">{unit.name}</h2>

        {/* <p className="text-gray-700">{unit.description}</p> */}

        {unit.type && <p className="text-sm text-gray-500">Type: {unit.type}</p>}


        <div className="flex justify-between gap-2 mt-4">
          {/* <Button variant="secondary" onClick={() => onEdit(unit)}>
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </Button> */}
          {/* <Button variant="destructive" onClick={() => onDelete(unit._id!)}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button> */}
          {/* <Button variant="default" onClick={() => onBook(unit)}>
            Add Enrolment
          </Button> */}
       
        {unit.noOfSlots > 1 ? <p className="text-sm text-gray-500">Slots: {(unit?.currentBooking ?? 0)}/{unit.noOfSlots}</p>:<p></p>}
          <button className='hover:text-gray-700 transition flex items-center gap-1 cursor-pointer '
            onClick={() => router.push(`/owner/properties/${property._id}/${unit._id}`)}
          >  <span className="text-sm">View Details</span>
            <ArrowRight size={18} />
          </button>

        </div>

      </CardContent>
    </Card>
  );
}

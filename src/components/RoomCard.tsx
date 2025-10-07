"use client";

import { IProperty, IRoom } from "@/app/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { statusColorMap } from "@/utils/contants";

interface RoomCardProps {
  room: IRoom;
  property: IProperty;
  onEdit: (room: IRoom) => void;
  onDelete: (id: string) => void;
  onBook: (room: IRoom) => void;
}

export default function RoomCard({ room, property, onEdit, onDelete, onBook }: RoomCardProps) {
  const router = useRouter();
  return (
    <Card className="shadow-md py-3" onClick={() => router.push(`/owner/rooms/${room._id}`)}>

      <CardContent className="px-3 ">

        <CardTitle className="flex justify-between items-center">
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${statusColorMap[room.status] || "bg-gray-100 text-gray-800"
              }`}
          >
            {room.status}
          </span>
          <p className="font-bold">
            {property?.currency}{room.amount}
          </p>
        </CardTitle>
        <h2>Room : {room.name}</h2>

        {/* <p className="text-gray-700">{room.description}</p> */}

        {room.type && <p className="text-sm text-gray-500">Type: {room.type}</p>}

        {room.noOfSlots > 1 && <p className="text-sm text-gray-500">Slots: {(room?.bookingsCount ?? 0)}/{room.noOfSlots}</p>}

        <div className="flex justify-between gap-2 mt-4">
          {/* <Button variant="secondary" onClick={() => onEdit(room)}>
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </Button> */}
          {/* <Button variant="destructive" onClick={() => onDelete(room._id!)}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button> */}
          {/* <Button variant="default" onClick={() => onBook(room)}>
            Add Enrolment
          </Button> */}
          <p></p>
          <button className='hover:text-gray-700 transition flex items-center gap-1 cursor-pointer '
            onClick={() => router.push(`/owner/properties/${property._id}/${room._id}`)}
          >  <span className="text-sm">View Details</span>
            <ArrowRight size={18} />
          </button>

        </div>

      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { IBooking } from "@/app/types";

interface BookingCardProps {
  booking: IBooking;
  onEdit: (booking: IBooking) => void;
  onDelete: (id: string) => void;
}

export default function BookingCard({ booking, onEdit, onDelete }: BookingCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm flex justify-between items-start">
      <div>
        <p className="font-semibold">{booking.fullName}</p>
        <p className="text-sm text-gray-500">
          {/* {new Date(booking?.checkIn).toLocaleDateString()} */}
        </p>
        <p className="text-sm">
          <strong>Status:</strong> {booking.status}
        </p>
      
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onEdit(booking)}>Edit</Button>
        {/* <Button variant="destructive" onClick={() => onDelete(booking?._id)}>Delete</Button> */}
      </div>
    </div>
  );
}

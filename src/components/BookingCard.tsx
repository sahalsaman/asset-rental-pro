"use client";

import { Button } from "@/components/ui/button";
import { IBooking } from "@/app/types";
import { CalendarDays, Phone, MapPin, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface BookingCardProps {
  booking: IBooking;
  onEdit: (booking: IBooking) => void;
  onDelete: (id: string) => void;
}

export default function BookingCard({ booking, onEdit, onDelete }: BookingCardProps) {
    const router = useRouter();
      const { id, roomId } = useParams();
  return (
    <div className="border rounded-lg p-5 shadow-sm  hover:shadow-md transition">
      {/* Left Side - Booking Info */}
      <div className="flex flex-col gap-2">
        {/* Name & Status */}
        <div className="flex items-center gap-3">
          <p className="text-lg font-semibold">{booking.fullName}</p>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              booking.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : booking.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {booking.status}
          </span>
        </div>

        {/* Contact */}
        {booking.phone && (
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Phone size={14} /> {booking.phone}
          </p>
        )}

        {/* Address */}
        {booking.address && (
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin size={14} /> {booking.address}
          </p>
        )}

        {/* Dates */}
        <div className="flex gap-4 text-sm text-gray-500 mt-1">
          {booking.checkIn && (
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {new Date(booking.checkIn).toLocaleDateString()}
            </span>
          )}
          {booking.checkOut && (
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {new Date(booking.checkOut).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Amount Info */}
        <div className="mt-2 text-sm">
          {booking.amount && (
            <span className="mr-4">
              <strong>Rent Amount:</strong> ₹{booking.amount.toLocaleString()}
            </span>
          )}
          {booking.advanceAmount && (
            <span>
              <strong>Advance:</strong> ₹{booking.advanceAmount.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center justify-end gap-2 shrink-0 mt-4">
        {/* <Button variant="outline" onClick={() => onEdit(booking)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => booking._id && onDelete(booking._id)}
        >
          Delete
        </Button> */}
            <button className='hover:text-gray-700 transition flex items-center gap-1 cursor-pointer '
              onClick={() => router.push(`/owner/rooms/${booking.roomId}/${booking._id}`)}
            >  <span className="text-sm">View Details</span>
              <ArrowRight size={18} />
            </button>
      </div>
    </div>
  );
}


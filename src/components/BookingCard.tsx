"use client";

import { Button } from "@/components/ui/button";
import { IBooking } from "@/app/types";
import { CalendarDays, Phone, MapPin, ArrowRight, MessageCircle, ReceiptIndianRupee } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { statusColorMap } from "@/utils/contants";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

interface BookingCardProps {
  booking: IBooking;
  onEdit?: (booking: IBooking) => void;
  onDelete?: (id: string) => void;
}

export default function BookingCard({ booking, onEdit, onDelete }: BookingCardProps) {
  const router = useRouter();
  const { id, unitId } = useParams();
  const current_property = localStorageServiceSelectedOptions.getItem()?.property
  return (
    <div className="border rounded-lg p-4 md:p-5 shadow-sm  hover:shadow-md transition">
      {/* Left Side - Booking Info */}
      <div className="flex flex-col gap-1">
        {/* Name & Status */}
        <div className="flex items-center justify-between ">
          <p className="text-lg font-semibold">{booking.fullName}</p>
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${statusColorMap[booking?.status ?? ""] || "bg-gray-100 text-gray-800"
              }`}
          >
            {booking.status}
          </span>
        </div>

        {/* <div className="flex items-center justify-between">
          {booking.phone && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone size={14} /> <span>{booking.countryCode}{booking.phone}</span>
            </p>
          )}
          {booking.whatsappNumber && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MessageCircle size={14} /> <span>{booking.whatsappCountryCode}{booking.whatsappNumber}</span>
            </p>
          )}
        </div> */}





        {/* Amount Info */}

      </div>

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


      {/* Right Side - Actions */}
      <div className="flex items-center justify-between gap-2 shrink-0 mt-4">
        {/* <Button variant="outline" onClick={() => onEdit(booking)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => booking._id && onDelete(booking._id)}
        >
          Delete
        </Button> */}
        <div className=" text-sm flex gap-4 items-center">

          {/* {booking.advanceAmount && (
            <span>Advance: {current_property?.currency}{booking.advanceAmount.toLocaleString()}
            </span>
          )} */}
          {booking.amount && (
            <p className=" text-xs flex gap-1">
              <ReceiptIndianRupee size={16} className="text-gray-700" />
              <span className="mr-4"> {current_property?.currency}{booking.amount.toLocaleString()}
              </span>
            </p>
          )}

        </div>
        <button className='hover:text-gray-700 transition flex items-center gap-1 cursor-pointer '
          onClick={() => router.push(`/owner/units/${booking.unitId}/${booking._id}`)}
        >  <span className="text-sm">View Details</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}


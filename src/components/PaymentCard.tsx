"use client";

import { IBooking, IInvoice, IProperty } from "@/app/types";
import { statusColorMap } from "@/utils/contants";

interface Props {
  invoice: IInvoice;
  property: IProperty
}

export default function PaymentCard({ invoice, property }: Props) {
  return (
    <div>
      <p className="text-gray-600">
        {invoice?.updatedAt
          ? new Date(invoice.updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          : "—"}
      </p>
      <div className="flex  justify-between items-center">
        <h3 className="text-2xl font-semibold">
          {(invoice?.bookingId as IBooking)?.fullName ?? ""}
        </h3>

        <h3 className="text-2xl font-semibold">
          {property?.currency}{invoice.amount}
        </h3>
      </div>
      <div className="flex  justify-between items-center">
        <p className="text-gray-500"> #{invoice?.invoiceId}</p>
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColorMap[invoice?.status ?? ""] || "bg-gray-100 text-gray-800"}`} >
          {invoice.status}
        </span>
      </div>

    </div>
  );
}

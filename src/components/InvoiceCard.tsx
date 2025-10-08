"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IBooking, IInvoice, IProperty } from "@/app/types";
import { Edit, Trash } from "lucide-react";
import { statusColorMap } from "@/utils/contants";

interface Props {
  invoice: IInvoice;
  property: IProperty
  onEdit: (invoice: IInvoice) => void;
  onDelete: (id: string) => void;
}

export default function InvoiceCard({ invoice, onEdit, onDelete, property }: Props) {
  return (
    <Card className="py-4">
      <CardContent className="px-4"> 
        <CardTitle className="text-lg font-semibold flex justify-between">
          <span> {(invoice?.bookingId as IBooking)?.fullName ?? ""}</span>
          <span>{property?.currency}{invoice.amount}</span>
        </CardTitle>
        <p className="text-gray-600 text-sm">   {invoice?.updatedAt
          ? new Date(invoice.updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          : "—"}</p>
        <p className="text-gray-700 text-xs">
          #{invoice?.invoiceId}</p>
        <div className="flex  justify-between items-end">

          <div >

           
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${statusColorMap[invoice?.status ?? ""] || "bg-gray-100 text-gray-800"
                }`}
            >
              {invoice.status}
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={() => onEdit(invoice)}>
              <Edit className="w-4 h-4" />
            </Button>
            {/* <Button size="icon" variant="destructive" onClick={() => onDelete(invoice._id!)}>
            <Trash className="w-4 h-4" />
          </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

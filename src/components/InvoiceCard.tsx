"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IInvoice, IProperty } from "@/app/types";
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
    <Card>
      <CardContent >
        <p className="text-gray-700">
          #{invoice?.invoiceId}</p>
        <CardTitle className="text-lg font-semibold">
          {property?.currency}{invoice.amount}
        </CardTitle>
        <div className="flex  justify-between items-end">

          <div >

            {/* <p className="text-gray-600">Date: {new Date(invoice?.date).toLocaleDateString()}</p> */}
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

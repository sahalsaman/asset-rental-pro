"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IInvoice } from "@/app/types";
import { Edit, Trash } from "lucide-react";

interface Props {
  invoice: IInvoice;
  onEdit: (invoice: IInvoice) => void;
  onDelete: (id: string) => void;
}

export default function InvoiceCard({ invoice, onEdit, onDelete }: Props) {
  return (
    <Card>
      <CardContent >
             <CardTitle className="text-lg font-semibold">
            #{invoice?.invoiceId}
          </CardTitle>
        <div className="flex  justify-between items-end">

        <div >
     
          <p className="text-gray-700">
            Amount: <span className="font-medium">{invoice.amount}</span>
          </p>
          {/* <p className="text-gray-600">Date: {new Date(invoice?.date).toLocaleDateString()}</p> */}
          <p className="text-gray-600">Status: {invoice.status}</p>
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

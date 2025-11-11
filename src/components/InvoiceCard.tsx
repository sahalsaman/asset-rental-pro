"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IBooking, IInvoice, IProperty } from "@/app/types";
import { Edit, MessageCircle, Send, Trash } from "lucide-react";
import { InvoiceStatus, statusColorMap } from "@/utils/contants";
import { app_config } from "../../app-config";

interface Props {
  invoice: IInvoice;
  property: IProperty
  onEdit: (invoice: IInvoice) => void;
  onDelete: (id: string) => void;
}

export default function InvoiceCard({ invoice, onEdit, onDelete, property }: Props) {

  function sendToWhatsappMesaage(invoice: IInvoice, property?: any) {
    const phone = invoice.bookingId?.whatsappCountryCode + invoice.bookingId?.whatsappNumber;

    const dueDate = new Date(invoice.dueDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const message = `💼 *Payment Reminder*\n\nHello ${invoice?.bookingId?.userId?.firstName || "Customer"}, 👋\n\nThis is a friendly reminder that your *invoice* 🧾  
(ID: *${invoice.invoiceId}*) for an amount of *${property?.currency || "₹"}${invoice.amount}* is due on *${dueDate}*. 📅\n\nPlease make the payment at your earliest convenience to avoid any interruption in service. 💰  
\n\nThank you for your prompt attention! 🙏  
– *From ${property?.name || app_config.APP_NAME}*`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }


  return (
    <Card className="py-4">
      <CardContent className="px-4">
        <CardTitle className="text-lg font-semibold flex justify-between">
          <span> {(invoice?.bookingId as IBooking)?.userId?.firstName ?? ""}
            {(invoice?.bookingId as IBooking)?.userId?.lastName ?? ""}
          </span>
          <span>{property?.currency}{invoice.amount?.toLocaleString()}</span>
        </CardTitle>
        <p className="text-gray-600 text-sm">   {invoice?.dueDate
          ? new Date(invoice.dueDate).toLocaleDateString("en-GB", {
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
            {invoice.status !== InvoiceStatus.PAID && <Button size="icon" variant="green" onClick={() => sendToWhatsappMesaage(invoice,property)}>
              <Send className="w-4 h-4" />
            </Button>}
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

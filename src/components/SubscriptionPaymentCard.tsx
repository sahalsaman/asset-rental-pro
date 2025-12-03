"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Send } from "lucide-react";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

const statusColor = {
  PAID: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  FAILED: "bg-red-100 text-red-800",
};

export default function SubscriptionPaymentCard({ invoice }: any) {
  const property = localStorageServiceSelectedOptions.getItem()?.property;

  return (
    <Card className="py-4">
      <CardContent className="px-4">
        <CardTitle className="text-lg font-semibold flex justify-between">
          <span>
            {property?.currency}
            {invoice.total_price?.toLocaleString()}
          </span>
        </CardTitle>

        <p className="text-gray-600 text-sm">
          {new Date(invoice.startDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        <p className="text-gray-700 text-xs">#{invoice._id}</p>

        <div className="flex justify-between items-center mt-4">
          {/* <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${
              statusColor[invoice.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {invoice.status}
          </span> */}

          <div className="flex gap-2">
            {invoice.status !== "PAID" && (
              <Button size="icon" variant="green">
                <Send className="w-4 h-4" />
              </Button>
            )}

            <Button size="icon" variant="outline">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

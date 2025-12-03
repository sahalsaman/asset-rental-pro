"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import SubscriptionPaymentCard from "@/components/SubscriptionPaymentCard";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

export default function SubscriptionPayments() {
  const [subscriptionPayments, setSubscriptionPayments] = useState([]);
  const [loader, setLoader] = useState(false);

  const property = localStorageServiceSelectedOptions.getItem()?.property;

  // Month-Year filters
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchSubscriptionPayments = async ( year: number) => {
    setLoader(true);
    apiFetch(
      `/api/subscription/payments?propertyId=${property?._id}&year=${year}`
    )
      .then((res) => res.json())
      .then((data) => {
        setSubscriptionPayments(data?.data || []);
      })
      .catch((err) => console.error("Fetch Error:", err))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    if (property?._id) {
      fetchSubscriptionPayments( selectedYear);
    }
  }, [property?._id, selectedYear]);

  if (loader) return <FullscreenLoader />;

  return (
    <div className="p-5 md:pt-10 md:px-32 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Payments</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">

        <select
          className="border px-3 py-2 rounded w-fit"
          style={{maxWidth: '100px',borderRadius: '0.5rem'}}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {/* Listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subscriptionPayments.length > 0 ? (
          subscriptionPayments.map((payment: any) => (
            <SubscriptionPaymentCard key={payment._id} invoice={payment} />
          ))
        ) : (
          <p className="text-gray-600">No subscription payments found.</p>
        )}
      </div>
    </div>
  );
}

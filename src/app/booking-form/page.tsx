"use client";

import { IProperty } from "@/app/types";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import BookingAddEditModal from "@/components/BookingFormModal";
import { FullscreenLoader } from "@/components/Loader";

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [property, setProperty] = useState<IProperty | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loader, setLoader] = useState(true);

  const fetchProperty = async () => {
    try {
      setLoader(true);

      const propertyId = searchParams.get("property_id");
      if (!propertyId) {
        console.error("❌ Property ID missing in URL");
        setLoader(false);
        return;
      }

      const res = await apiFetch(`/api/property?propertyId=${propertyId}`);
      if (!res.ok) throw new Error("Failed to fetch property");

      const data = await res.json();
      setProperty(data);
    } catch (err) {
      console.error("Error fetching property:", err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [searchParams]); // re-fetch if query changes

  if (loader) return <FullscreenLoader />;

  if (!property)
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-gray-700">
        <div>Property not found</div>
      </main>
    );

  return (
    <main className="bg-white text-gray-800 pt-12 md:px-32 px-5 mb-10 relative">
      <BookingAddEditModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSave={() => setShowBookingModal(false)}
        property_data={property}
      />
    </main>
  );
}

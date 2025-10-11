"use client";

import { IProperty } from "@/app/types";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import BookingAddEditModal from "@/components/BookingFormModal";
import { FullscreenLoader } from "@/components/Loader";
import { useRouter } from "next/navigation";

export default function BookingForm() {
    const [property, setProperty] = useState<IProperty | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [loader, setLoader] = useState(true);
    const router = useRouter();

    const fetchProperty = async () => {
        try {
            setLoader(true);
            const propertyId = new URLSearchParams(window.location.search).get("property_id");
            if (!propertyId) {
                console.error("❌ Property ID missing in URL");
                setLoader(false);
                return;
            }

            const res = await apiFetch(`/api/property?propertyId=${propertyId}`);
            if (!res.ok) throw new Error("Failed to fetch property");

            const data = await res.json();
            setShowBookingModal(true)
            setProperty(data);
            setLoader(false);
        } catch (err) {
            console.error("Error fetching property:", err);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchProperty();
    }, []); // re-fetch if query changes

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
                onClose={() => setShowBookingModal(true)}
                onSave={() =>
                    router.push("/")}
                property_data={property}
                booking_from_outside={true}
            />
        </main>
    );
}

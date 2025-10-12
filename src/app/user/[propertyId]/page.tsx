"use client";

import { IProperty } from "@/app/types";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import BookingAddEditModal from "@/components/BookingFormModal";
import { FullscreenLoader } from "@/components/Loader";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import CheckoutModal from "@/components/ChecoutModal";

export default function UserByProperty() {
    const [property, setProperty] = useState<IProperty | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [loader, setLoader] = useState(true);
    const router = useRouter();
    const params = useParams();
    const propertyId = params.propertyId;

    const fetchProperty = async () => {
        try {
            setLoader(true);

            const res = await apiFetch(`/api/property?propertyId=${propertyId}`);
            if (!res.ok) throw new Error("Failed to fetch property");

            const data = await res.json();
            setProperty(data);
            setLoader(false);
        } catch (err) {
            console.error("Error fetching property:", err);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (!propertyId) {
            router.push("/")
            setLoader(false);
            return;
        }
        fetchProperty();
    }, []);

    if (loader) return <FullscreenLoader />;

    if (!property)
        return (
            <main className="min-h-screen flex items-center justify-center bg-white text-gray-700">
                <div>Property not found</div>
            </main>
        );

    return (

        <div className="bg-green-700 bg-gradient-to-br from-green-700 to-green-900 ">
            <div className="h-60 flex justify-center items-center">
                <h2 className="text-3xl font-bold text-white text-center mb-4 ">Welcome to Asset Management</h2>
            </div>
            <div className="absolute w-full" style={{ marginTop: "-35px" }}>
                <div className="flex justify-center items-center w-full">
                    <div className="w-full max-w-[450px] flex flex-col gap-5 items-center justify-between h-full bg-white py-10 px-5 rounded-4xl sm:shadow-2xl mt-5">
                        <div className="flex items-center gap-2 mb-5">   <Building2 size={24} />
                            <h2 className="text-lg font-bold text-center">{property?.name}</h2></div>
                        <Button variant="green" className="w-full py-10 text-2xl font-bold shadow-lg" onClick={() => setShowBookingModal(true)}>Check In</Button>
                        <Button variant="green" className="w-full py-10 text-2xl font-bold shadow-lg" onClick={() => setShowCheckoutModal(true)}>Check Out</Button>
                        <p className="text-xs text-gray-500 text-center mt-10">
                            Powered by ARP
                        </p>
                    </div>
                </div>
            </div>
            <BookingAddEditModal
                open={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onSave={() =>
                    router.push("/")}
                property_data={property}
            />
            <CheckoutModal
                open={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                onSave={() =>
                    router.push("/")}
                property_data={property}
            />
        </div>




    );

}

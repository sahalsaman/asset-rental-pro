"use client";

import { Building2, Users, QrCode, DollarSign, Plus, Calendar, NotepadTextDashed, Square, Building, EyeOff, Ligature, LightbulbIcon, Factory, BuildingIcon, Megaphone } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { IProperty } from "@/app/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import PropertyFormModal from "@/components/PropertyFormModal";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import BookingAddEditModal from "@/components/BookingFormModal";
import { FullscreenLoader } from "@/components/Loader";


export default function BookingForm() {
    const router = useRouter();
    const [property, setProperty] = useState({});
    const [showBookingModal, setShowBookingModal] = useState(false);
    const searchParams = useSearchParams();
    const [loader, setLoader] = useState(true);


const fetchProperty = async () => {
  try {
    setLoader(true);

    const orgId = searchParams.get("org_id");
    const propertyId = searchParams.get("property_id");

    if (!propertyId) {
      console.error("Property ID is missing in URL");
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
    setLoader(false); // ✅ always runs after try/catch
  }
};

useEffect(() => {
  fetchProperty();
}, []);


    if (loader) return <FullscreenLoader />;

    return (
        <main className=" bg-white text-gray-800 pt-12 md:px-32 px-5 mb-10 relative">
            {
                !property ? <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center z-10 p-5 text-center">Not found</div> :

                    <BookingAddEditModal
                        open={showBookingModal}
                        onClose={() => {
                            setShowBookingModal(false);
                        }}
                        onSave={() => {
                            setShowBookingModal(false);
                        }}
                        property_data={property as IProperty}
                    />}
        </main>
    );
}

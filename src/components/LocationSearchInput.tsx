"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { env } from "../../environment";

interface LocationSearchInputProps {
  onSelectLocation: (data: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    area: string;
    lat: number;
    lng: number;
    mapUrl: string;
  }) => void;
  defaultValue?: string;
};


export default function LocationSearchInput({
  onSelectLocation,
  defaultValue = "",
}: LocationSearchInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current) return;
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      componentRestrictions: { country: "in" }, // optional: restrict to India
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.address_components) return;

      const lat = place.geometry.location?.lat() ?? 0;
      const lng = place.geometry.location?.lng() ?? 0;

      const address = place.formatted_address || "";
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

      let city = "";
      let state = "";
      let zipCode = "";
      let area = "";

      place.address_components.forEach((comp) => {
        const types = comp.types;
        if (types.includes("locality")) city = comp.long_name;
        if (types.includes("administrative_area_level_1")) state = comp.long_name;
        if (types.includes("postal_code")) zipCode = comp.long_name;
        if (types.includes("sublocality") || types.includes("neighborhood")) area = comp.long_name;
      });

      onSelectLocation({
        address,
        city,
        state,
        zipCode,
        area,
        lat,
        lng,
        mapUrl,
      });
    });
  };

  return (
    <Input
      ref={inputRef}
      defaultValue={defaultValue}
      placeholder="Search property location"
      className="w-full"
      type="text"
    />
  );
}

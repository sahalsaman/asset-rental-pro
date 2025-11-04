"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  X,
  Menu,
  Bath,
  Bed,
  AirVent,
  Wifi,
} from "lucide-react";
import dummy_image from "../../../../public/dummy-property.jpg";
import { app_config } from "../../../../app-config";
import { statusColorMap, UnitStatus } from "@/utils/contants";

export default function PropertyDetailPage() {
  const { id } = useParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);

  // 🧩 Fetch property details
  useEffect(() => {
    if (!id) return;
    fetchPropertyDetails();
  }, [id]);

  async function fetchPropertyDetails() {
    try {
      setLoading(true);
      const res = await fetch(`/api/public?id=${id}`);
      const data = await res.json();
      setProperty(data);
    } catch (err) {
      console.error("Failed to fetch property", err);
    } finally {
      setLoading(false);
    }
  }

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading property details...
      </div>
    );
  }

  // ❌ Property not found
  if (!property || property.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Property Not Found</h1>
        <p className="text-gray-600">The property you are looking for does not exist.</p>
        <Link href="/properties">
          <button className="mt-6 bg-green-700 text-white px-6 py-2 rounded-xl">
            Go back to Properties
          </button>
        </Link>
      </div>
    );
  }

  // 🌿 Destructure safe fields
  const {
    name,
    description,
    address,
    amenities = [],
    images = [],
    services = [],
    units = [],
    city,
    state,
    country,
  } = property;

  const firstUnit = units[0];

  // 📱 Mobile menu
  if (menuOpen) {
    return (
      <div className="bg-white px-6 py-4 space-y-8 text-xl text-center flex flex-col min-h-screen">
        <div className="flex justify-between mb-10">
          <div className="flex items-center gap-3">
            <Image src={app_config.APP_LOGO} alt="Logo" width={40} height={40} className="cursor-pointer" />
          </div>
          <button onClick={() => setMenuOpen(false)}>
            <X className="h-10 w-10 text-gray-700" />
          </button>
        </div>
        <Link href="/auth/login" onClick={() => setMenuOpen(false)}>Login</Link>
        <Link href="/auth/signup">
          <button className="bg-green-700 text-white w-full py-2 rounded-xl">Get Started</button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-24 py-4 shadow-md bg-white sticky top-0 z-50">
        <a className="flex items-center gap-3" href="/">
          <Image src={app_config.APP_LOGO} alt="Logo" width={32} height={32} />
          <h1 className="text-xl md:text-3xl font-bold text-green-700">{app_config?.APP_NAME}</h1>
        </a>
        <button className="md:hidden" onClick={() => setMenuOpen(true)}>
          <Menu className="h-6 w-6 text-green-700" />
        </button>
      </header>

      {/* Property Details */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{name}</h1>
              <p className="flex items-center text-lg text-gray-600 mt-1">
                <MapPin size={18} className="mr-1 text-green-600" />
                {address}, {city}, {state}, {country}
              </p>
            </div>
            {firstUnit && (
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-4xl font-bold text-green-700">₹{firstUnit.amount}</p>
                <p className="text-gray-500 text-sm">per {firstUnit.frequency}</p>
              </div>
            )}
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 rounded-xl overflow-hidden shadow-lg">
            {(images.length ? images : [dummy_image]).slice(0, 3).map((img: any, i: string) => (
              <div key={i} className="h-64 w-full relative">
                <Image
                  src={img.url || img}
                  alt={`Property image ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition duration-300 rounded-xl"
                />
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left content */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Overview</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>

              {/* Amenities */}
              {amenities?.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Amenities</h3>
                  <ul className="grid grid-cols-2 gap-4 text-gray-600">
                    {amenities.map((a: any, i: string) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Units Section */}
              {property?.units?.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Available Units</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {units.map((unit: any, index: number) => (
                      <div
                        key={index}
                        className="p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-center">
                        <h4 className="text-lg font-bold text-gray-800 mb-2">{unit.name}</h4>
                             <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColorMap[unit?.status ?? ""] || "bg-gray-100 text-gray-800"}`} >
                            {unit.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1"><span className="font-medium text-gray-700"></span> {unit.type}</p>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium text-gray-700"></span> ₹{unit.amount} / {unit.frequency}
                        </p>
                        {unit.noOfSlots && <p className="text-gray-600 mb-1">
                          <span className="font-medium text-gray-700">Slots:</span> {unit.noOfSlots}
                        </p>}
                        <button
                          disabled={unit.status !== UnitStatus.AVAILABLE}
                          className={`w-full py-2 mt-4 rounded-lg text-white font-semibold transition text-sm ${unit.status === UnitStatus.AVAILABLE
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                          {unit.status === UnitStatus.AVAILABLE ? "Book Now" : "Not Available"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right side */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Interested?</h3>
                <p className="text-gray-600 mb-6">Contact the owner to know more.</p>
                <div className="space-y-3">
                  <button className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-xl text-lg font-semibold">
                    Call Owner
                  </button>
                  <button className="bg-white border border-green-600 text-green-600 w-full py-3 rounded-xl text-lg font-semibold hover:bg-green-50">
                    Send Message
                  </button>
                </div>
                <div className="mt-6 pt-4 border-t text-center">
                  <p className="text-sm text-gray-500">Property ID: #{property._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { Search, MapPin, X, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import PropertyPublicCard from "@/components/PropertyPublicCard";
import Image from "next/image";
import Link from "next/link";
import { app_config } from "../../../app-config";
import dummy_image from "../../../public/dummy-property.jpg";
import { useRouter } from "next/navigation";
import PropertyTypeSlider from "@/components/PropertiesSlider";

export default function PropertiesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const propertyTypes = [
    { name: "Flat / Apartment" },
    { name: "PG / Hostel / Lodge" },
    { name: "House" },
    { name: "Co-working" },
    { name: "Office Space" },
    { name: "Resort" },
    { name: "Turf" },
    { name: "Auditorium" },
  ];

  // 🔹 Fetch properties from API
  async function fetchProperties(search?: string, category?: string) {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("type", "property");
      if (search) params.append("search", search);
      if (category && category !== "All") params.append("category", category);

      const res = await fetch(`/api/public?${params.toString()}`);
      const data = await res.json();
      setProperties(data.data);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setLoading(false);
    }
  }


  // 🔹 Handle search button click
  const handleSearch = async () => {
    await fetchProperties(search, category);
  };

  if (menuOpen) {
    return (
      <div className="bg-white px-6 py-4 space-y-8 text-xl text-center flex flex-col">
        <div className="flex justify-between mb-10">
          <div className="flex items-center gap-3">
            <Image src={app_config.APP_LOGO} alt="Logo" width={40} className="cursor-pointer" />
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <X className="h-10 w-10 text-gray-700 font-light" />
          </button>
        </div>
        <Link className="border-b pb-8" href="#setup-guide" onClick={() => setMenuOpen(false)}>Setup Guide</Link>
        <Link className="border-b pb-8" href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
        <Link className="border-b pb-8" href="#downloads" onClick={() => setMenuOpen(false)}>Downloads</Link>
        <Link className="border-b pb-8" href="#faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
        <Link className="border-b pb-8" href="#contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        <Link className="border-b pb-8" href="/auth/login" onClick={() => setMenuOpen(false)}>Login</Link>
        <Link href="/auth/signup">
          <button className="bg-green-700 text-white w-full py-2 rounded-xl">Get Started</button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="flex justify-between items-center px-4 md:px-24 py-4 shadow-md bg-white sticky top-0 z-50">
        <a className="flex items-center gap-3" href="/">
          <Image src={app_config.APP_LOGO} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer" />
          <h1 className="text-xl md:text-3xl font-bold text-green-700">{app_config?.APP_NAME}</h1>
        </a>
        <nav className="hidden md:flex space-x-4 items-center text-sm md:text-base">
          <Link href="#setup-guide">Setup Guide</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#downloads">Downloads</Link>
          <Link href="#faq">FAQ</Link>
          <Link href="#contact">Contact</Link>
          <Link href="/auth/signup">
            <button className="bg-green-700 px-4 py-3 rounded-xl text-white text-sm">Get Started</button>
          </Link>
          <Link href="/auth/login">Login</Link>
        </nav>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="h-6 w-6 text-green-700" />
        </button>
      </header>

      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-br from-green-500 to-green-700">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-3xl font-bold">
          <h1 className="mb-5">Find Your Perfect Rental Property</h1>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between max-w-3xl mx-auto mt-[-50px] relative z-10">
        <div className="flex flex-wrap md:flex-nowrap gap-4 w-full">
          <select
            className=" px-4 py-2 border rounded-xl text-gray-600 md:max-w-40"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            {propertyTypes.map((i) => (
              <option key={i.name}>{i.name}</option>
            ))}
          </select>
          <div className="flex items-center border rounded-xl px-3 py-2 w-full">
            <MapPin className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder='Search "Kozhikode"'
              className="outline-none text-gray-700 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center"
          >
            <Search className="mr-2" size={18} /> Search
          </button>
        </div>
      </div>

      {/* Property List */}
      <section className="py-12 ">
        <div className="max-w-6xl mx-auto px-4">
          {properties?.length ? <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Properties</h2> : ""}

          {loading ? (
            <p className="text-gray-500 text-center">Loading properties...</p>
          ) : properties?.length  ?   (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
              {properties?.map((p: any, i) => (
                <PropertyPublicCard
                  key={p._id || i}
                  property={{
                    id: p._id,
                    image: p.images?.[0]?.url || dummy_image,
                    ...p
                  }}
                />
              ))}
            </div>
          ):(
            <p className="text-center">No property available</p>
          )}
        </div>
      </section>

         <PropertyTypeSlider />
    </main>
  );
}

"use client";
import { Search, MapPin, X, Menu, Bath, Bed, AirVent, Wifi } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dummy_image from "../../../../public/dummy-property.jpg";
import { app_config } from "../../../../app-config";
import { useParams } from "next/navigation";

const fetchPropertyDetails = (propertyId: any) => {
    
    const properties = [
        {
            id: 1,
            name: "Olive Residence - Thrikkakara",
            price: "2500",
            type: "1 BHK",
            bath: "1",
            ac: true,
            wifi: true,
            location: "Thrikkakara, Kochi",
            description: "A cozy 1 BHK flat perfect for students or young professionals. Located in a prime area with excellent access to public transport and amenities. Includes a small balcony and 24/7 security.",
            amenities: ["Security", "Parking", "Water Supply 24/7"],
            images: [dummy_image, dummy_image, dummy_image], // More images for the detail view
        },
        {
            id: 2,
            name: "Deluxe Apartment A - Thrikkakara",
            price: "3000",
            type: "2 BHK",
            bath: "2",
            ac: true,
            wifi: true,
            location: "Thrikkakara, Kochi",
            description: "Spacious 2 BHK apartment with modern fittings. Ideal for families. Enjoy reliable WiFi and AC in both bedrooms. The locality is peaceful and family-friendly.",
            amenities: ["Gym Access", "Elevator", "Power Backup"],
            images: [dummy_image, dummy_image],
        },
        // Add more properties if needed
    ];

    return properties.find(p => p.id == propertyId);
};

// Component for the Property Detail Page
export default function PropertyDetailPage() {
    const { id } = useParams();
    
    const property = fetchPropertyDetails(id);

    const [menuOpen, setMenuOpen] = useState(false);

    // Handle case where property is not found (404)
    if (!property) {
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

    // Mobile Menu Overlay
    if (menuOpen) {
        return (
            <div className="bg-white px-6 py-4 space-y-8 text-xl text-center flex flex-col min-h-screen">
                <div className="flex justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <Image src={app_config.APP_LOGO} alt="Logo" width={40} className='cursor-pointer' />
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
            </div>)
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header (Reused from PropertiesPage) */}
            <header className="flex justify-between items-center px-4 md:px-24 py-4 md:py-4 shadow-md bg-white sticky top-0 z-50">
                <a className="flex items-center gap-3" href="/">
                    <Image src={app_config.APP_LOGO} alt="Logo" className='w-6 h-6 sm:w-8 sm:h-8 cursor-pointer' />
                    <h1 className="text-xl md:text-3xl font-bold text-green-700">{app_config?.APP_NAME}</h1>
                </a>
                <nav className="hidden md:flex space-x-4 md:space-x-6 items-center text-sm md:text-base">
                    <Link href="#setup-guide">Setup Guide</Link>
                    <Link href="#pricing">Pricing</Link>
                    <Link href="#downloads">Downloads</Link>
                    <Link href="#faq">FAQ</Link>
                    <Link href="#contact">Contact</Link>
                    <Link href="/auth/signup">
                        <button className="bg-green-700 px-4 py-3 rounded-xl text-white text-sm ">Get Started</button>
                    </Link>
                    <Link href="/auth/login">Login</Link>
                </nav>
                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu className="h-6 w-6 text-green-700" />
                </button>
            </header>

            {/* Property Details Section */}
            <section className="py-8 md:py-12">
                <div className="max-w-6xl mx-auto px-4 space-y-10">

                    {/* Title and Price */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{property.name}</h1>
                            <p className="flex items-center text-lg text-gray-600 mt-1">
                                <MapPin size={18} className="mr-1 text-green-600" />
                                {property.location}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <p className="text-4xl font-bold text-green-700">₹{property.price}</p>
                            <p className="text-gray-500 text-sm">per month (negotiable)</p>
                        </div>
                    </div>

                    {/* Image Gallery (Placeholder for a more complex component) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 rounded-xl overflow-hidden shadow-lg">
                        {property.images.slice(0, 3).map((img, index) => (
                            <div key={index} className="h-64 w-full relative">
                                <Image
                                    src={img}
                                    alt={`Property image ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="hover:scale-105 transition duration-300"
                                />
                            </div>
                        ))}
                        {property.images.length > 3 && (
                            <div className="h-64 w-full relative bg-gray-200 flex items-center justify-center cursor-pointer">
                                <p className="text-xl font-semibold text-gray-700">+{property.images.length - 3} More Images</p>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Main Content Column */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Key Features */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Key Features</h3>
                                <div className="flex flex-wrap gap-4 text-gray-700">
                                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                        <Bed size={18} className="text-green-600" />
                                        <span>{property.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                        <Bath size={18} className="text-green-600" />
                                        <span>{property.bath} Bath</span>
                                    </div>
                                    {property.ac && (
                                        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                            <AirVent size={18} className="text-green-600" />
                                            <span>AC Included</span>
                                        </div>
                                    )}
                                    {property.wifi && (
                                        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                            <Wifi size={18} className="text-green-600" />
                                            <span>Free WiFi</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Property Overview</h3>
                                <p className="text-gray-600 leading-relaxed">{property.description}</p>
                            </div>

                            {/* Amenities */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">What&apos;s Included</h3>
                                <ul className="grid grid-cols-2 gap-4 text-gray-600">
                                    {property.amenities.map((amenity, index) => (
                                        <li key={index} className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            {amenity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Contact / Action Column */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Interested in this property?</h3>
                                <p className="text-gray-600 mb-6">Contact the owner/agent to arrange a viewing or to get more details.</p>
                                <div className="space-y-3">
                                    <button className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-xl text-lg font-semibold transition duration-300">
                                        Call Owner
                                    </button>
                                    <button className="bg-white border border-green-600 text-green-600 w-full py-3 rounded-xl text-lg font-semibold hover:bg-green-50 transition duration-300">
                                        Send Message
                                    </button>
                                </div>
                                <div className="mt-6 pt-4 border-t text-center">
                                    <p className="text-sm text-gray-500">Property ID: #{property.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer (You may want to add one here) */}
        </main>
    );
}
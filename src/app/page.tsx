"use client";

import { ArrowRight, Building2, Users, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-4 md:px-24 py-4 shadow-md bg-white sticky top-0 z-50">
        <h1 className="text-lg md:text-2xl font-bold text-green-700">AssetRentalPro</h1>
        <nav className="hidden md:flex space-x-4 md:space-x-6 items-center text-sm md:text-base">
          <Link href="#about">About</Link>
          <Link href="#services">Services</Link>
          <Link href="#features">Features</Link>
          <Link href="/auth/signup">
            <button className="bg-green-700 px-4 py-3 rounded-xl text-white text-sm ">Get Started</button>
          </Link>
          <Link href="/auth/login">Login</Link>
        </nav>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="h-6 w-6 text-green-700" />
        </button>
      </header>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-x-4 text-sm">
          <Link href="#about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="#services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="#features" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="#clients" onClick={() => setMenuOpen(false)}>Clients</Link>
          <Link href="#stats" onClick={() => setMenuOpen(false)}>Stats</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link href="/auth/signup">
            <button className="bg-green-700 text-white w-full">Get Started</button>
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-700 to-green-900 text-white md:py-40 py-16 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="max-w-4xl mx-auto z-10 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Discover & Manage Your Rental Assets Effortlessly
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Simplify bookings, automate rent, and scale faster with our smart rental platform.
          </p>
          <div className="max-w-xl mx-auto mb-6 flex rounded-xl overflow-hidden shadow-lg bg-white">
            <input
              type="text"
              placeholder="Search hostels, rooms, cities..."
              className="w-full px-4 py-3 text-gray-700 outline-none"
            />
            <button className="bg-green-600 text-white px-6">Search</button>
          </div>
          <Link href="/auth/signup">
            <button className="bg-white text-green-700 font-semibold rounded-full px-8 py-3 hover:bg-green-100 transition">
              Start Free
            </button>
          </Link>
        </div>
      </section>


      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-14">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Property Listing",
              icon: <Building2 className="w-10 h-10 text-green-700 mb-4" />,
              description: "List rooms, hostels, homes, and manage them in one place."
            },
            {
              title: "Automated Rent & Booking",
              icon: <Users className="w-10 h-10 text-green-700 mb-4" />,
              description: "Streamline tenant onboarding and automate rent cycles."
            },
            {
              title: "Dashboards & Insights",
              icon: <ArrowRight className="w-10 h-10 text-green-700 mb-4" />,
              description: "Get analytics and role-specific dashboards for control."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-xl flex flex-col justify-center items-center shadow hover:shadow-lg transition">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>


      {/* About Section */}
<section id="about" className="py-24 px-6 bg-white">
  <div className="max-w-6xl mx-auto md:flex justify-between items-center gap-12">
    {/* Text Content */}
    <div className="w-full md:w-1/2">
      <h2 className="text-4xl font-bold mb-4 text-gray-800">Why Choose AssetRentalPro?</h2>
      <p className="text-lg text-gray-600 mb-6">
        Managing rental assets shouldn’t be complicated. AssetRentalPro is built for property owners, managers, and tenants to streamline everything — from listings to invoicing.
      </p>
      <ul className="space-x-4 text-gray-700">
        {[
          {
            icon: "🏠",
            text: "Easily list and manage all property types — rooms, hostels, homes, or apartments."
          },
          {
            icon: "🔔",
            text: "Automated alerts for rent collection, tenant requests, and renewals."
          },
          {
            icon: "📊",
            text: "Powerful dashboard insights to monitor bookings and revenue in real-time."
          },
          {
            icon: "📱",
            text: "Mobile-optimized for both owners and tenants with a clean, modern UI."
          }
        ].map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-2xl">{item.icon}</span>
            <span className="text-base">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Image */}
    <div className="w-full md:w-1/2 mt-10 md:mt-0">
      <img
        src="https://i.pinimg.com/736x/46/76/52/467652059912c714c9538ff8a4eb6631.jpg"
        alt="About AssetRentalPro"
        className="mx-auto w-full max-w-md rounded-xl shadow-lg"
      />
    </div>
  </div>
</section>



      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-50 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Platform Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Room Management", icon: "📐" },
              { title: "Automated Invoicing", icon: "🧾" },
              { title: "Role-Based Dashboard", icon: "👤" },
              { title: "Mobile Optimized", icon: "📱" },
              { title: "Global Currency Support", icon: "💱" },
              { title: "Secure & Scalable", icon: "🔐" }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>


    

      {/* Stats Section */}
      <section id="stats" className="py-24 bg-white text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-20 text-green-700 text-4xl font-bold">
          <div className="flex flex-col items-center">
            <Users className="w-10 h-10 mb-2" />
            <p>12,000+ Users</p>
          </div>
          <div className="flex flex-col items-center">
            <Building2 className="w-10 h-10 mb-2" />
            <p>5,000+ Properties</p>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Get Started with AssetRentalPro</h2>
          <p className="text-lg mb-6">
            Join thousands of landlords and managers simplifying their workflows.
          </p>
          <Link href="/auth/signup">
            <button className="rounded-2xl text-lg px-8 py-4 bg-white text-green-700 hover:bg-green-100">
              Create Your Account
            </button>
          </Link>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 bg-white">
        © {new Date().getFullYear()} AssetRentalPro. All rights reserved.
      </footer>
    </main>
  );
}
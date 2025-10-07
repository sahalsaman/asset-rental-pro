"use client";

import { ArrowRight, Building2, Users, Menu, CheckCircle, Download, BookOpen, Key, Zap, ShieldCheck, FileText, LayoutDashboard, DollarSign, Briefcase, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import logo from "../../public/arp logo.png"
import about from "../../public/arp aboout.svg"
import playstore from "../../public/playstore.svg"
import appstore from "../../public/appstore.svg"
import Image from "next/image";
import { subscription_plans } from "@/utils/subscriptions-plans";

// 1. Define the Interface for Props
interface FAQItemProps {
  question: string;
  answer: string;
}

// 2. Use the Interface to Type the Component
const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-lg p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className="text-green-700">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600 p-2 pl-4 transition-all duration-300 ease-in-out">
          {answer}
        </p>
      )}
    </div>
  );
};


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-gray-800 ">
      {/* Navbar */}
      <header className="flex justify-between items-center px-4 md:px-24 py-4 shadow-md bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Logo" width={50} className='cursor-pointer' />
          <h1 className="text-lg md:text-2xl font-bold text-green-700">AssetRentalPro</h1>
        </div>
        <nav className="hidden md:flex space-x-4 md:space-x-6 items-center text-sm md:text-base">
          <Link href="#setup-guide">Setup Guide</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#downloads">Downloads</Link>
          <Link href="#faq">FAQ</Link>
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
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4 text-sm flex flex-col">
          <Link href="#setup-guide" onClick={() => setMenuOpen(false)}>Setup Guide</Link>
          <Link href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="#downloads" onClick={() => setMenuOpen(false)}>Downloads</Link>
          <Link href="#faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
          <Link href="/auth/login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link href="/auth/signup">
            <button className="bg-green-700 text-white w-full py-2 rounded-xl">Get Started</button>
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-green-700 bg-gradient-to-br from-green-700 to-green-900 text-white md:py-40 py-16 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="max-w-4xl mx-auto z-10 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Discover & Manage Your Rental Assets Effortlessly
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Simplify bookings, automate rent, and scale faster with our smart rental platform.
          </p>
          <Link href="/auth/signup">
            <button className="bg-white text-green-700 font-semibold rounded-full px-8 py-3 hover:bg-green-100 transition">
              Start Free
            </button>
          </Link>
        </div>
      </section>

      {/* Setup Guide Section */}
      <section id="setup-guide" className="py-12 md:py-24 px-6 w-full md:absolute top-[500px]">
        <div className="max-w-6xl mx-auto w-full md:flex justify-center">
          <h2 className="text-4xl font-bold mb-6 text-center text-green-700 block md:hidden">Quick Start Setup Guide</h2>
          <p className="text-xl text-gray-600 mb-12 text-center block md:hidden">
            Follow these simple steps to get your first property listed and automated in minutes!
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Create Account & Profile",
                icon: <Key className="w-8 h-8 text-white" />,
                description: "Sign up, verify your email, and complete your property manager or owner profile."
              },
              {
                step: 2,
                title: "List Your First Property",
                icon: <Building2 className="w-8 h-8 text-white" />,
                description: "Enter property details, add photos, and define rooms/units with their specific rates."
              },
              {
                step: 3,
                title: "Activate Rent Automation",
                icon: <ArrowRight className="w-8 h-8 text-white" />,
                description: "Connect your payment gateway and set up recurring invoicing cycles for your tenants."
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-2xl 
              shadow-gray-200 transition duration-300 hover:shadow-green-300/50">
                <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-gray-500 uppercase">Step {item.step}</p>
                <h3 className="text-xl font-bold mt-1 mb-3 text-green-800">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center block md:hidden">
            <Link href="/auth/signup">
              <button className="bg-green-700 text-white font-semibold rounded-xl px-8 py-4 hover:bg-green-800 transition flex items-center justify-center mx-auto space-x-2">
                <span>Start Setup Now</span>
                <BookOpen className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>


      <section id="about" className="py-12 md:py-24 px-6 bg-white md:mt-40">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row justify-between items-center gap-12">
          {/* Text Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-extrabold mb-6 text-gray-800  inline-block pb-1">Why Choose AssetRentalPro?</h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              We're more than just software. We're your partner in maximizing **Return on Investment (ROI)** by replacing manual, error-prone tasks with intelligent automation.
            </p>
            <ul className="space-y-8 text-gray-700">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-green-600" />,
                  text: <span className="text-lg font-bold">1-Click Maintenance Control:</span>,
                  detail: "Tenants log issues in 30 seconds. Managers assign vendors and track progress from initial report to invoice payment, all automated."
                },
                {
                  icon: <DollarSign className="w-6 h-6 text-green-600" />,
                  text: <span className="text-lg font-bold">Financial Automation:</span>,
                  detail: "Automated rent collection (ACH/Card), expense tracking, and **one-click 1099 generation** ensures flawless accounting every time."
                },
                {
                  icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
                  text: <span className="text-lg font-bold">High-Security Document Vault:</span>,
                  detail: "Military-grade cloud storage for leases and sensitive data, coupled with **role-based access** for maximum security."
                },
                {
                  icon: <TrendingUp className="w-6 h-6 text-green-600" />,
                  text: <span className="text-lg font-bold">Unmatched Transparency & Growth:</span>,
                  detail: "Dedicated Owner Portals and instant, customizable reports give you the data needed to make **smart portfolio decisions**."
                }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4 p-2">
                  <div className="p-2 bg-green-100 rounded-full">{item.icon}</div>
                  <div>
                    {item.text}
                    <p className="text-base text-gray-600 mt-1">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* NEW IMAGE */}
          <div className="w-full md:w-1/2 mt-10 md:mt-0">
            <Image src={about} alt="Logo" />
          </div>
        </div>
      </section>




      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-24 px-6 bg-slate-50 text-center">
        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-xl text-gray-600 mb-12">No hidden fees. Scale your portfolio with a plan that fits your needs.</p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscription_plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white p-8 rounded-xl shadow-2xl shadow-gray-200 border-2 ${plan.borderColor} relative`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                POPULAR
              </div>
            )}

            <h3 className="text-2xl font-bold text-green-700 mb-4">{plan.name}</h3>
            <p className="text-5xl font-extrabold mb-2">{plan.price}</p>
            <p className="text-gray-500 mb-6">{plan.period}</p>
            <p className="text-gray-600 mb-6">{plan.description}</p>

            <ul className="space-y-3 text-left mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center space-x-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link href={plan.buttonLink}>
              <button
                className={`${plan.buttonStyle} font-semibold w-full py-3 rounded-xl`}
              >
                {plan.buttonText}
              </button>
            </Link>
          </div>
        ))}
        </div>
      </section>

      {/* Downloads Section */}
      <section id="downloads" className="py-12 md:py-24 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Download Our Mobile App</h2>
          <p className="text-xl text-gray-600 mb-12">
            Manage your properties on the go! Our native mobile app for iOS and Android keeps you connected to your portfolio and tenants 24/7.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Image src={playstore} alt="Play Store" width={220} className=" cursor-pointer" />
            <Image src={appstore} alt="App Store" width={220} className=" cursor-pointer" />
          </div>

          {/* <div className="flex justify-center space-x-8">
            <div className="p-6 bg-gray-50 rounded-xl shadow-lg w-full max-w-sm">
                <Download className="w-8 h-8 text-green-700 mx-auto mb-3"/>
                <h3 className="text-2xl font-semibold mb-2">For Owners & Managers</h3>
                <p className="text-gray-600 mb-4">Full access to dashboards, invoicing, and maintenance requests.</p>
                <div className="space-y-3">
                    <button className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700">App Store (iOS)</button>
                    <button className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-600">Google Play (Android)</button>
                </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            {[
              {
                q: "What types of rental assets can I manage?",
                a: "You can manage virtually any type of rental property, including rooms, apartments, houses, entire hostels, and even commercial properties. Our system is flexible to support various unit configurations."
              },
              {
                q: "How does the automated invoicing work?",
                a: "Our system automatically generates and sends rent invoices to tenants on a scheduled cycle (monthly, quarterly, etc.). It tracks payment status and sends automated reminders for overdue payments, simplifying your collection process."
              },
              {
                q: "Is there a limit on the number of tenants or users?",
                a: "The user/tenant limit depends on your chosen plan. The Basic plan supports a small number of properties, while the Pro and Enterprise plans allow for significantly more, or unlimited, users and tenants."
              },
              {
                q: "Can I try AssetRentalPro before I subscribe?",
                a: "Yes! Our Basic plan is completely free and allows you to manage up to 5 properties, giving you a comprehensive feel for the platform's core features before committing to a paid subscription."
              }
            ].map((item, index) => (
              <FAQItem key={index} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section id="stats" className="py-12 md:py-24 bg-white text-center">
        <div className="flex flex-col md:flex-row justify-center items-center  gap-20 text-green-700">
          <div className="flex flex-col items-center">
            {/* <Users className="w-10 h-10 mb-2" /> */}
            <p className="text-2xl text-center md:text-left"><span className=" text-6xl font-extralight">20,000+ Users</span><br /></p>
          </div><span className="text-6xl font-extralight md:block hidden">|</span>
          <div className="flex flex-col items-center">
            {/* <Building2 className="w-10 h-10 mb-2" /> */}

            <p className="text-2xl text-center md:text-left"><span className=" text-6xl font-extralight">1000+ Properties</span><br /></p>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-green-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow">Ready to Take Control?</h2>
          <p className="text-xl mb-8 text-green-100 px-2">
            Join thousands of landlords and managers simplifying their workflows and maximizing their profit today.
          </p>
          <Link href="/auth/signup">
            <button className="rounded-full text-md px-8 py-4 bg-white text-green-700 font-semibold hover:bg-green-100 transition shadow-lg transform hover:scale-105">
              Create Your Free Account
            </button>
          </Link>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 bg-white">
        © {new Date().getFullYear()} WEBCOS. All rights reserved.
      </footer>
    </main>
  );
}
"use client";

import { ArrowRight, Building2, Users, Menu, CheckCircle, Download, BookOpen, Key, Zap, ShieldCheck, FileText, LayoutDashboard, DollarSign, Briefcase, TrendingUp, SidebarClose, X, PhoneIcon, MailIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import about from "../../public/arp aboout.png"
import home_banner from "../../public/home_banner_image.png"
import playstore from "../../public/playstore.svg"
import appstore from "../../public/appstore.svg"
import Image from "next/image";
import { defaultData, subscription_plans } from "@/utils/data";
import { app_config } from "../../app-config";
import toast from "react-hot-toast";
import PropertyTypeSlider from "@/components/PropertiesSlider";

// 1. Define the Interface for Props
interface FAQItemProps {
  question: string;
  answer: string;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    setSubscriptionPlans(subscription_plans)
  }, [])



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Your message has been sent successfully!");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  if (menuOpen) {
    return (
      <div className="bg-white  px-6 py-4 space-y-8 text-xl text-center flex flex-col">
        <div className="flex justify-between mb-10">
          <div className="flex items-center gap-3">
            <Image src={app_config.APP_LOGO} alt="Logo" width={40} className='cursor-pointer' />
          </div>
          <button className="" onClick={() => setMenuOpen(!menuOpen)}>
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
    <main className="min-h-screen bg-white text-gray-800 ">
      {/* Navbar */}

      <header className="flex justify-between items-center px-4 md:px-24 py-4 md:py-4 shadow-md bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src={app_config.APP_LOGO} alt="Logo" className='w-6 h-6 sm:w-8 sm:h-8 cursor-pointer' />
          <h1 className="text-xl md:text-3xl font-bold text-green-700">{app_config?.APP_NAME}</h1>
        </div>
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

      {/* Hero Section */}
      <section className={`relative bg-green-700 bg-gradient-to-br from-green-700 to-green-900 text-white overflow-hidden py-28 md:py-18 px-6 text-center md:text-left`}  >
        <div className="max-w-6xl mx-auto z-10 flex justify-between items-center gap-10">
          <div className="">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
              Discover & Manage Your Rental Assets Effortlessly
            </h1>
            <p className="text-lg md:text-xl mb-4 text-gray-100">
              Simplify bookings, automate rent, and scale faster with our smart rental platform.
            </p>
            <Link href="/auth/signup">
              <button className="bg-white text-green-700 font-semibold rounded-full px-8 py-3 hover:bg-green-100 transition">
                Start Free
              </button>
            </Link>
          </div>
          <div className="hidden md:block w-full sm:min-w-[550px] max-w-[550px]">
            <Image src={home_banner} alt="banner" className="w-full max-w-[550px] drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Setup Guide Section   md:absolute top-[500px]  block md:hidden*/}
      <section id="setup-guide" className="py-12 md:py-24 px-6 w-full ">
        <div className="max-w-6xl mx-auto w-full ">
          <h2 className="text-4xl font-bold mb-6 text-center text-green-700">Quick Start Setup Guide</h2>
          <p className="text-xl text-gray-600 mb-12 text-center ">
            Follow these simple steps to get your first property listed and automated in minutes!
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Create Account & Profile",
                icon: <Key className="w-8 h-8 text-white" />,
                description: "Sign up, verify your phone number, and complete owner profile."
              },
              {
                step: 2,
                title: "List Your First Property",
                icon: <Building2 className="w-8 h-8 text-white" />,
                description: "Enter property details, add photos, and define units/rooms with their specific rates."
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
        </div>
      </section>


      <section id="about" className="py-12 md:py-24 px-6 bg-white ">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row justify-between items-center gap-12">
          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-5xl font-extrabold mb-4 text-gray-700  inline-block">Why Choose </h2>
            <h2 className="text-5xl font-extrabold mb-8 text-green-700  inline-block pb-1 pl-3"> {app_config?.APP_NAME} ?</h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              We're more than just software. We're your partner in maximizing **Return on Investment (ROI)** by replacing manual, error-prone tasks with intelligent automation.
            </p>

          </div>

          {/* NEW IMAGE */}
          <div className="w-full md:w-1/2 mt-10 md:mt-0">
            <Image src={about} alt="Logo" className="rounded-4xl" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10">
          <div className="space-y-8 text-gray-700 grid  grid-cols-1 md:grid-cols-2">
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
              <div key={index} className="flex items-start gap-4 p-2">
                <div className="p-2 bg-green-100 rounded-full">{item.icon}</div>
                <div>
                  {item.text}
                  <p className="text-base text-gray-600 mt-1">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PropertyTypeSlider />


      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-24 px-6 bg-slate-50 text-center">
        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-xl text-gray-600 mb-12">No hidden fees. Scale your portfolio with a plan that fits your needs.</p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptionPlans.map((plan, index) => (
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
                {plan.features.map((feature: any, i: any) => (
                  <li key={i} className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 min-w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* <Link href={plan.buttonLink}>
              <button
                className={`${plan.buttonStyle} font-semibold w-full py-3 rounded-xl`}
              >
                {plan.buttonText}
              </button>
            </Link> */}
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

      {/* Stats Section */}
      <section id="stats" className="py-12 md:py-24 bg-green-700 bg-gradient-to-br from-green-600 to-green-800 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-30 text-white max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            {/* <Users className="w-10 h-10 mb-2" /> */}
            <p className="text-xl md:text-2xl text-center">
              <span className="text-5xl md:text-6xl font-bold">1,300+</span><br />
              <span>Properties</span>
            </p>
          </div>
          <div className="flex flex-col items-center">
            {/* <Building2 className="w-10 h-10 mb-2" /> */}
            <p className="text-xl md:text-2xl text-center">
              <span className="text-5xl md:text-6xl font-bold">98.5%</span><br />
              <span className="text-nowrap">Average Occupainy Rate</span>
            </p>
          </div>
          <div className="flex flex-col items-center">
            {/* <Building2 className="w-10 h-10 mb-2" /> */}

            <p className="text-xl md:text-2xl text-center">
              <span className="text-5xl md:text-6xl font-bold">4.9/5</span><br />
              <span className="text-nowrap">Owner Satisfaction Rating</span>
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 md:py-24  px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 mb-12">
            Real stories from property owners and managers using {app_config.APP_NAME}.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Santhosh Reddy",
                role: "Property Owner, Bengaluru",
                review:
                  "This platform has simplified my rent collection and maintenance tracking. Everything is automated — I don’t have to follow up manually anymore!",
                rating: 5,
              },
              {
                name: "Sara Thomas",
                role: "Manager, Mumbai",
                review:
                  "The dashboard is intuitive and the support team is excellent. I manage multiple apartments easily from one place!",
                rating: 5,
              },
              {
                name: "Mohammed Rafi",
                role: "Building Owner, Kochi",
                review:
                  "Highly recommend it for small business owners like me. The invoicing system and reports are a game-changer.",
                rating: 4,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg text-left flex flex-col justify-between hover:shadow-green-200 transition"
              >
                <p className="text-gray-700 italic mb-6">“{item.review}”</p>
                <div>
                  <div className="flex items-center mb-2">
                    {[...Array(item.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
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
                a: "You can manage virtually any type of rental property, including units, apartments, houses, entire hostels, and even commercial properties. Our system is flexible to support various unit configurations."
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
                q: `Can I try ${app_config?.APP_NAME} before I subscribe?`,
                a: "Yes! Our Basic plan is 14 days free and allows you to manage 1 property, giving you a comprehensive feel for the platform's core features before committing to a paid subscription."
              }
            ].map((item, index) => (
              <FAQItem key={index} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-12">
            Have questions, feedback, or partnership inquiries? We'd love to hear from you!
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="text-left space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <PhoneIcon className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Phone</h3>
                  <p className="text-gray-600">{app_config.PHONE_NUMBER}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MailIcon className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <p className="text-gray-600">{app_config.EMAIL}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPinIcon className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Address</h3>
                  <p className="text-gray-600">{app_config.ADDRESS}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form
              onSubmit={handleSubmit}
              className=" p-8 rounded-2xl border space-y-4 text-left"
            >
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Name*</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Phone* <span className="font-medium">(eg: {defaultData.countryCodes} 987XXXXXXX)</span></label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Your Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Message*</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-600 focus:outline-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full cursor-pointer ${loading ? "bg-green-400" : "bg-green-700 hover:bg-green-800"
                  } text-white font-semibold py-3 rounded-xl transition`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 px-10 bg-green-700 text-white text-center">
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
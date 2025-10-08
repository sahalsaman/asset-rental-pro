"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscription_plans } from "@/utils/mock-data";
import { CheckCircle, Ticket } from "lucide-react";
import { apiFetch } from "@/lib/api";  // Your API utility (or use axios directly)
import Script from "next/script";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { IUser } from "@/app/types";
import { Anybody } from "next/font/google";
// import { useToaster } from "react-hot-toast";

export default function SubscriptionPlan() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [activeSub, setActiveSub] = useState<any | null>(null);
  const current_property = localStorageServiceSelectedOptions.getItem()

  const fetchUser = async () => {
    const res = await apiFetch("/api/user");
    const data = await res.json();
    setUser(data);
  };

  const fetchSucscription = async () => {
    fetch("/api/subscription")
      .then((res) => res.json())
      .then(setActiveSub);
  };

  useEffect(() => {
    fetchUser();
    fetchSucscription()
  }, []);



  const handlePlanSelect = async (plan: any) => {
    setLoading(true);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.id,
          amount: plan.amount,
        }),
      });

      const { orderId, key } = await res.json(); // ✅ get key from backend

      const options = {
        key, // ✅ secure dynamic key
        amount: plan.amount * 100,
        currency: "INR",
        name: "AssetRentalPro",
        description: `${plan.name} Plan Subscription`,
        order_id: orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/subscription", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              organisationId: current_property?._id,
              plan: plan.name,
            }),
          });

          const result = await verifyRes.json();
          if (result.success) alert("✅ Payment successful!");
          else alert("❌ Payment verification failed.");
        },
        prefill: {
          name: user?.firstName,
          email: `${user?.firstName}@email.com`,
          contact: user?.phone,
        },
        theme: {
          color: "#2563EB",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error(error);
      alert("Error initiating payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
  {  activeSub?  <div className="bg-amber-300 py-2 px-4 flex items-center justify-between">Active plan  
        <div className="bg-amber-400 py-1 px-4 rounded-lg font-bold text-sm flex items-center gap-1">{activeSub?.plan}</div></div>:""}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <section id="pricing" className="py-8 md:py-24 px-4 sm:px-6 bg-slate-50 text-left">
        <h2 className="text-2xl sm:text-2xl font-bold mb-2">Pricing Plans</h2>
        <p className="text-sm sm:text-md text-gray-600 mb-6 max-w-md mx-auto">
          No hidden fees. Scale your portfolio with a plan that fits your needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl sm:max-w-6xl mx-auto">
          {subscription_plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg md:shadow-2xl shadow-gray-200 border-2 ${plan.borderColor} relative overflow-hidden`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-bl-xl">
                  POPULAR
                </div>
              )}

              <h3 className="text-xl md:text-2xl font-bold text-green-700 text-center">{plan.name}</h3>

              <div className="flex flex-col gap-4 md:flex-row md:gap-6 mb-6 md:mb-8">
                <div className="text-center md:text-left">
                  <p className="text-4xl sm:text-5xl font-extrabold mb-1">{plan.price}</p>
                  <p className="text-gray-500 text-sm sm:text-base">{plan.period}</p>
                </div>

                <div className="flex-1">
                  <ul className="space-y-2 sm:space-y-3 text-left text-sm sm:text-base">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handlePlanSelect(plan)}
                className={`${plan.buttonStyle} font-semibold w-full py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-50`}
                disabled={loading}
              >{plan.buttonText}
                {loading ? "Processing..." : plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
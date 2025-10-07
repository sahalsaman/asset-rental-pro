"use client";

import Link from "next/link";
import { subscription_plans } from "@/utils/mock-data";
import { CheckCircle } from "lucide-react";

export default function SubscriptionPlan() {
  return (
    <div className="min-h-screen bg-gray-50">
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
                {/* Price Section - Stacks on mobile, aligns left on desktop */}
                <div className="text-center md:text-left">
                  <p className="text-4xl sm:text-5xl font-extrabold mb-1">{plan.price}</p>
                  <p className="text-gray-500 text-sm sm:text-base">{plan.period}</p>
                </div>
                
                {/* Features - Full width on mobile */}
                <div className="flex-1">
                  {/* Optional: Uncomment if needed
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{plan.description}</p> */}
                  
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

              <Link href={plan.buttonLink}>
                <button
                  className={`${plan.buttonStyle} font-semibold w-full py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all duration-200 hover:shadow-md active:scale-95`}
                >
                  {plan.buttonText}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
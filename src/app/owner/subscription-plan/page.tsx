"use client";

import { useEffect, useState } from "react";
import { ArrowRightCircle, CheckCircle, ChevronRight, CircleChevronRight, Ticket } from "lucide-react";
import { apiFetch } from "@/lib/api";  // Your API utility (or use axios directly)
import Script from "next/script";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { IUser } from "@/app/types";
import { FullscreenLoader } from "@/components/Loader";
import { SubscritptionStatus } from "@/utils/contants";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { subscription_plans } from "@/utils/mock-data";
// import { useToaster } from "react-hot-toast";

export default function SubscriptionPlan() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [activeSub, setActiveSub] = useState<any | "">("");
  const [openDetailPopup, setOpenDetailPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([])

  const current_property = localStorageServiceSelectedOptions.getItem()?.property

  const fetchUser = async () => {
    const res = await apiFetch("/api/me");
    const data = await res.json();
    setUser(data);
  };

  const fetchSucscription = async () => {
    const res = await apiFetch("/api/subscription");
    const data = await res.json();
    setActiveSub(data);
    if (data.status) {
      setSubscriptionPlans(subscription_plans.slice(1, 4))
    } else {
      setSubscriptionPlans(subscription_plans)
    }
  };

  // const fetchSucscriptionPlans = async () => {
  //   fetch("/api/subscription/plans")
  //     .then((res) => res.json())
  //     .then(setSubscription_plans);
  // };


  useEffect(() => {
    // fetchSucscriptionPlans()
    fetchUser();
    fetchSucscription()
  }, []);


  const handlePlanSelect = async (plan: any) => {
    if (plan.id === "arp_subcription_cus74") {
      window.location.href = "/contact"
    }

    setOpenDetailPopup(false);
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

      const result = await res.json(); // ✅ get key from backend

      if (result && plan.id == "arp_subcription_trial") {
        toast.success("You have successfully activated the Free Trial plan.");
        window.location.href = "/owner/dashboard"
        return
      }

      const options = {
        key: result?.key, // ✅ secure dynamic key
        amount: plan.amount * 100,
        currency: "INR",
        name: "AssetRentalPro",
        description: `${plan.name} Plan Subscription`,
        order_id: result?.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/subscription/paid", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              organisationId: user?.organisationId?._id,
              plan: plan.id,
            }),
          });

          const result = await verifyRes.json();
          if (result.success) {
            toast.success("✅ Payment successful!");
            window.location.reload()
          }
          else toast("❌ Payment verification failed.");
        },
        prefill: {
          name: user?.firstName,
          email: `${user?.firstName}@${user?.organisationId?.name}.com`,
          contact: `${user?.countryCode}${user?.phone}`,
        },
        theme: {
          color: "#2563EB",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error(error);
      toast("Error initiating payment");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <FullscreenLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <section id="pricing" className="py-6 md:py-24 md:px-32 px-5 bg-slate-50 text-left">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl sm:max-w-6xl mx-auto">
          {subscriptionPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg md:shadow-2xl shadow-gray-200 border-2  relative overflow-hidden`}
              onClick={() => { setSelectedPlan(plan); setOpenDetailPopup(true); }}
            >{activeSub?.plan==plan?.name?
              <div className="absolute top-0 right-0 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-bl-xl">
                CURRENT PLAN
              </div>
              :""
            }
              <div className="flex justify-between items-center">
                <div className="">
                  <h3 className="text-md md:text-2xl font-semibold text-green-700">{plan.name}</h3>
                  <p className="text-gray-500 text-sm sm:text-base">{plan.features[0] == "14 days free trial" ? plan.features[1] : plan.features[0]}</p>
                  <p className="text-gray-500 text-sm sm:text-base">{plan.features[0] == "14 days free trial" ? plan.features[2] : plan.features[1]}</p>
                </div>
                <div className={`${!plan.no_price && 'border-l-1'} pl-5 flex`}>
                  {!plan.no_price ? <div>
                    <p className="text-2xl sm:text-5xl font-extrabold">{plan.price}</p>
                    <p className="text-gray-500 text-sm sm:text-base">{plan.period}</p>
                  </div> : ""}
                  <ChevronRight size={50} className="text-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Dialog open={openDetailPopup} onOpenChange={setOpenDetailPopup}>
        <DialogContent>
          <DialogTitle>Plan Detail</DialogTitle>
          <div
            className={`bg-white  ${selectedPlan?.borderColor} relative overflow-hidden`}
          >
            {selectedPlan?.highlight && (
              <div className="absolute top-0 right-0 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-bl-xl">
                POPULAR
              </div>
            )}

            <h3 className="text-xl md:text-2xl font-bold text-green-700 text-center">{selectedPlan?.name}</h3>
            <div className="flex flex-col gap-4 md:flex-row md:gap-6 mb-6 md:mb-8">
              <div className="text-center md:text-left">
                <p className="text-4xl sm:text-5xl font-extrabold mb-1">{selectedPlan?.price}</p>
                <p className="text-gray-500 text-sm sm:text-base">{selectedPlan?.period}</p>
              </div>

              <div className="flex-1">
                <ul className="space-y-2 sm:space-y-3 text-left text-sm sm:text-base">
                  {selectedPlan?.features.map((feature: any, i: any) => (
                    <li key={i} className="flex items-start space-x-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => handlePlanSelect(selectedPlan)}
              className={`${selectedPlan?.buttonStyle} font-semibold w-full py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-50`}
              disabled={loading}>
              {loading ? "Processing..." : selectedPlan?.buttonText}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
"use client";

import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { countryCodes, defaultData } from "@/utils/data";
import { app_config } from "../../../../app-config";
import { Button } from "@/components/ui/button";
import IndianFlag from "../../../../public/indian-flag.png";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);
  const [countryCode, setCountryCode] = useState(defaultData.countryCodes); // Default to India
  const [mobileNumberValidationMessage, setMobileNumberValidationMessage] = useState("");
  const router = useRouter();
  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/; // Validates 10-digit phone number
    return phoneRegex.test(phoneNumber);
  };

  const sendOtp = async () => {
    setMobileNumberValidationMessage("");

    if (!phone) {
      setMobileNumberValidationMessage("Phone number is required.");
      return;
    }

    if (!countryCode) {
      setMobileNumberValidationMessage("Country code is required.");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setMobileNumberValidationMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    setButtonLoader(true)
    try {
      const res = await login(phone, countryCode);
      toast.success("OTP sent successfully via Whatsapp!");
      router.push(`/verify-otp?phone=${phone}&countryCode=${encodeURIComponent(countryCode)}`);
      setButtonLoader(false)
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("Login error:", err);
      }
      setButtonLoader(false)
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6 w-full">
        <div className="text-center mb-10">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
          {/* <p className="text-sm text-gray-600">Sign in to manage your properties securely with ease.</p> */}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">Phone Number</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="tel"
                placeholder="9876XXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 w-full px-4 py-3 pl-18 bg-green-50/50 border border-green-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
                maxLength={10}
              />
              <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-700 font-medium">
                <span className="flex items-center gap-1">
                  <Image src={IndianFlag} alt="Flag" width={20} /> +91
                </span>
              </div>
            </div>
          </div>
          {mobileNumberValidationMessage && (
            <p className="text-red-500 text-sm mt-1 ml-1">{mobileNumberValidationMessage}</p>
          )}
        </div>

        <Button
          onClick={sendOtp}
          className="w-full py-6 bg-green-700 hover:bg-green-800 text-white rounded-xl text-lg font-semibold shadow-lg shadow-green-700/20 transition-all duration-200 mt-4"
          loading={buttonLoader}
        >
          Sign In
        </Button>

        <p className="text-sm text-gray-500 text-center md:hidden">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-700 font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
      <p className="text-xs text-gray-400 text-center mt-12">
        By logging in, you agree to our{" "}
        <a href="/privacy" target="_blank" className="text-green-600 hover:underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/terms" target="_blank" className="text-green-600 hover:underline">
          Terms of Service
        </a>.
      </p>
    </div>

  );
}
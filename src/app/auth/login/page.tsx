"use client";

import { sendOtpApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import logo from "../../../../public/arp logo.png"
import Image from "next/image";
import { log } from "node:console";
import { countryCodes } from "@/utils/mock-data";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default to India
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

    try {
      const res=await sendOtpApi(phone, countryCode);
      toast.success("Your OTP : "+res.data.data.otp);
      // toast.success("OTP sent successfully!");
      router.push(`/auth/verify-otp?phone=${phone}&countryCode=${encodeURIComponent(countryCode)}`);
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("Login error:", err);
      }
    }
  };

  return (
    <div className="bg-green-700 bg-gradient-to-br from-green-700 to-green-900 ">
      <div className="h-60 flex justify-center items-center">
        <h2 className="text-3xl font-bold text-white text-center mb-4 ">Welcome to Asset Management</h2>
      </div>
      <div className="absolute w-full" style={{ marginTop: "-35px" }}>
        <div className="flex justify-center items-center w-full">
        <div className="w-full max-w-[450px] flex flex-col items-center justify-between h-full bg-white py-10 px-5 rounded-4xl sm:shadow-2xl">
          <div className="space-y-6 w-full">
            <div className="flex justify-center items-center"> <Image src={logo} alt="" width={100} /></div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-green-700 mb-2">Enter Your Phone Number</h2>
              {/* <p className="text-sm text-gray-600">Sign in to manage your properties securely with ease.</p> */}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-20  px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  style={{ maxWidth: '80px' }}
                >
                  {countryCodes.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              {mobileNumberValidationMessage && (
                <p className="text-red-500 text-sm mt-1">{mobileNumberValidationMessage}</p>
              )}
            </div>

            <button
              onClick={sendOtp}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
            >
              Send OTP
            </button>

            <p className="text-sm text-gray-600 text-center">
              Don’t have an account?{" "}
              <a href="/auth/signup" className="text-green-600 hover:underline">
                Sign up here
              </a>
            </p>
          </div>
          <p className="text-xs text-gray-500 text-center mt-10">
            By logging in, you agree to our{" "}
            <a href="/privacy" className="text-green-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-green-600 hover:underline">
              Terms of Service
            </a>.
          </p>
        </div>
      </div>
</div>
    </div>
  );
}
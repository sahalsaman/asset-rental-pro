"use client";

import { sendOtpApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [mobileNumberValidationMessage, setMobileNumberValidationMessage] = useState("");
    const router = useRouter();



  const sendOtp = async () => {
    try {
      await sendOtpApi(phone);
      router.push(`/auth/verify-otp?phone=${phone}`);
    } catch (err: any) {
        if (err?.response?.data?.error) {
        toast.error(err?.response?.data?.error)
        return;
      }
      console.error("Login error:", err);
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-00 to-green-50">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
       Login
        </h2>
        <>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {mobileNumberValidationMessage && <p className="text-red-500 text-sm">*{mobileNumberValidationMessage}</p>}
          <button
            onClick={sendOtp}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 mt-4"
          >
            Send OTP
          </button>

          <a href="/auth/signup" className="pt-5 w-full text-right text-sm text-gray-700 underline ">Signup</a>
        </>

      </div>
    </div>
  );
}

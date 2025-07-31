"use client";

import api, { sendOtpApi, verifyOtpApi } from "@/lib/api";
import { Metadata } from "next";
import { NextResponse } from "next/server";
import { useState } from "react";


export default function LoginPage() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [mobileNumberValidationMessage, setMobileNumberValidationMessage] = useState("");

  

  const sendOtp = async () => {
    try {
      await sendOtpApi(phone);
      setStep("otp");
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };
  
  const verifyOtp = async () => {
    try {
      const res = await verifyOtpApi(phone, otp);
      const role = res.data.role;
  
      if (role === "admin") window.location.href = "/admin/dashboard";
      else if (role === "owner") window.location.href = "/owner/dashboard";
      else window.location.href = "/user/dashboard";
      const response = NextResponse.json({ role: role });
      response.cookies.set("ARP_Token", "your-jwt-or-session-token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
      return response
    } catch (err: any) {
      console.error("OTP verification failed", err);
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-00 to-green-50">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          {step === "phone" ? "Login" : "Enter OTP"}
        </h2>

        {step === "phone" ? (
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
            {mobileNumberValidationMessage&&<p className="text-red-500 text-sm">*{mobileNumberValidationMessage}</p>}
            <button
              onClick={sendOtp}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 mt-4"
            >
              Send OTP
            </button>

            <a href="/auth/signup" className="pt-5 w-full text-right text-sm text-gray-700 underline ">Signup</a>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Verify OTP
            </button>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Didn't receive it?{" "}
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={() => setStep("phone")}
              >
                Try Again
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

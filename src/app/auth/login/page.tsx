"use client";

import { useState } from "react";

export default function LoginPage() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [mobileNumberValidationMessage, setMobileNumberValidationMessage] = useState("");

  const sendOtp = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });
  
    if (res.ok) {
      setStep("otp");
    } else {
      const errorData = await res.json();
      setMobileNumberValidationMessage(errorData.message || "Something went wrong");
    }
  };
  

  const verifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });

    const data = await res.json();
    if (res.ok) {
      if (data.role === "admin") location.href = "/admin/dashboard";
      if (data.role === "owner") location.href = "/owner/dashboard";
      if (data.role === "user") location.href = "/user/dashboard";
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

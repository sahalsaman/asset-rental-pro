"use client";

import api from "@/lib/api";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import logo from "../../../../public/arp logo.png";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { UserRoles } from "@/utils/contants";

export default function VerifyOTPPage() {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [otp, setOtp] = useState("");

  // Get phone only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("phone") || "";
      const c = new URLSearchParams(window.location.search).get("countryCode") || "";
      setPhone(p);
      setCountryCode(c);
    }
  }, []);

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      const res = await api.post("/auth/verify-otp", { phone, countryCode, otp });
      const role = res.data.role;

      if (role === UserRoles.ADMIN) location.href = "/admin/dashboard";
      else if (role === UserRoles.OWNER||role === UserRoles.MANAGER) location.href = "/owner/dashboard";
      else location.href = "/user/dashboard";

      toast.success("Logged in successfully!");
    } catch (err: any) {
      if (err?.response?.data?.error) {
        toast.error(err?.response?.data?.error);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("OTP verify error:", err);
      }
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
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

                <h2 className="text-3xl font-bold text-green-700 mb-2">Verify Your OTP</h2>
                <p className="text-sm text-gray-600">
                  {countryCode && phone
                    ? `We’ve sent an OTP to ${countryCode}${phone}`
                    : "We’ve sent an OTP to your phone number"}
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyOtp();
                }}
                className="space-y-4"
              >
                <div>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    className="w-full"
                  >
                    <InputOTPGroup className="w-full flex justify-center">
                      <InputOTPSlot index={0} className="border-gray-300" />
                      <InputOTPSlot index={1} className="border-gray-300" />
                      <InputOTPSlot index={2} className="border-gray-300" />
                      <InputOTPSlot index={3} className="border-gray-300" />
                      <InputOTPSlot index={4} className="border-gray-300" />
                      <InputOTPSlot index={5} className="border-gray-300" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
                >
                  Verify OTP
                </button>
              </form>

              <p className="text-sm text-gray-600 text-center">
                Didn’t receive it?{" "}
                <a href="/auth/login" className="text-green-600 hover:underline">
                  Resend OTP
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
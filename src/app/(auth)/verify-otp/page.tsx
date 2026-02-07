"use client";

import api, { login } from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { UserRoles } from "@/utils/contants";
import { app_config } from "../../../../app-config";
import { Button } from "@/components/ui/button";

export default function VerifyOTPPage() {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [otp, setOtp] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("phone") || "";
      const c = new URLSearchParams(window.location.search).get("countryCode") || "";
      setPhone(p);
      setCountryCode(c);
    }
  }, []);


  const resendOtp = async () => {
    if (!phone || !countryCode) {
      toast.error("Phone or country code missing from URL");
      return;
    }

    setButtonLoader(true);
    try {
      await login(phone, countryCode);
      toast.success("OTP sent successfully via Whatsapp!");
      setButtonLoader(false);
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("Login error:", err);
      }
      setButtonLoader(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    setButtonLoader(true);
    try {
      const res = await api.post("/auth/verify-otp", { phone, countryCode, otp });
      const role = res.data.role;

      if (role === UserRoles.OWNER || role === UserRoles.MANAGER) location.href = "/owner/dashboard";
      else location.href = "/user/dashboard";

      toast.success("Logged in successfully!");
      setButtonLoader(false);
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("OTP verify error:", err);
      }
      setButtonLoader(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6 w-full">
        <div className="text-center mb-8">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
          <p className="text-sm text-gray-500">
            {countryCode && phone
              ? `We’ve sent a code to ${countryCode} ${phone}`
              : "We’ve sent a code to your phone number"}
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtp();
          }}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              className="w-full"
            >
              <InputOTPGroup className="gap-2 sm:gap-4">
                <InputOTPSlot index={0} className="w-10 h-12 sm:w-12 sm:h-14 border-green-200 bg-green-50 text-lg rounded-lg focus:border-green-600 focus:ring-green-600/20" />
                <InputOTPSlot index={1} className="w-10 h-12 sm:w-12 sm:h-14 border-green-200 bg-green-50 text-lg rounded-lg focus:border-green-600 focus:ring-green-600/20" />
                <InputOTPSlot index={2} className="w-10 h-12 sm:w-12 sm:h-14 border-green-200 bg-green-50 text-lg rounded-lg focus:border-green-600 focus:ring-green-600/20" />
                <InputOTPSlot index={3} className="w-10 h-12 sm:w-12 sm:h-14 border-green-200 bg-green-50 text-lg rounded-lg focus:border-green-600 focus:ring-green-600/20" />
                <InputOTPSlot index={4} className="w-10 h-12 sm:w-12 sm:h-14 border-green-200 bg-green-50 text-lg rounded-lg focus:border-green-600 focus:ring-green-600/20" />
                <InputOTPSlot index={5} className="w-10 h-12 sm:w-12 sm:h-14 border-green-200 bg-green-50 text-lg rounded-lg focus:border-green-600 focus:ring-green-600/20" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            className="w-full py-6 bg-green-700 hover:bg-green-800 text-white rounded-xl text-lg font-semibold shadow-lg shadow-green-700/20 transition-all duration-200"
            loading={buttonLoader}
          >
            Verify & Login
          </Button>
        </form>

        <p className="text-sm text-gray-500 text-center">
          Didn’t receive it?{" "}
          <button
            onClick={resendOtp}
            className="text-green-700 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Resend OTP
          </button>
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
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
      toast.success("OTP sent successfully via WhatsApp!");
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

      if (role === UserRoles.ADMIN) location.href = "/admin/dashboard";
      else if (role === UserRoles.OWNER || role === UserRoles.MANAGER) location.href = "/owner/dashboard";
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

  function startWhatsAppVerification() {
    window.open('https://wa.me/919074793799?text=Hi Rentities', '_blank');
  }

  return (
    <div className="bg-green-700 bg-gradient-to-br from-green-700 to-green-900 h-[100vh]">
      <div className="h-3/12 flex justify-center items-center ">
        <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={50} className='cursor-pointer block sm:hidden' />
      </div>
      <div className="sm:flex justify-center items-center w-full h-9/12 sm:h-fit bg-white sm:bg-transparent rounded-tl-2xl rounded-tr-2xl" >
        <div className="pt-20 sm:pt-0 w-full sm:w-fit  bg-white rounded-4xl sm:shadow-2xl">
          <div className="w-full max-w-[450px]  h-full px-6 sm:p-10 ">
            <div className="space-y-4 w-full">
              <div className="text-center mb-8">

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

                <Button
                  type="submit"
                  variant={"green"}
                  className="w-full  py-3 transition duration-200  font-semibold h-12"
                  loading={buttonLoader}
                >
                  Verify OTP
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-5  text-gray-600"
                  onClick={startWhatsAppVerification}
                  disabled={buttonLoader}
                >
                  Send OTP via WhatsApp
                </Button>
              </form>

              <p className="text-sm text-gray-600 text-center">
                Didn’t receive it?{" "}
                <a onClick={resendOtp} className="text-green-600 hover:underline cursor-pointer">
                  Resend OTP
                </a>
              </p>

            </div>
            <p className="text-xs text-gray-500 text-center mt-10">
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
        </div>
      </div>
    </div>

  );
}
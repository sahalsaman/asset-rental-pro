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
      router.push(`/auth/verify-otp?phone=${phone}&countryCode=${encodeURIComponent(countryCode)}`);
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
    <div className="bg-green-700 bg-gradient-to-br from-green-700 to-green-900 h-[100vh]">
      <div className="h-3/12 flex justify-center items-center ">
        <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={50} className='cursor-pointer block sm:hidden' />
      </div>
      <div className="sm:flex justify-center items-center w-full h-9/12 sm:h-fit bg-white sm:bg-transparent rounded-tl-2xl rounded-tr-2xl" >
        <div className="pt-20 sm:pt-0 w-full sm:w-fit  bg-white rounded-4xl sm:shadow-2xl">
          <div className="w-full max-w-[450px]  h-full px-6 sm:p-10 ">
            <div className="space-y-6 w-full">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-green-700 mb-2">Enter Your<br /> Phone Number</h2>
                {/* <p className="text-sm text-gray-600">Sign in to manage your properties securely with ease.</p> */}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      placeholder="9876XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 w-full px-4 py-2 pl-18 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      maxLength={10}
                    />
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-900">
                      <span className="flex items-center gap-1">
                        <Image src={IndianFlag} alt="Flag" width={20} /> +91
                      </span>
                    </div>
                  </div>
                </div>
                {mobileNumberValidationMessage && (
                  <p className="text-red-500 text-sm mt-1">{mobileNumberValidationMessage}</p>
                )}
              </div>

              <Button
                onClick={sendOtp}
                variant={"green"}
                className="w-full  py-3 transition duration-200  font-semibold h-12"
                loading={buttonLoader}
              >
                Send OTP
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Don’t have an account?{" "}
                <a href="/auth/signup" className="text-green-600 hover:underline">
                  Sign up here
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
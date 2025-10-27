"use client";

import { signUp } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { countryCodes, defaultData } from "@/utils/data";
import { app_config } from "@/utils/app-config";

export default function LoginPage() {

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [countryCode, setCountryCode] = useState(defaultData.countryCodes); // Default to India
  const router = useRouter();
  const [mobileNumberValidationMessage, setMobileNumberValidationMessage] = useState("");
  const [nameValidationMessage, setNameValidationMessage] = useState("");
  const [organisationValidationMessage, setOrganisationValidationMessage] = useState("");


  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/; // Validates 10-digit phone number
    return phoneRegex.test(phoneNumber);
  };
  // In sendOtp:
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
      const res= await signUp(phone, countryCode, name,lastName ,organisationName)
      console.log("res..",res);
      toast.success("OTP sent successfully!");
      router.push(`/auth/verify-otp?phone=${phone}&countryCode=${encodeURIComponent(countryCode)}`);
    } catch (err: any) {
        if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("Login error:", err);
      }
      console.error("Signup error:", err);
    }
  };

  return (

    <div className="bg-green-700 bg-gradient-to-br from-green-700 to-green-900 h-[100vh]">
      <div className="h-3/12 flex justify-center items-center ">
        <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={50} className='cursor-pointer block sm:hidden' />
      </div>
      <div className="sm:flex justify-center items-center w-full h-9/12 sm:h-fit bg-white sm:bg-transparent rounded-tl-2xl rounded-tr-2xl" >
        <div className="pt-10 sm:pt-0 w-full sm:w-fit  bg-white rounded-4xl sm:shadow-2xl">
          <div className="w-full max-w-[450px]  h-full px-6 sm:p-10 ">
          <div className="space-y-6 w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-green-700 mb-2">Sign up </h2>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();  // Prevent reload
                sendOtp();
              }}>

              <> <label className="block text-sm font-medium text-gray-700 mb-1">
                Organisation Name
              </label>
                <input
                  type="text"
                  placeholder="e.g. Hilite"
                  value={organisationName}
                  onChange={(e) => setOrganisationName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
                  required
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
                  required
                />
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. abraham"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
                  required
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
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
                    maxLength={10}
                    placeholder="e.g. 987XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                {mobileNumberValidationMessage && (
                  <p className="text-red-500 text-sm mt-1">{mobileNumberValidationMessage}</p>
                )}
              </>
              <button
                type="submit"
                className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
              >
                Send OTP
              </button>
            </form>


            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <a href="/auth/login" className="text-green-600 hover:underline">
                Login here
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

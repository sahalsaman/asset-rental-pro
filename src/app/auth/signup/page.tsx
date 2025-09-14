"use client";

import { signUp } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import logo from "../../../../public/arp logo.png"

export default function LoginPage() {

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const router = useRouter();
  // In sendOtp:
  const sendOtp = async () => {
    try {
      const res = await signUp(phone, name, organisationName)
      router.push(`/auth/verify-otp?phone=${phone}`);
    } catch (err: any) {
      if (err?.response?.data?.error) {
        toast.error(err?.response?.data?.error)
        return;
      }
      console.error("Signup error:", err);
    }
  };

  return (

    <div className="bg-gradient-to-br from-green-700 to-green-900 ">
      <div className="h-60 flex justify-center items-center">
        <h2 className="text-3xl font-bold text-white text-center mb-2 ">Welcome to Asset Management</h2>
      </div>
      <div className="absolute sm:left-[13%]  md:left-[33%]" style={{ marginTop: "-25px" }}>
        <div className="flex flex-col items-center justify-between h-full bg-white py-10 px-5 rounded-4xl sm:shadow-2xl">
          <div className="space-y-6 w-full">
            {/* <div className="flex justify-center items-center"> <Image src={logo} alt="" width={100} /></div> */}
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
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sahal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
                  required
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  // minLength={10}
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
                />

              </>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
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
  );
}

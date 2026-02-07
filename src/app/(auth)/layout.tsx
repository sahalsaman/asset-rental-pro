"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { UserRoles } from "@/utils/contants";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { app_config } from "../../../app-config";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await apiFetch("/api/me", { preventRedirect: true });
        if (res.ok) {
          const data = await res.json();
          const role = data.role;

          if (role === UserRoles.ADMIN) {
            router.replace("/admin/dashboard");
          } else if (role === UserRoles.OWNER || role === UserRoles.MANAGER) {
            router.replace("/owner/dashboard");
          } else if (role === UserRoles.USER) {
            router.replace("/user/dashboard");
          }
        }
      } catch (error) {
        // If 401 or network error, just stay on auth pages
        console.log("User not logged in or error checking session");
      }
    };
    checkUser();
  }, [router]);

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isOtpPage = pathname === "/verify-otp";

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT PANEL (Desktop) */}
      <div className="hidden md:flex w-1/2 bg-green-700 bg-gradient-to-br from-green-700 to-green-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src={app_config.APP_LOGO_DARK_THEME}
              alt="Logo"
              width={80}
              height={80}
            />
          </div>
          <h1 className="text-5xl font-bold mb-4">Welcome to {app_config.APP_NAME}</h1>
          <p className="text-xl text-green-100 mb-10 max-w-md mx-auto">
            We make it for you. Manage your properties with ease and efficiency.
          </p>

          {isLoginPage && (
            <div className="mt-8 space-y-4">
              <p className="text-green-200">Don't have an account yet?</p>
              <button
                onClick={() => router.push("/signup")}
                className="px-8 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-green-800 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          )}

          {isSignupPage && (
            <div className="mt-8 space-y-4">
              <p className="text-green-200">Already have an account?</p>
              <button
                onClick={() => router.push("/login")}
                className="px-8 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-green-800 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL (Content) */}
      <div className="w-full md:w-1/2 flex flex-col relative bg-green-700 md:bg-white">
        {/* Mobile Header (Logo) */}
        <div className="md:hidden flex flex-col items-center pt-10 pb-6 text-white">
          <div className="mb-2">
            <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={50} />
          </div>
          <h2 className="text-2xl font-bold">Welcome to {app_config.APP_NAME}</h2>
          <p className="text-green-100 text-sm">We make it for you</p>
        </div>

        <Toaster position="top-right" />

        {/* Helper Wrapper to center content on desktop and show card on mobile */}
        <div className="flex-1 flex justify-center items-center  md:p-12">
          <div className="w-full h-full md:h-auto bg-white rounded-t-[2.5rem] md:rounded-none px-6 pt-10 md:p-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] md:shadow-none flex flex-col md:block">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}


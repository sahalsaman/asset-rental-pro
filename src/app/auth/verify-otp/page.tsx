"use client";

import api from "@/lib/api";
import { NextResponse } from "next/server";
import { useState } from "react";
import toast from "react-hot-toast";

export default function VerifyOTPPage() {

    const phone = new URLSearchParams(window.location.search).get("phone") || "";
    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {
        try {
            const res = await api.post("/auth/verify-otp", { phone, otp });
            const role = res.data.role;
            if (role === "admin") location.href = "/admin/dashboard";
            else if (role === "owner") location.href = "/owner/dashboard";
            else location.href = "/user/dashboard";
            const response = NextResponse.json({ role: role });
            response.cookies.set("ARP_Token", "art_app-jwt-or-session-token", {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                path: "/",
            });
            toast.success("Logged in successfully!");
            return response
        } catch (err: any) {
            if (err?.response?.data?.error) {
                toast.error(err?.response?.data?.error)
                return;
            }
            console.error("OTP verify error:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-00 to-green-50">
            <form className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 transition-all duration-300" onSubmit={(e) => {
                e.preventDefault();  // Prevent reload
                verifyOtp();
            }}>
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
                    Verify OTP
                </h2>
                <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                       One time password (OTP)
                    </label>
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
                    >
                        Verify OTP
                    </button>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        Didn't receive it?{" "}
                        <span
                            className="text-blue-500 underline cursor-pointer"
                        >
                            Try Again
                        </span>
                    </p>
                </>

            </form>
        </div>
    );
}

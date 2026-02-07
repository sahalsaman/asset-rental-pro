"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { app_config } from "../../../../app-config";

export default function AdminLoginPage() {
  const router = useRouter();

  // NEW STATES
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);

  // REPLACED FUNCTION (sendOtp → handleLogin)
  const sendOtp = async () => {
    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    setButtonLoader(true);

    try {
      await axios.post("/api/auth/admin-login", {
        username,
        password,
      });

      toast.success("Login successful");
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setButtonLoader(false);
    }
  };

  return (

    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6 w-full">
        <div className="text-center mb-10">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            <span className="text-green-700 block text-lg font-medium mb-1 uppercase tracking-wider">Admin Portal</span>
            Login
          </h2>
        </div>

        {/* UI UNCHANGED */}
        <div className="flex flex-col gap-5">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2 pl-1">User Name</Label>
            <Input
              className="w-full px-4 py-3 bg-green-50/50 border border-green-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2 pl-1">Password</Label>
            <Input
              className="w-full px-4 py-3 bg-green-50/50 border border-green-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={sendOtp}
          className="w-full py-6 bg-green-700 hover:bg-green-800 text-white rounded-xl text-lg font-semibold shadow-lg shadow-green-700/20 transition-all duration-200 mt-4"
          loading={buttonLoader}
        >
          Login
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-12">
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
  );
}

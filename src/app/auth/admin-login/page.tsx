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
    <div className="bg-green-700 bg-gradient-to-br from-green-700 to-green-900 h-[100vh]">
      <div className="h-3/12 flex justify-center items-center sm:hidden ">
        <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={50} />
      </div>

      <div className="sm:flex justify-center items-center w-full h-9/12 sm:h-fit bg-white sm:bg-transparent rounded-tl-2xl rounded-tr-2xl sm:pt-32">
        <div className="pt-10 sm:pt-0 w-full sm:w-fit bg-white rounded-4xl sm:shadow-2xl">
          <div className="w-full max-w-[450px] h-full px-6 sm:p-10">
            <div className="space-y-6 w-full">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-green-700 mb-2">
                  <span className="text-gray-600 font-light text-2xl">Admin</span>
                  <br />Login
                </h2>
              </div>

              {/* UI UNCHANGED */}
              <div className="flex flex-col gap-4">
                <div>
                  <Label>User name</Label>
                  <Input
                    className="mt-1"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={sendOtp}
                variant={"green"}
                className="w-full py-3 font-semibold h-12"
                loading={buttonLoader}
              >
                Submit
              </Button>
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

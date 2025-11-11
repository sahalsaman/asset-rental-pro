"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { countryCodes } from "@/utils/data";
import toast from "react-hot-toast";
import { IUser } from "@/app/types";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
    });

    const [user, setUser] = useState<IUser | null>(null);
    const [changePhoneDialog, setChangePhoneDialog] = useState(false);
    const [newPhone, setNewPhone] = useState("");
    const [newCountryCode, setNewCountryCode] = useState("");
    const [otp, setOtp] = useState("");
    const router = useRouter();

    async function fetchUser() {
        const res = await fetch("/api/me");
        const data = await res.json();
        setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
        });
        setNewPhone(data.phone || "");
        setNewCountryCode(data.countryCode || "");
        setUser(data);
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });
            if (res.ok) toast.success("Profile updated successfully!");
            else toast.error("Failed to update profile");
        } catch (error) {
            console.error(error);
            toast.error("Error updating profile");
        }
    };



    // OTP Functions
    const handleSendOtp = async (e: React.FormEvent) => {
          e.preventDefault();
        if (!newPhone) return toast.error("Please enter a valid phone number");

        const body = {
            newPhone: newPhone,
            newCountryCode: newCountryCode,
            phone: user?.phone,
            countryCode: user?.countryCode,
        }
        const res = await apiFetch(`/api/auth/send-otp-and-phone-update`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (res.ok) {
            setChangePhoneDialog(true)
            toast.success("OTP sent successfully!");
        } else {
            toast.error("Failed to send OTP");
        }

    };

    const handleVerifyOtp = async () => {
        const body = {
            newPhone: newPhone,
            newCountryCode: newCountryCode,
            phone: user?.phone,
            countryCode: user?.countryCode,
            otp: otp
        }
        try {
            const res = await fetch("/api/auth/verify-otp-and-phone-update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });
            if (res.ok) {
                toast.success("Phone number updated successfully!");
                setChangePhoneDialog(false);
                router.push('/auth/login');
                router
            } else {
                toast.error("Invalid OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error verifying OTP");
        }
    };

    const deleteAcccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }
        try {
            const res = await fetch("/api/me", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (res.ok) {
                toast.success("Account deleted successfully!");
                router.push('/auth/login');
            } else {
                toast.error("Failed to delete account");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting account");
        }
    }

    return (
        <div className="max-w-3xl mx-auto  p-6 ">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 border p-6 rounded-lg shadow-sm bg-white">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 border-b-1 pb-2">Personal Information</h2>
                <div>
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input
                        className="mt-1"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        className="mt-1"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit" variant="green" className="w-full">
                    Update
                </Button>
            </form>
            <form onSubmit={handleSendOtp} className="mt-5 flex flex-col gap-3 border p-6 rounded-lg shadow-sm bg-white">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 border-b-1 pb-2">Acoount Information</h2>

                <div>
                    <Label>Phone Number*</Label>
                    <div className="flex items-center gap-2 mt-1">
                        <select
                            name="countryCode" // ✅ added
                            value={newCountryCode}
                            onChange={(e) => setNewCountryCode(e.target.value)}
                            className="w-20 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            style={{ maxWidth: '80px' }}
                        >
                            {countryCodes.map((option) => (
                                <option key={option.code} value={option.code}>
                                    {option.code}
                                </option>
                            ))}
                        </select>
                        <Input
                            name="phone"
                            placeholder="Phone Number"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            required
                            maxLength={10}
                            minLength={10}
                        />
                    </div>
                </div>

                <Button type="submit" variant="green" className="w-full" >
                    Change Phone number
                </Button>
            </form>
                <Button onClick={deleteAcccount} variant="destructive" className="w-full mt-6">
                    Delete Account
                </Button>
            {/* 📱 Change Phone Dialog */}
            <Dialog open={changePhoneDialog} onOpenChange={setChangePhoneDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Mobile Number</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                    />
                    <Button variant="green" onClick={handleVerifyOtp}>
                        Verify OTP
                    </Button>

                </DialogContent>
            </Dialog>
        </div>
    );
}

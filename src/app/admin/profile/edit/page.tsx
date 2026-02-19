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
import {
    ArrowLeft,
    User,
    Phone,
    ShieldAlert,
    CheckCircle2,
    Lock,
    Smartphone,
    ScanFace
} from "lucide-react";
import { FullscreenLoader } from "@/components/Loader";

export default function ProfileEditPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
    });

    const [user, setUser] = useState<IUser | null>(null);
    const [changePhoneDialog, setChangePhoneDialog] = useState(false);
    const [newPhone, setNewPhone] = useState("");
    const [newCountryCode, setNewCountryCode] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    async function fetchUser() {
        setLoading(true);
        try {
            const res = await apiFetch("/api/me");
            const data = await res.json();
            setFormData({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
            });
            setNewPhone(data.phone || "");
            setNewCountryCode(data.countryCode || "");
            setUser(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await apiFetch("/api/me", {
                method: "PUT",
                body: JSON.stringify(formData),
            });
            if (res.ok) toast.success("Security profile updated successfully!");
            else toast.error("Failed to update profile");
        } catch (error) {
            console.error(error);
            toast.error("Error updating profile");
        } finally {
            setUpdating(false);
        }
    };

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
            toast.success("Authentication OTP transmitted successfully.");
        } else {
            const err = await res.json();
            toast.error(err.message || "Failed to initiate phone update.");
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) return toast.error("Please enter the verification code.");
        const body = {
            newPhone: newPhone,
            newCountryCode: newCountryCode,
            phone: user?.phone,
            countryCode: user?.countryCode,
            otp: otp
        }
        try {
            const res = await apiFetch("/api/auth/verify-otp-and-phone-update", {
                method: "POST",
                body: JSON.stringify(body),
            });
            if (res.ok) {
                toast.success("Phone number verified and updated.");
                setChangePhoneDialog(false);
                router.push('/login');
            } else {
                toast.error("Invalid or expired code.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error during verification process.");
        }
    };

    const deleteAcccount = async () => {
        if (!confirm("CRITICAL ACTION: Are you sure you want to permanently decommission this administrator account? This action is irreversible.")) {
            return;
        }
        try {
            const res = await apiFetch("/api/me", {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Account successfully purged from system.");
                router.push('/login');
            } else {
                toast.error("Security overwrite failed. Contact system architects.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error during account deletion.");
        }
    }

    if (loading) return <FullscreenLoader />;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-12 space-y-12 mb-12">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="h-12 w-12 p-0 rounded-2xl hover:bg-slate-100 transition-all text-slate-400"
                >
                    <ArrowLeft size={24} />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Refine Information</h1>
                    <p className="text-slate-500 font-medium">Update your platform identity and security parameters.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white p-2 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                    <div className="relative z-10 space-y-6">
                        <div className="h-14 w-14 rounded-2xl bg-blue-500/20 border border-white/10 flex items-center justify-center">
                            <ScanFace className="text-blue-400" size={28} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black italic tracking-tighter">Security Protocol</h2>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Updating your identity requires immediate synchronization with our global authentication layer. Ensure all details are accurate to maintain administrative integrity.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            Validated System Role
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            Encrypted Persistence
                        </div>
                    </div>

                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                </div>

                <div className="lg:col-span-3 p-8 md:p-12 space-y-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-8">
                            <User size={14} /> Global Identity
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 ml-1">Given Name</Label>
                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="h-12 rounded-2xl border-slate-200 focus:ring-blue-500/20 font-bold"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 ml-1">Surname</Label>
                                <Input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="h-12 rounded-2xl border-slate-200 focus:ring-blue-500/20 font-bold"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={updating}
                            className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl shadow-slate-200 transition-all active:scale-95 w-full md:w-auto"
                        >
                            {updating ? "Saving Changes..." : "Commit Identity Updates"}
                        </Button>
                    </form>

                    <div className="h-[1px] bg-slate-100" />

                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-8">
                            <Smartphone size={14} /> Authentication Channel
                        </h3>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 ml-1">New Mobile Number</Label>
                            <div className="flex items-center gap-3">
                                <select
                                    value={newCountryCode}
                                    onChange={(e) => setNewCountryCode(e.target.value)}
                                    className="w-24 h-12 px-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm font-bold bg-slate-50 outline-none transition-all"
                                >
                                    {countryCodes.map((option) => (
                                        <option key={option.code} value={option.code}>
                                            {option.code}
                                        </option>
                                    ))}
                                </select>
                                <Input
                                    placeholder="Phone Number (10 digits)"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                                    className="h-12 rounded-2xl border-slate-200 focus:ring-blue-500/20 font-bold flex-1"
                                    maxLength={10}
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            variant="outline"
                            className="h-12 px-8 rounded-2xl border-slate-200 font-black text-slate-600 hover:bg-slate-50 transition-all w-full md:w-auto"
                        >
                            Verify & Update Phone
                        </Button>
                    </form>

                    <div className="h-[1px] bg-slate-100" />

                    <div className="pt-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-red-400 mb-4 flex items-center gap-2">
                            <ShieldAlert size={12} /> Account Decommissioning
                        </p>
                        <Button
                            onClick={deleteAcccount}
                            variant="ghost"
                            className="h-12 px-8 rounded-2xl text-red-500 font-bold hover:bg-red-50 hover:text-red-600 transition-all w-full md:w-auto flex items-center justify-start gap-3 border border-red-50"
                        >
                            Deactivate Administrator Account
                        </Button>
                    </div>
                </div>
            </div>

            {/* 📱 Verification Dialog */}
            <Dialog open={changePhoneDialog} onOpenChange={setChangePhoneDialog}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-[1rem] shadow-2xl">
                    <DialogHeader className="bg-slate-900 p-8 text-white">
                        <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                            <Lock className="text-blue-400" size={20} />
                            Verification Required
                        </DialogTitle>
                        <p className="text-slate-400 text-xs font-medium mt-1">Enter the 6-digit code sent to your new device.</p>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <Input
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="h-14 rounded-2xl border-slate-200 text-center text-2xl font-black tracking-[0.5em] focus:ring-blue-500/20"
                            maxLength={6}
                        />
                        <Button
                            onClick={handleVerifyOtp}
                            className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-lg"
                        >
                            Authorize Update
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

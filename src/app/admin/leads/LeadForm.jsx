"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { countryCodes } from "@/utils/data";
import toast from "react-hot-toast";
import { PropertyType } from "@/utils/contants";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    Tag,
    Flag,
    FileText,
    UserPlus
} from "lucide-react";

export default function LeadForm({ open, onClose, editData, refresh }) {
    const [form, setForm] = useState({
        name: "",
        countryCode: "+91",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        country: "",
        status: "new",
        property_type: "",
        lead_from: "",
        assign: "",
        note: "",
        label: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({
                ...editData,
                status: editData.status || "new"
            });
        } else {
            setForm({
                name: "",
                countryCode: "+91",
                phone: "",
                email: "",
                address: "",
                city: "",
                state: "",
                country: "",
                status: "new",
                property_type: "",
                lead_from: "",
                assign: "",
                note: "",
                label: "",
            });
        }
    }, [editData, open]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.phone) {
            toast.error("Name and Phone are required");
            return;
        }

        setLoading(true);
        try {
            const url = editData
                ? `/api/admin/lead?id=${editData._id}`
                : "/api/admin/lead";

            const method = editData ? "PUT" : "POST";

            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                toast.error("Error submitting lead");
                return;
            }

            toast.success(editData ? "Lead updated successfully" : "Lead created successfully");
            refresh();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 rounded-[1rem] shadow-2xl">
                <DialogHeader className="bg-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-white/10">
                                <UserPlus className="text-blue-400" size={20} />
                            </div>
                            {editData ? "Update Lead Intelligence" : "Onboard New Lead"}
                        </DialogTitle>
                        <p className="text-slate-400 text-sm font-medium mt-1">
                            {editData ? "Refine lead details and engagement status." : "Capture high-intent interest for platform assets."}
                        </p>
                    </div>
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                </DialogHeader>

                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <User size={12} /> Contact Profile
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs font-bold text-slate-600 mb-1.5 block">Full Name *</Label>
                                    <Input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="h-11 rounded-xl border-slate-200 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-slate-600 mb-1.5 block">Email Address</Label>
                                    <Input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="h-11 rounded-xl border-slate-200 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-slate-600 mb-1.5 block">WhatsApp Number *</Label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            name="countryCode"
                                            value={form.countryCode || ""}
                                            onChange={handleChange}
                                            className="h-11 px-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-bold bg-slate-50 "
                                            style={{ width: "70px" }}
                                        >
                                            {countryCodes.map((option) => (
                                                <option key={option.code} value={option.code}>
                                                    {option.code}
                                                </option>
                                            ))}
                                        </select>
                                        <Input
                                            name="phone"
                                            placeholder="9876543210"
                                            value={form.phone || ""}
                                            onChange={handleChange}
                                            className="h-11 rounded-xl border-slate-200 focus:ring-blue-500/20 flex-1"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <MapPin size={12} /> Geographic Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs font-bold text-slate-600 mb-1.5 block">Primary Address</Label>
                                    <Input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="123 Luxury Lane"
                                        className="h-11 rounded-xl border-slate-200"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs font-bold text-slate-600 mb-1.5 block">City</Label>
                                        <Input name="city" value={form.city} onChange={handleChange} className="h-11 rounded-xl border-slate-200" />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-bold text-slate-600 mb-1.5 block">State</Label>
                                        <Input name="state" value={form.state} onChange={handleChange} className="h-11 rounded-xl border-slate-200" />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-slate-600 mb-1.5 block">Country</Label>
                                    <Input name="country" value={form.country} onChange={handleChange} className="h-11 rounded-xl border-slate-200" />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 border-t border-slate-100 pt-6 mt-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-6">
                                <Building2 size={12} /> Engagement Settings
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <Label className="text-xs font-bold text-slate-600 mb-1.5 block">Lead Status</Label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full h-11 px-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm font-bold bg-white"
                                    >
                                        <option value="new">New Entry</option>
                                        <option value="pending">Engagement Pending</option>
                                        <option value="in-progress">In Negotiation</option>
                                        <option value="closed">Successfully Closed</option>
                                        <option value="rejected">Discovery Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-slate-600 mb-1.5 block">Priority Label</Label>
                                    <select
                                        name="label"
                                        value={form.label}
                                        onChange={handleChange}
                                        className="w-full h-11 px-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm font-bold bg-white"
                                    >
                                        <option value="">No Label</option>
                                        <option value="hot">🔥 High Intensity (Hot)</option>
                                        <option value="warm">⚡ Active Interest (Warm)</option>
                                        <option value="cold">❄️ Low Interest (Cold)</option>
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-slate-600 mb-1.5 block">Lead Source</Label>
                                    <select
                                        name="lead_from"
                                        value={form.lead_from}
                                        onChange={handleChange}
                                        className="w-full h-11 px-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm font-bold bg-white"
                                    >
                                        <option value="">Undisclosed</option>
                                        <option value="website">Corporate Website</option>
                                        <option value="facebook">Meta Advertising</option>
                                        <option value="instagram">Instagram Campaign</option>
                                        <option value="referral">Direct Referral</option>
                                        <option value="walk-in">In-Person Walk-in</option>
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-slate-600 mb-1.5 block">Target Asset Class</Label>
                                    <select
                                        name="property_type"
                                        value={form.property_type}
                                        onChange={handleChange}
                                        className="w-full h-11 px-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm font-bold bg-white"
                                    >
                                        <option value="">Not Specified</option>
                                        {Object.values(PropertyType).map((type) => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-slate-600 mb-1.5 block">Account Executive</Label>
                                    <Input
                                        name="assign"
                                        value={form.assign}
                                        onChange={handleChange}
                                        placeholder="Assignee Name"
                                        className="h-11 rounded-xl border-slate-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Label className="text-xs font-bold text-slate-600 mb-1.5 block">Strategic Note</Label>
                            <textarea
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                placeholder="Describe context, user requirements, or follow-up plan..."
                                className="w-full min-h-[100px] p-4 text-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none placeholder:text-slate-300 font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                        Discard
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-12 px-8 rounded-xl font-black bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95"
                    >
                        {loading ? "Processing..." : editData ? "Synchronize Updates" : "Validate and Onboard"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

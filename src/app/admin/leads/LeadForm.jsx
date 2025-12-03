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
        status: "",
        property_type: "",
        lead_from: "",
        assign: "",
        note: "",
        label: "",
    });

    // Fill form if edit mode
    useEffect(() => {
        if (editData) {
            setForm(editData);
        }
    }, [editData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const url = editData
                ? `/api/admin/lead/${editData._id}`
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

            refresh(); // Refresh table
            onClose(); // Close modal
        } catch (error) {
            console.log(error);
            alert("Error submitting lead");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {editData ? "Edit Lead" : "Add Lead"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 ">

                    <div>
                        <Label className="mb-1">Name*</Label>
                        <Input name="name" value={form.name} onChange={handleChange} />
                    </div>

                    <div>
                        <Label className="mb-1">Email</Label>
                        <Input name="email" value={form.email} onChange={handleChange} />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="phone" className="mb-1">Whatsapp number*</Label>
                        <div className="flex items-center gap-2">
                            <select
                                name="countryCode" // ✅ added
                                value={form.countryCode || ""}
                                onChange={handleChange}
                                className="w-20 h-12 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                style={{ maxWidth: '80px' }}
                            >
                                {countryCodes.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.code}
                                    </option>
                                ))}
                            </select>
                            <Input
                                id="phone"
                                name="phone"
                                placeholder="Phone"
                                value={form.phone || ""}
                                onChange={handleChange}
                                required
                                maxLength={10}
                                minLength={10}
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <Label className="mb-1">Address*</Label>
                        <Input name="address" value={form.address} onChange={handleChange} />
                    </div>

                    <div>
                        <Label className="mb-1">City*</Label>
                        <Input name="city" value={form.city} onChange={handleChange} />
                    </div>

                    <div>
                        <Label className="mb-1">State*</Label>
                        <Input name="state" value={form.state} onChange={handleChange} />
                    </div>

                    <div>
                        <Label className="mb-1">Country*</Label>
                        <Input name="country" value={form.country} onChange={handleChange} />
                    </div>

                    {/* Dropdown fields */}
                    <div>
                        <Label className="mb-1">Status*</Label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border p-2 rounded h-12"
                        >
                            <option value="">Select</option>
                            <option value="new">New</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="closed">Closed</option>
                            <option value="closed">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <Label className="mb-1">Property Type*</Label>
                        <select
                            name="property_type"
                            value={form.property_type}
                            onChange={handleChange}
                            className="w-full border p-2 rounded h-12"
                        >
                            <option value="">Select</option>
                          {Object.values(PropertyType).map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label className="mb-1">Lead From</Label>
                        <select
                            name="lead_from"
                            value={form.lead_from}
                            onChange={handleChange}
                            className="w-full border p-2 rounded h-12"
                        >
                            <option value="">Select</option>
                            <option value="website">Website</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="referral">Referral</option>
                            <option value="walk-in">Walk-in</option>
                        </select>
                    </div>

                    <div>
                        <Label className="mb-1">Assign To</Label>
                        <Input name="assign" value={form.assign} onChange={handleChange} />
                    </div>
                    <div>
                        <Label className="mb-1">Label</Label>
                        <select
                            name="label"
                            value={form.label}
                            onChange={handleChange}
                            className="w-full border p-2 rounded h-12"
                        >
                            <option value="">Select</option>
                            <option value="hot">Hot</option>
                            <option value="warm">Warm</option>
                            <option value="cold">Cold</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <Label className="mb-1">Note</Label>
                        <Input name="note" value={form.note} onChange={handleChange} />
                    </div>

                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {editData ? "Update Lead" : "Create Lead"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

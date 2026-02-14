"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";

interface BusinessFormModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    initialData?: any | null;
}

export default function BusinessFormModal({
    open,
    onClose,
    onSave,
    initialData,
}: BusinessFormModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        website: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                address: initialData.address || "",
                website: initialData.website || "",
            });
        } else {
            setFormData({
                name: "",
                address: "",
                website: "",
            });
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await apiFetch(`/api/business`, {
            method: "PUT",
            body: JSON.stringify(formData),
        });
        onSave();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader>
                    <DialogTitle>
                        Edit Business
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Business Name</Label>
                        <Input
                            className="mt-1"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter business name"
                            required
                        />
                    </div>

                    <div>
                        <Label>Address</Label>
                        <Textarea
                            className="mt-1"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                        />
                    </div>

                    <div>
                        <Label>Website</Label>
                        <Input
                            className="mt-1"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://yourwebsite.com"
                        />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2 mt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="green">
                            {initialData ? "Update" : "Save"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

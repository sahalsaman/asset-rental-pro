"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { countryCodes } from "@/utils/mock-data";
import { PaymentRecieverOptions } from "@/utils/contants";

export default function BankFormModal({ open, onClose, onSave, initialData }: any) {
    const [formData, setFormData] = useState({
        paymentRecieverOption: "",
        bankName: "",
        accountNo: "",
        ifsc: "",
        accountHolderName: "",
        branch: "",
        upiId: "",
        upiPhoneNumber: "",
        qrcode_link: "",
        upiPhoneCountryCode: "+91"
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else
            setFormData({
                paymentRecieverOption: "",
                bankName: "",
                accountNo: "",
                ifsc: "",
                accountHolderName: "",
                branch: "",
                upiId: "",
                upiPhoneNumber: "",
                qrcode_link: "",
                upiPhoneCountryCode: "+91",
            });
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const method = initialData ? "PUT" : "POST";
        const url = initialData ? `/api/banks/${initialData._id}` : `/api/banks`;
        await apiFetch(url, {
            method,
            body: JSON.stringify(formData),
        });
        onSave();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Bank / UPI" : "Add Bank / UPI"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div>
                        <Label>Select Option</Label>
                        <select
                            name="paymentRecieverOption" // ✅ added
                            value={formData.paymentRecieverOption || ""}
                            onChange={handleChange}
                            className="w-full mt-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="" disabled>Select an option</option>
                            {Object.values(PaymentRecieverOptions).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    {formData.paymentRecieverOption === PaymentRecieverOptions.BANK && <>
                        <div>
                            <Label>Bank Name</Label>
                            <Input className="mt-1" name="bankName" value={formData.bankName} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Account Holder Name</Label>
                            <Input className="mt-1" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Account Number</Label>
                            <Input className="mt-1" name="accountNo" type="number" value={formData.accountNo} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>IFSC Code</Label>
                            <Input className="mt-1" name="ifsc" value={formData.ifsc} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Branch</Label>
                            <Input className="mt-1" name="branch" value={formData.branch} onChange={handleChange} />
                        </div>
                    </>}

                    {formData.paymentRecieverOption === PaymentRecieverOptions.UPIID &&
                        <>
                            <div>
                                <Label>UPI ID</Label>
                                <Input className="mt-1" name="upiId" value={formData.upiId} onChange={handleChange} />
                            </div>
                        </>}
                    {formData.paymentRecieverOption === PaymentRecieverOptions.UPIPHONE &&
                        <>
                            <div>
                                <Label>UPI Phone Number</Label>
                                <div className="flex items-center gap-2">
                                    <select
                                        name="countryCode" // ✅ added
                                        value={formData.upiPhoneCountryCode || ""}
                                        onChange={handleChange}
                                        className="w-20 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        style={{ maxWidth: '80px' }}
                                    >
                                        {countryCodes.map((option) => (
                                            <option key={option.code} value={option.code}>
                                                {option.code}
                                            </option>
                                        ))}
                                    </select>
                                    <Input className="mt-1" name="upiPhoneNumber" value={formData.upiPhoneNumber} onChange={handleChange} maxLength={10} minLength={10} />
                                </div>
                            </div>
                        </>}
                    {formData.paymentRecieverOption === PaymentRecieverOptions.UPIQR &&
                        <div>
                            <Label>QR Code Link</Label>
                            <Input className="mt-1" name="qrcode_link" value={formData.qrcode_link} onChange={handleChange} />
                        </div>}

                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            {initialData ? "Update" : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

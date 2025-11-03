"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { countryCodes, defaultData } from "@/utils/data";
import { PaymentRecieverOptions } from "@/utils/contants";

interface BankFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: any;
}

export default function BankFormModal({ open, onClose, onSave, initialData }: BankFormModalProps) {
  const [formData, setFormData] = useState({
    paymentRecieverOption: "",
    bankName: "",
    value: "",
    ifsc: "",
    accountHolderName: "",
    branch: "",
    upiPhoneCountryCode: defaultData.countryCodes,
  });

  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [qrFile, setQrFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.paymentRecieverOption === PaymentRecieverOptions.UPIQR && initialData.value) {
        setQrPreview(initialData.value);
      }
    } else {
      setFormData({
        paymentRecieverOption: "",
        bankName: "",
        value: "",
        ifsc: "",
        accountHolderName: "",
        branch: "",
        upiPhoneCountryCode: defaultData.countryCodes,
      });
      setQrPreview(null);
      setQrFile(null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageSrc = event.target?.result as string;
      setQrPreview(imageSrc);
    };
    reader.readAsDataURL(file);
  };



  const saveBankData = async (data: any) => {
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/banks/${initialData._id}` : `/api/banks`;

    let base64Image = null;

    // Convert QR File to base64 before sending
    if (qrFile) {
      base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(qrFile);
      });
    }
    if (data.paymentRecieverOption == PaymentRecieverOptions.UPIQR) {
      data.qrImage = base64Image
      data.value='image'
    }

    await apiFetch(url, {
      method,
      body: JSON.stringify({
        ...data,
      }),
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
          {/* Option */}
          <div>
            <Label>Select Option</Label>
            <select
              name="paymentRecieverOption"
              value={formData.paymentRecieverOption || ""}
              onChange={handleChange}
              className="w-full mt-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="" disabled>
                Select an option
              </option>
              {Object.values(PaymentRecieverOptions).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* BANK */}
          {formData.paymentRecieverOption === PaymentRecieverOptions.BANK && (
            <>
              <div>
                <Label>Bank Name</Label>
                <Input className="mt-1" name="bankName" value={formData.bankName} onChange={handleChange} />
              </div>
              <div>
                <Label>Account Holder Name</Label>
                <Input
                  className="mt-1"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input className="mt-1" name="value" type="number" value={formData.value} onChange={handleChange} />
              </div>
              <div>
                <Label>IFSC Code</Label>
                <Input className="mt-1" name="ifsc" value={formData.ifsc} onChange={handleChange} />
              </div>
              <div>
                <Label>Branch</Label>
                <Input className="mt-1" name="branch" value={formData.branch} onChange={handleChange} />
              </div>
            </>
          )}

          {/* UPI PHONE */}
          {formData.paymentRecieverOption === PaymentRecieverOptions.UPIPHONE && (
            <>
              <div>
                <Label>Account Holder Name</Label>
                <Input
                  className="mt-1"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>UPI Phone Number</Label>
                <div className="flex items-center gap-2">
                  <select
                    name="countryCode"
                    value={formData.upiPhoneCountryCode || ""}
                    onChange={handleChange}
                    className="w-20 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    {countryCodes.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.code}
                      </option>
                    ))}
                  </select>
                  <Input
                    className="mt-1"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    maxLength={10}
                    minLength={10}
                  />
                </div>
              </div>
            </>
          )}

          {/* UPI ID */}
          {formData.paymentRecieverOption === PaymentRecieverOptions.UPIID && (
            <>
              <div>
                <Label>Account Holder Name</Label>
                <Input
                  className="mt-1"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>UPI ID</Label>
                <Input className="mt-1" name="value" value={formData.value} onChange={handleChange} />
              </div>
            </>
          )}

          {/* UPI QR */}
          {formData.paymentRecieverOption === PaymentRecieverOptions.UPIQR && (
            <>
              <div>
                <Label>Account Holder Name</Label>
                <Input
                  className="mt-1"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Upload QR Image</Label>
                <Input type="file" accept="image/*" onChange={handleQrUpload} className="mt-1" />
              </div>

              {qrPreview && (
                <div className="mt-2 flex flex-col items-center">
                  <img src={qrPreview} alt="QR Preview" className="w-40 h-40 object-contain" />
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => saveBankData(formData)}>{initialData ? "Update" : "Save"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

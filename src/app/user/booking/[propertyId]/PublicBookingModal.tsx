"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { IBooking, IProperty, IUnit } from "@/app/types";
import { Label } from "@radix-ui/react-label";
import { BookingStatus, UnitStatus } from "@/utils/contants";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { countryCodes, defaultData } from "@/utils/data";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<IBooking>) => void;
  editData?: IBooking | null;
  unitData?: IUnit | null;
  property_data?: IProperty;
}

export default function BookingAddEditModal({ open, onClose, onSave, editData, unitData, property_data }: Props) {
  const property = property_data ? property_data : localStorageServiceSelectedOptions.getItem()?.property;

  const [step, setStep] = useState<number>(1);
  const [userId, setUserId] = useState<string>("");
  const [units, setUnits] = useState<IUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<any>>({
    unitId: unitData ? unitData?._id : "",
    propertyId: property?._id || "",
    firstName: "",
    lastName: "",
    countryCode: defaultData.countryCodes,
    phone: "",
    address: "",
    verificationIdCard: "",
    verificationIdCardNumber: "",
    checkIn: "",
    checkOut: "",
    amount: unitData ? unitData?.amount : 0,
    advanceAmount: unitData ? unitData?.advanceAmount : 0,
    status: BookingStatus.CHECKED_IN,
  });

  const fetchUnits = () => {
    apiFetch(`/api/unit?propertyId=${property?._id}`)
      .then((res) => res.json())
      .then(setUnits);
  };

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      if (!unitData) fetchUnits();
      setFormData((prev) => ({
        ...prev,
        unitId: unitData?._id || "",
        amount: unitData?.amount || 0,
        advanceAmount: unitData?.advanceAmount || 0,
        propertyId: property?._id || "",
      }));
    }
  }, [editData, unitData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "advanceAmount" ? Number(value) : value,
    }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = units.find((i) => i._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      unitId: selectedUnit?._id || "",
      amount: selectedUnit?.amount || 0,
      advanceAmount: selectedUnit?.advanceAmount || 0,
    }));
  };

  const handleVerifyUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/booking/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          countryCode: formData.countryCode,
          address: formData.address,
          verificationIdCard: formData.verificationIdCard,
          verificationIdCardNumber: formData.verificationIdCardNumber,
          type: "public"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Verification failed");
      setUserId(data?.user?._id);
      setStep(2);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          propertyId: property?._id,
          userId,
          type: "public"
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Booking failed");
      toast.success("Booking added successfully");
      onSave(result);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Booking" : step === 1 ? "Verify User" : "Add Booking"}</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <form onSubmit={handleVerifyUser} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name*</Label>
              <Input id="firstName" name="firstName" value={formData.firstName || ""} onChange={handleChange} required placeholder="Enter your first name" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name*</Label>
              <Input id="lastName" name="lastName" value={formData.lastName || ""} onChange={handleChange} required placeholder="Enter your first name" />
            </div>
            <div>
              <Label htmlFor="phone">Whatsapp number*</Label>
              <div className="flex items-center gap-2">
                <select
                  name="countryCode" // ✅ added
                  value={formData.countryCode || ""}
                  onChange={handleChange}
                  className="w-20 h-12 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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
                  value={formData.phone || ""}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  minLength={10}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address*</Label>
              <Textarea id="address" name="address" placeholder="Enter your full address" value={formData.address || ""} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="verificationIdCard">Verification ID Type*</Label>
              <select
                id="verificationIdCard"
                name="verificationIdCard"
                value={formData.verificationIdCard || ""}
                onChange={handleChange}
                className="w-full h-12 border rounded px-3 py-2"
              >
                <option value="">Select ID Type</option>
                <option value="Aadhar">Aadhar</option>
                <option value="Passport">Passport</option>
                <option value="DrivingLicense">Driving License</option>
              </select>
            </div>

            <div>
              <Label htmlFor="verificationIdCardNumber">ID Number*</Label>
              <Input
                id="verificationIdCardNumber"
                name="verificationIdCardNumber"
                value={formData.verificationIdCardNumber || ""}
                onChange={handleChange}
                placeholder="Enter your ID number"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Verifying..." : "Next →"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSaveBooking} className="space-y-4">
            {!unitData && (
              <div>
                <Label htmlFor="unitId">Unit*</Label>
                <select
                  id="unitId"
                  name="unitId"
                  value={formData.unitId as string || ""}
                  onChange={handleUnitChange}
                  className="w-full h-12 border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Unit</option>
                  {units.map(
                    (unit) =>
                      unit.status === UnitStatus.AVAILABLE && (
                        <option key={unit._id} value={unit._id}>
                          {unit.name} - {property?.currency}
                          {unit.amount}
                        </option>
                      )
                  )}
                </select>
              </div>
            )}

            <div>
              <Label htmlFor="checkIn">Check-In Date*</Label>
              <Input id="checkIn" name="checkIn" type="date" value={formData.checkIn || ""} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="checkOut">Check-Out Date</Label>
              <Input id="checkOut" name="checkOut" type="date" value={formData.checkOut || ""} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="amount">Rent Amount*</Label>
              <div className="flex items-center gap-1">
                {property?.currency}
                <Input id="amount" name="amount" type="number" value={formData.amount || ""} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="advanceAmount">Advance Amount</Label>
              <div className="flex items-center gap-1">
                {property?.currency}
                <Input id="advanceAmount" name="advanceAmount" type="number" value={formData.advanceAmount || ""} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Booking Status*</Label>
              <select
                id="status"
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                className="w-full h-12 border rounded px-3 py-2"
                required
              >
                {Object.values(BookingStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Saving..." : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

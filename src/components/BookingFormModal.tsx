"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { IBooking, IProperty, IRoom } from "@/app/types";
import { Label } from "@radix-ui/react-label";
import { BookingStatus } from "@/utils/contants";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";



interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<IBooking>) => void;
  editData?: IBooking | null;
  roomData?: IRoom | null;
  property_data?: IProperty
  page?: boolean
}

export default function BookingAddEditModal({ open, onClose, onSave, editData, roomData, property_data, page }: Props) {
  const property_id = property_data ? property_data?._id : localStorageServiceSelectedOptions.getItem()?.property?._id;
  const [formData, setFormData] = useState<Partial<IBooking>>({
    fullName: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    verificationIdCard: "",
    verificationIdCardNumber: "",
    checkIn: "",
    checkOut: "",
    amount: roomData?.amount || 0,
    advanceAmount: roomData?.advanceAmount || 0,
    status: "Pending",
    roomId: roomData?._id || "",
    propertyId: roomData?.propertyId,
  });
  const [rooms, setRooms] = useState<IRoom[]>([]);
  console.log("formData", formData);

  const fetchRooms = () => {
    apiFetch(`/api/room?propertyId=${property_id}`)
      .then(res => res.json())
      .then(setRooms);
  };

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      if (!roomData) fetchRooms();
      setFormData({});
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" || name === "advanceAmount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveBooking(formData);
  };

  const handleSaveBooking = async (data: any) => {
    const method = editData ? "PUT" : "POST";
    const url = editData ? `/api/booking?id=${editData._id}` : `/api/booking`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...data, roomId: roomData?._id,
        propertyId: roomData?.propertyId,
      }),
    });
    toast.success("Successfully saved booking");
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto overscroll-contain p-6">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Booking" : "Add Booking"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-auto">
          {/* Full Name */}
          {!roomData && <div>
            <Label htmlFor="roomId">Room</Label>
            <select
              id="roomId"
              name="roomId"
              value={formData.roomId as string || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required={!roomData ? true : false}
            >
              <option value="">Select Room</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name} - ₹{room.amount}
                </option>))}
            </select>
          </div>}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Phone"
              value={formData.phone || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              placeholder="WhatsApp Number"
              value={formData.whatsappNumber || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Address"
              value={formData.address || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Verification ID Type */}
          <div>
            <Label htmlFor="verificationIdCard">Verification ID Type</Label>
            <select
              id="verificationIdCard"
              name="verificationIdCard"
              value={formData.verificationIdCard || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select ID Type</option>
              <option value="Aadhar">Aadhar</option>
              <option value="PAN">PAN</option>
              <option value="VoterID">Voter ID</option>
              <option value="Passport">Passport</option>
              <option value="DrivingLicense">Driving License</option>
            </select>
          </div>

          {/* Verification ID Number */}
          <div>
            <Label htmlFor="verificationIdCardNumber"> ID Number</Label>
            <Input
              id="verificationIdCardNumber"
              name="verificationIdCardNumber"
              placeholder="Verification ID Number"
              value={formData.verificationIdCardNumber || ""}
              onChange={handleChange}
            />
          </div>

          {/* Check-in */}
          <div>
            <Label htmlFor="checkIn">Check-In Date</Label>
            <Input
              id="checkIn"
              name="checkIn"
              type="date"
              value={formData.checkIn ? formData.checkIn.split("T")[0] : ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Check-out */}
          <div>
            <Label htmlFor="checkOut">Check-Out Date</Label>
            <Input
              id="checkOut"
              name="checkOut"
              type="date"
              value={formData.checkOut ? formData.checkOut.split("T")[0] : ""}
              onChange={handleChange}
            />
          </div>

          {/* Rent Amount */}
          <div>
            <Label htmlFor="amount">Rent Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Rent Amount"
              value={formData.amount || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Advance Amount */}
          <div>
            <Label htmlFor="advanceAmount">Advance Amount</Label>
            <Input
              id="advanceAmount"
              name="advanceAmount"
              type="number"
              placeholder="Advance Amount"
              value={formData.advanceAmount || ""}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Booking Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select room status</option>
              {Object.values(BookingStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="w-full grid grid-cols-2 gap-2 pt-2">
            {!page ? <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button> : ""}
            <Button type="submit" className="w-full">
              {editData ? "Update" : "Submit"}
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
}

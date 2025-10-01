"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { IBooking, IRoom } from "@/app/types";
import { Label } from "@radix-ui/react-label";
import { BookingStatus } from "@/utils/contants";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { apiFetch } from "@/lib/api";




export default function BookingAddEditModal() {
  const property_id = localStorageServiceSelectedOptions.getItem()?.property?._id;
  const [formData, setFormData] = useState<Partial<IBooking>>({
    fullName: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    verificationIdCard: "",
    verificationIdCardNumber: "",
    checkIn: "",
    checkOut: "",
    amount: 0,
    advanceAmount: 0,
    status: "Pending",
    roomId: "",
    propertyId: property_id,
  });
  const [rooms, setRooms] = useState<IRoom[]>([]);

  const fetchRooms = () => {
    apiFetch(`/api/room?propertyId=${property_id}`)
      .then(res => res.json())
      .then(setRooms);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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

    await fetch('/api/booking', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

  };

  return (
    <div className="bg-gradient-to-br from-green-700 to-green-900 ">
      <div className="h-30 flex justify-center items-center">
        <h2 className="text-3xl font-bold text-white text-center mb-2 ">Add Booking</h2>
      </div>
      <div className="absolute sm:left-[13%]  md:left-[33%]" style={{ marginTop: "-25px" }}>
        <div className="flex flex-col items-center justify-between h-full bg-white py-10 px-5 rounded-4xl sm:shadow-2xl">
          <div className="space-y-6 w-full">
            {/* <div className="flex justify-center items-center"> <Image src={logo} alt="" width={100} /></div> */}
            {/* <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-green-700 mb-2">Add Booking  </h2>
            </div> */}


            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <Label htmlFor="roomId">Room</Label>
                <select
                  id="roomId"
                  name="roomId"
                  value={formData.roomId || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.name} - ₹{room.amount}
                    </option>))}
                </select>
              </div>
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

              <div className="w-full grid grid-cols-2 gap-2">
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

              <div className="w-full grid grid-cols-2 gap-2">
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
              </div>

              <div className="w-full grid grid-cols-2 gap-2">
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
              </div>

              <div className="w-full grid grid-cols-2 gap-2">

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

                <button
                type="submit"
                className="mt-2 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
              >
                Submit 
              </button>
            </form>


          </div>

        </div>
      </div>

    </div>
  );
}

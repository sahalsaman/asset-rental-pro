"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IProperty, IRoom } from "@/app/types";
import { useState, useEffect } from "react";
import { FLAT_TYPES, RentFrequency, RoomStatus } from "@/utils/contants";
import { Label } from "@radix-ui/react-label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";

interface Props {
  property: IProperty | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editData?: IRoom | null;
}


export default function RoomAddEditModal({ property, open, onClose, onSave, editData }: Props) {
  const [formData, setFormData] = useState<Partial<IRoom>>({});
  const [isMultipleRoom, setIsMultipleRoom] = useState(false);
  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setIsMultipleRoom(false);
    } else {
      setFormData({
        frequency: RentFrequency.MONTH,
        status: RoomStatus.AVAILABLE,
      });
    }
  }, [editData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === "amount" ||
          name === "advanceAmount" ||
          name === "noOfSlots" ||
          name === "numberOfRooms"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveRoom(formData);
  };

  const handleSaveRoom = async (data: Partial<IRoom>) => {
    const method = editData ? "PUT" : "POST";
    const url = editData ? `/api/room?id=${editData._id}` : `/api/room`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...data, propertyId: property?._id, isMultipleRoom }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.error || "Failed to save room");
        return;
      }

      toast.success(editData ? "Room updated successfully" : "Room added successfully");
      onSave();
    } catch (err) {
      console.error("Error saving room:", err);
      toast.error("An error occurred. Please try again.");
    }
  };


  const isHostelOrPG = property?.category?.toLowerCase().includes("hostel") || property?.category?.toLowerCase().includes("pg") || property?.category?.toLowerCase().includes("Co-Working");
  const isFlatOrApartment = property?.category?.toLowerCase().includes("flat") || property?.category?.toLowerCase().includes("apartment") || property?.category?.toLowerCase().includes("house");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Room" : "Add Room"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="multiple-room"
              checked={isMultipleRoom}
              onCheckedChange={(checked) => setIsMultipleRoom(checked)}
            />
            <Label htmlFor="multiple-room">Multiple Rooms (Same Details)</Label>
          </div>

          {/* Conditionally show Room Number or Number of Rooms */}
          {!isMultipleRoom ? (
            <>
              <Label>Room Number</Label>
              <Input
                name="name"
                placeholder="eg : Room 101"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </>
          ) : (
            <>
              <Label>Number of Rooms</Label>
              <Input
                name="numberOfRooms"
                type="number"
                placeholder="eg: 5"
                value={formData.numberOfRooms || ""}
                onChange={handleChange}
                required
              />
            </>
          )}
          <Label>Description</Label>
          <Textarea
            name="description"
            placeholder="Enter your amenities and services"
            value={formData.description || ""}
            onChange={handleChange}
          />

          <Label>Amount</Label>
          <div className="flex items-center gap-1">
            {property?.currency}
            <Input
              name="amount"
              type="number"
              placeholder="eg: 12000"
              value={formData.amount || ""}
              onChange={handleChange}
              required
            />
          </div>
          <Label>Select Rent Duration</Label>
          <select
            name="frequency"
            value={formData.frequency || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select Rent Duration</option>
            {Object.values(RentFrequency).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>


          {isFlatOrApartment && (
            <>   <Label>Select Flat Type</Label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Select Flat Type</option>
                {FLAT_TYPES.map(flat => (
                  <option key={flat} value={flat}>
                    {flat}
                  </option>
                ))}
              </select></>
          )}

          {isHostelOrPG && (
            <>
              <Label>Number of Slots</Label>
              <Input
                name="noOfSlots"
                type="number"
                placeholder="eg: 3"
                value={formData.noOfSlots || ""}
                onChange={handleChange}
                required
              />
            </>
          )}

          <Label>Advance Amount</Label>
          <div className="flex items-center gap-1">
            {property?.currency}
            <Input
              name="advanceAmount"
              type="number"
              placeholder="eg: 12000"
              value={formData.advanceAmount || ""}
              onChange={handleChange}
            /></div>

          <Label>Status</Label>
          <select
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select room status</option>
            {Object.values(RoomStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="w-full grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className='w-full' variant="green">
              {editData ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

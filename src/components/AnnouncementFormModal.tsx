"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IAnnouncement, IProperty } from "@/app/types";
import { Label } from "./ui/label";
import { AnnouncementType, PropertyStatus } from "@/utils/contants";
import { apiFetch } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<IAnnouncement>) => void;
  editData?: IAnnouncement | null;
}

export default function AnnouncementFormModal({ open, onClose, onSave, editData }: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audienceType, setAudienceType] = useState<AnnouncementType | string>('');
  const [properties, setProperties] = useState<IProperty[]>([]);

  useEffect(() => {
    fetchProperties()
    if (editData) {
      setTitle(editData.title);
      setMessage(editData.message);
      setAudienceType(editData?.audienceType);
    } else {
      setTitle("");
      setMessage("");
      setAudienceType("all");
    }
  }, [editData]);

  const fetchProperties = async () => {
    const res = await apiFetch("/api/property?status=" + PropertyStatus.ACTIVE);
    const data = await res.json();
    setProperties(data);

  }

  const handleSubmit = () => {
    onSave({ title, message, audienceType });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Announcement" : "Add Announcement"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">

          <div>
            <Label htmlFor="title">Title</Label>
            <Input className="mt-1" placeholder="Enter title" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <textarea className="mt-1 border w-full rounded-lg p-2" id="message" name="message" placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>

          <div className="w-full">
            <Label htmlFor="audienceType">Audience</Label>
            <Select value={audienceType} onValueChange={(v: any) => setAudienceType(v)} >
              <SelectTrigger className="w-full mt-1" id="audienceType" name="audienceType">
                <SelectValue placeholder="Select audienceType" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {properties.map(p => (<SelectItem key={p._id} value={p._id as string}>{p.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>


          <Button onClick={handleSubmit}>{editData ? "Update" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

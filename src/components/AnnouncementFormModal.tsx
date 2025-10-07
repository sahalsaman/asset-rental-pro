"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IAnnouncement } from "@/app/types";
import { Label } from "./ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<IAnnouncement>) => void;
  editData?: IAnnouncement | null;
}

export default function AnnouncementFormModal({ open, onClose, onSave, editData }: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<"all" | "employees" | "customers">("all");

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setMessage(editData.message);
      setAudience(editData.audience);
    } else {
      setTitle("");
      setMessage("");
      setAudience("all");
    }
  }, [editData]);

  const handleSubmit = () => {
    onSave({ title, message, audience });
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
            <Label htmlFor="audience">Audience</Label>
            <Select value={audience} onValueChange={(v: any) => setAudience(v)} >
              <SelectTrigger className="w-full mt-1" id="audience" name="audience">
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="employees">Employees</SelectItem>
                <SelectItem value="customers">Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <Button onClick={handleSubmit}>{editData ? "Update" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

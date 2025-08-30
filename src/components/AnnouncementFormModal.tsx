"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IAnnouncement } from "@/app/types";

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
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />

          <Select value={audience} onValueChange={(v: any) => setAudience(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="employees">Employees</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSubmit}>{editData ? "Update" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

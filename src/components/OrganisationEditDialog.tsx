"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
  organisation: {
    _id: string;
    name: string;
    address?: string;
    website?: string;
  };
  onUpdated?: () => void; // optional callback after update
}

export default function EditOrganisationDialog({ open, onClose, organisation, onUpdated }: Props) {
  const [name, setName] = useState(organisation?.name || "");
  const [address, setAddress] = useState(organisation?.address || "");
  const [website, setWebsite] = useState(organisation?.website || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/organisation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address, website }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update organisation");

      onUpdated?.();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Organisation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Name*</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Organisation name" />
          </div>

          <div>
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
          </div>

          <div>
            <Label>Website</Label>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

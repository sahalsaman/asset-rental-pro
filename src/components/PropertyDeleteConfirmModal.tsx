"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteConfirmModal({ open, onClose, onConfirm, item }:any) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Property</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete <strong>{item.name}</strong>?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => onConfirm(item._id)}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

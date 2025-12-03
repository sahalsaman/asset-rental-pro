"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IAnnouncement } from "@/app/types";
import AnnouncementFormModal from "../../../components/AnnouncementFormModal";
import { apiFetch } from "@/lib/api";
import AnnouncementCard from "@/components/AnnouncementCard";
import { FullscreenLoader } from "@/components/Loader";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editAnnouncementData, setEditAnnouncementData] = useState<IAnnouncement | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loader, setLoader] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setLoader(true);
      const res = await apiFetch(`/api/announcement`);
      if (!res.ok) throw new Error("Failed to fetch announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoader(false); // ✅ Always runs, even if error occurs
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSaveAnnouncement = async (data: Partial<IAnnouncement>) => {
    const method = editAnnouncementData ? "PUT" : "POST";
    const url = editAnnouncementData
      ? `/api/announcement?id=${editAnnouncementData._id}`
      : `/api/announcement`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...data,
        // id,
        // unitId
      }),
    });

    setShowAnnouncementModal(false);
    setEditAnnouncementData(null);
    fetchAnnouncements();
  };

  const handleDeleteAnnouncement = async () => {
    if (!deleteId) return;
    await fetch(`/api/announcement?id=${deleteId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setShowDelete(false);
    setDeleteId(null);
    fetchAnnouncements();
  };



  if (loader) return <FullscreenLoader />;

  return (
    <div className="p-5 md:pt-10 md:px-32 mb-10">
      {/* Unit Header */}
      <div className="flex justify-between items-center  mb-6">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          {/* <p className="text-gray-600">Capacity: {unit.capacity}</p>
          <p className="text-gray-600">Price: ${unit.price}</p> */}
        </div>
        <Button variant="green" onClick={() => setShowAnnouncementModal(true)}>Add</Button>
      </div>

      {/* Announcement List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
              onEdit={(i) => {
                setEditAnnouncementData(i);
                setShowAnnouncementModal(true);
              }}
              onDelete={(id) => {
                setDeleteId(id);
                setShowDelete(true);
              }}
            />
          ))
        ) : (
          <p className="text-gray-500">No announcements.</p>
        )}
      </div>

      {/* Announcement Modal */}
      <AnnouncementFormModal
        open={showAnnouncementModal}
        onClose={() => {
          setShowAnnouncementModal(false);
          setEditAnnouncementData(null);
        }}
        onSave={handleSaveAnnouncement}
        editData={editAnnouncementData}
      />


    </div>
  );
}

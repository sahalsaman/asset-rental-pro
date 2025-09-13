"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {  IAnnouncement } from "@/app/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AnnouncementFormModal from "../../../components/AnnouncementFormModal";
import { apiFetch } from "@/lib/api";
import AnnouncementCard from "@/components/AnnouncementCard";

export default function RoomDetailPage() {
  const data = useParams();


  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);

  // Announcement modals state
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editAnnouncementData, setEditAnnouncementData] = useState<IAnnouncement | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const fetchAnnouncements = () => {
    apiFetch(`/api/announcement`)
      .then(res => res.json())
      .then(setAnnouncements);
  };

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
        // roomId
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

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  if (!announcements) return <p className="p-6">Loading announcement details...</p>;

  return (
    <div className="pt-10 md:px-32 px-5 mb-10">
      {/* Room Header */}
      <div className="flex justify-between items-center  mb-6">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          {/* <p className="text-gray-600">Capacity: {room.capacity}</p>
          <p className="text-gray-600">Price: ${room.price}</p> */}
        </div>
        <Button onClick={() => setShowAnnouncementModal(true)}>Add</Button>
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

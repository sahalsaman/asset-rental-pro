"use client";
import { IAnnouncement } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  announcement: IAnnouncement;
  onEdit: (a: IAnnouncement) => void;
  onDelete: (id: string) => void;
}

export default function AnnouncementCard({ announcement, onEdit, onDelete }: Props) {
  return (
    <Card className="shadow-md">
      <CardContent>
        <CardTitle className="flex justify-between">
          <span>{announcement.title}</span>
        </CardTitle>
        <p className="text-gray-600 mb-2">{announcement.message}</p>
        <div className="flex justify-between items-end">   <p className="text-xs text-gray-400">Audience: {announcement.audience}</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={() => onEdit(announcement)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(announcement._id)}>Delete</Button>
          </div></div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ManagerFormModal from "@/components/ManagerFormModal";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface Manager {
  _id: string;
  firstName: string;
  lastName?: string;
  phone: string;
  properties: { name: string }[];
  disabled: boolean;
}

export default function ManagerPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editManager, setEditManager] = useState<Manager | null>(null);
  const [error, setError] = useState<string | null>(null);

  const organisationId = "ORG_ID_FROM_SESSION_OR_CONTEXT"; // TODO: inject dynamically

  const fetchManagers = async () => {
    try {
      const res = await apiFetch(`/api/managers?organisationId=${organisationId}`);
      if (!res.ok) throw new Error("Failed to fetch managers");
      const data = await res.json();
      setManagers(data);
      setError(null);
    } catch (err) {
      setError("Error fetching managers. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleSave = async (managerData: Partial<Manager>) => {
    try {
      if (editManager) {
        const res = await fetch(`/api/managers/${editManager._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(managerData),
        });
        if (!res.ok) throw new Error("Failed to update manager");
      } else {
        const res = await fetch(`/api/managers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...managerData, organisationId }),
        });
        if (!res.ok) throw new Error("Failed to create manager");
      }
      setOpenModal(false);
      setEditManager(null);
      fetchManagers();
    } catch (err) {
      setError("Error saving manager. Please try again.");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/managers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete manager");
      fetchManagers();
    } catch (err) {
      setError("Error deleting manager. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="pt-10 md:px-32 px-5 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Managers</h1>
        <Button onClick={() => setOpenModal(true)}>Add Manager</Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {managers.length === 0 && !error ? (
        <p className="text-gray-500 text-center">No managers found. Add a manager to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managers.map((manager, index) => (
            <Card key={manager._id} className="shadow-md">
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">{manager.firstName} {manager.lastName || ""}</h3>
                <Badge variant="default">{manager.disabled ? "Disabled" : "Active"}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Phone:</span> {manager.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Properties:</span>{" "}
                  {manager.properties?.map((p) => p.name).join(", ") || "None"}
                </p>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditManager(manager);
                      setOpenModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(manager._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {openModal && (
        <ManagerFormModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditManager(null);
          }}
          onSave={handleSave}
          editData={editManager}
        />
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ManagerFormModal from "@/components/ManagerFormModal";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { FullscreenLoader, CardGridSkeleton } from "@/components/Loader";
import { Building2, Edit, Phone, PhoneCall } from "lucide-react";
import { UserRoles } from "@/utils/contants";

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
  const [loader, setLoader] = useState(false);
  const [role, setRole] = useState("");

  const fetchManagers = async () => {
    try {
      setLoader(true);
      const res = await apiFetch(`/api/managers`);
      if (!res.ok) throw new Error("Failed to fetch managers");
      const data = await res.json();
      setRole(data?.role);
      if (data?.managers) {
        setManagers(data?.managers);
      }
      setError(null);
      setLoader(false);
    } catch (err: any) {
      setError("Error fetching managers. Please try again.");
      console.error(err);

      setLoader(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleSave = async (managerData: Partial<Manager>) => {
    try {

      if (editManager) {
        const res = await fetch("/api/managers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...managerData, managerId: editManager._id }),
        });
        if (!res.ok) throw new Error("Failed to update manager");
      } else {
        const res = await fetch(`/api/managers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(managerData),
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
    <div className="p-5 md:pt-10 md:px-16 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Managers</h1>
        {role !== UserRoles.MANAGER ? <Button variant="green" onClick={() => setOpenModal(true)}>Add Manager</Button> : ""}
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      {loader ? <CardGridSkeleton count={3} /> :
        managers.length === 0 && !error ? (
          role === UserRoles.MANAGER ? <p className="text-gray-500 text-center">You do not have permission to view this page.</p> :
            <p className="text-gray-500 text-center">No managers found. Add a manager to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managers.map((manager, index) => (
              <Card key={manager._id} className="shadow-md p-4">
                <CardContent className="p-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{manager.firstName} {manager.lastName || ""}</h3>
                    <Badge variant="default">{manager.disabled ? "Disabled" : "Active"}</Badge>
                  </div>

                  {manager?.phone && <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <p className="text-sm text-gray-600 ">
                      {manager.phone}
                    </p>
                  </div>}
                  {manager.properties?.length ? <div className="flex items-center gap-2 mt-1">
                    <Building2 size={16} />
                    <p className="text-sm text-gray-600 ">
                      {manager.properties?.map((p) => p.name).join(", ") || "None"}
                    </p>
                  </div> : ""}


                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditManager(manager);
                        setOpenModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {/* <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(manager._id)}
                  >
                    Delete
                  </Button> */}
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
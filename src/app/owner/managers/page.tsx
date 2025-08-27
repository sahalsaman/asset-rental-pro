"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ManagerFormModal from "@/components/ManagerFormModal";
import { apiFetch } from "@/lib/api";


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

  const organisationId = "ORG_ID_FROM_SESSION_OR_CONTEXT"; // TODO: inject dynamically

  const fetchManagers = async () => {
    const res = await apiFetch(`/api/managers?organisationId=${organisationId}`);
    const data = await res.json();
    setManagers(data);
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleSave = async (managerData: Partial<Manager>) => {
    if (editManager) {
      await fetch(`/api/managers/${editManager._id}`, {
        method: "PUT",
        body: JSON.stringify(managerData),
      });
    } else {
      await fetch(`/api/managers`, {
        method: "POST",
        body: JSON.stringify(managerData ),
      });
    }
    setOpenModal(false);
    setEditManager(null);
    fetchManagers();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/managers/${id}`, { method: "DELETE" });
    fetchManagers();
  };

  return (
    <div className="pt-10 md:px-32 px-5 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Managers</h1>
        <Button onClick={() => setOpenModal(true)}>Add Manager</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Properties</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {managers.length ? managers.map((m, i) => (
            <TableRow key={m._id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                <div>
                  <p>{m.firstName} {m.lastName}</p>
                  {m.phone}
                </div></TableCell>
              <TableCell></TableCell>
              <TableCell>{m.properties?.map((p) => p.name).join(", ")}</TableCell>
              <TableCell>{m.disabled ? "Disabled" : "Active"}</TableCell>
              <TableCell className="text-right flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => { setEditManager(m); setOpenModal(true); }}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(m._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          )) : ""}
        </TableBody>
      </Table>

      {openModal && (
        <ManagerFormModal
          open={openModal}
          onClose={() => { setOpenModal(false); setEditManager(null); }}
          onSave={handleSave}
          editData={editManager}
        />
      )}
    </div>
  );
}

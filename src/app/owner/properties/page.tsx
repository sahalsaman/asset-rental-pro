"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PropertyCard from "../../../components/PropertyCard";
import PropertyFormModsl from "../../../components/PropertyFormModal";
import DeleteConfirmModal from "../../../components/PropertyDeleteConfirmModal";
import { apiFetch } from "@/lib/api";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProperty, setSelectedProperty]= useState<any|null>(null);


  const fetchProperties = async () => {
    const res = await apiFetch("/api/property");
    const data = await res.json();
    setProperties(data);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSave = async (formData:any) => {
    if (selectedProperty?._id) {
      await fetch(`/api/property?id=${selectedProperty?._id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {  "Content-Type": "application/json" },
      });
    } else {
      await fetch("/api/property", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
    }
    setAddEditOpen(false);
    setSelectedProperty(null);
    fetchProperties();
  };

  const handleDelete = async (id:string) => {
    await fetch(`/api/property?id=${id}`, { method: "DELETE" });
    setDeleteOpen(false);
    setSelectedProperty(null);
    fetchProperties();
  };

  return (
    <div className=" p-5 md:pt-10 md:px-32 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Button onClick={() => { setAddEditOpen(true); setSelectedProperty(null); }}>
          Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.length?properties?.map((property:any) => (
          <PropertyCard
            key={property?._id}
            property={property}
            onEdit={(p:any) => { setSelectedProperty(p); setAddEditOpen(true); }}
            onDelete={(p:any) => { setSelectedProperty(p); setDeleteOpen(true); }}
          />
        ))   : (
          <p className="text-gray-500">No properties.</p>
        )}
      </div>

      <PropertyFormModsl
        open={addEditOpen}
        onClose={() => setAddEditOpen(false)}
        onSave={handleSave}
        initialData={selectedProperty}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        item={selectedProperty}
      />
    </div>
  );
}

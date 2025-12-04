"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PropertyCard from "../../../components/PropertyCard";
import PropertyFormModal from "../../../components/PropertyFormModal";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FullscreenLoader } from "@/components/Loader";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [organisation, setOrganisation] = useState<any | null>(null);
  const current_property = localStorageServiceSelectedOptions.getItem()?.property

  const fetchProperties = async () => {
    const res = await apiFetch("/api/property");
    const data = await res.json();
    setProperties(data);
  };

  const fetchOrganisation = async () => {
    const res = await apiFetch("/api/organisation");
    const data = await res.json();
    setOrganisation(data);
  };

  useEffect(() => {
    fetchProperties();
      fetchOrganisation()
  }, []);

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Properties" },
  ];
  if (!properties) return <FullscreenLoader />;

  return (
    <div className=" p-5 md:pt-10 md:px-32 mb-10">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        {organisation?.subscription && <Button onClick={() => { setAddEditOpen(true); setSelectedProperty(null); }} variant="green">
          Add Property
        </Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.length ? properties?.map((property: any) => (
          <PropertyCard
            key={property?._id}
            property={property}
            currentProperty={current_property}
            onEdit={(p: any) => { setSelectedProperty(p); setAddEditOpen(true); }}
            onDelete={(p: any) => { setSelectedProperty(p); setDeleteOpen(true); }}

          />
        )) : (
          <p className="text-gray-500">No properties.</p>
        )}
      </div>

      <PropertyFormModal
        open={addEditOpen}
        onClose={() => {
          setAddEditOpen(false);
        }}
        onSave={() => {
          setAddEditOpen(false);
          window.location.reload();
          // fetchProperties();
        }}
        initialData={selectedProperty}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={fetchProperties}
        item={selectedProperty}
      />
    </div>
  );
}

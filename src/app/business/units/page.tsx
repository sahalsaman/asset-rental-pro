"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IUnit } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import UnitCard from "@/components/UnitCard";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import UnitAddEditModal from "@/components/UnitFormModal";
import { FullscreenLoader, CardGridSkeleton } from "@/components/Loader";
import { PlusIcon } from "lucide-react";

export default function UnitListPage() {
  const property = localStorageServiceSelectedOptions.getItem()?.property
  const [units, setUnits] = useState<IUnit[]>([]);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [editUnitData, setEditUnitData] = useState<IUnit | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchUnits();
  }, []);


  const fetchUnits = async () => {
    const res = await apiFetch(`/api/unit?propertyId=${property?._id}`)
    const data = await res.json();
    setUnits(data);
    setLoading(false);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/business" },
    { label: property?.name || "Property" },
  ];

  return (
    <div className="">
      {/* Property Header */}
      {/* <div className="flex flex-col justify-between items-start  gap-3 bg-slate-100 md:p-14 md:px-16 p-5 shadow-sm">


        <Breadcrumbs items={breadcrumbItems} />
        <div className="w-full flex justify-between ">
          <div className="flex items-center gap-4">

            <div className="w-14 h-14 bg-blue-200 rounded-md flex items-center justify-center text-gray-500 text-2xl">
              {property?.name?.charAt(0).toUpperCase()}
            </div>


            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{property?.name}</h1>
              <p className="text-sm text-gray-600">
                {property?.address}, {property?.city}, {property?.state} {property?.zipCode}, {property?.country}
              </p>
              <Badge variant="default">{property?.category}</Badge>
         
            </div>
          </div>
          <div className="flex gap-2"> 
         
            <Button onClick={() => setShowUnitModal(true)} className="whitespace-nowrap hidden sm:block">
              Add Unit
            </Button></div>
        </div>
      </div> */}
      <div className="p-5 md:pt-10 md:px-16 mb-10">
        <div className="flex justify-between  items-center  mb-5">
          <h1 className="text-2xl font-bold">Units</h1>
          <Button onClick={() => setShowUnitModal(true)} variant="green" className="whitespace-nowrap ">
            <PlusIcon className="w-6 h-6" /> Add Unit
          </Button>
        </div>
        {/* Units Grid */}
        {loading ? <CardGridSkeleton count={4} /> :
          units.length === 0 ? (
            <p className="text-gray-500 text-center">No units/space found. <br />Add a unit/space to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {units.map(unit => (
                <UnitCard
                  key={unit._id}
                  unit={unit}
                  property={property}
                  onEdit={(unit) => {
                    setEditUnitData(unit);
                    setShowUnitModal(true);
                  }}
                  onDelete={(id) => {
                    setDeleteId(id);
                    setShowDelete(true);
                  }}
                  onBook={(unit) => {
                    setSelectedUnit(unit);
                    setShowBookingModal(true);
                  }}
                />
              ))}
            </div>)}
      </div>
      <UnitAddEditModal
        property={property}
        open={showUnitModal}
        onClose={() => {
          setShowUnitModal(false);
        }}
        onSave={() => {
          setShowUnitModal(false);
          fetchUnits();
        }}
      />

    </div>
  );
}

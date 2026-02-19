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
import { PlusIcon, Settings } from "lucide-react";

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

  const [bulkUpdateType, setBulkUpdateType] = useState<string | null>(null);

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
            <div className="space-y-12">
              {Object.entries(
                units.reduce((acc, unit) => {
                  const type = unit.type || "Other";
                  if (!acc[type]) acc[type] = [];
                  acc[type].push(unit);
                  return acc;
                }, {} as Record<string, IUnit[]>)
              ).map(([type, groupUnits]) => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-gray-800 capitalize">{type}</h2>
                      <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px] bg-slate-100 text-slate-500 border-none font-bold">
                        {groupUnits.length}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      onClick={() => {
                        setBulkUpdateType(type);
                        setShowUnitModal(true);
                      }}
                    >
                      <Settings size={14} className="mr-1" /> Edit Group
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupUnits.map(unit => (
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
                  </div>
                </div>
              ))}
            </div>)}
      </div>
      <UnitAddEditModal
        property={property}
        open={showUnitModal}
        bulkType={bulkUpdateType}
        onClose={() => {
          setShowUnitModal(false);
          setBulkUpdateType(null);
          setEditUnitData(null);
        }}
        onSave={() => {
          setShowUnitModal(false);
          setBulkUpdateType(null);
          setEditUnitData(null);
          fetchUnits();
        }}
        editData={editUnitData}
      />

    </div>
  );
}

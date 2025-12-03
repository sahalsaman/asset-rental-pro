"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import { Edit, Globe, MapPin } from "lucide-react";
import { UserRoles } from "@/utils/contants";
import { IUser } from "@/app/types";
import { useRouter } from "next/navigation";
import EditOrganisationDialog from "@/components/OrganisationEditDialog";
import toast from "react-hot-toast";

export default function PropertiesPage() {
  const [organisation, setOrganisation] = useState<any | null>(null);
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();


  const fetchUser = async () => {
    const res = await apiFetch("/api/me");
    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
    fetchOrganisation();
  }, []);

  const fetchOrganisation = async () => {
    const res = await apiFetch("/api/organisation");
    const data = await res.json();
    setOrganisation(data);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Organisation" },
  ];
  if (!organisation) return <FullscreenLoader />;

  return (
    <div>
      <div className="flex flex-col justify-between items-start md:items-center gap-3 bg-slate-100 md:p-14 md:px-32 p-5 shadow-sm">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <div className="w-full flex justify-between ">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-200 rounded-md flex items-center justify-center text-gray-500 text-2xl">
              {organisation?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{organisation?.name}</h1>
              <p className="text-sm">Organisation</p>
            </div>
          </div>
          <Button size="icon" variant="outline" onClick={() => { setOrgModalOpen(true) }} >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
        <div>
          {organisation?.address ? <p className="flex gap-1 items-center"><MapPin size={14} />{organisation?.address}</p> : ""}
          {organisation?.website ? <p className="flex gap-1 items-center"><Globe size={14} />{organisation?.website}</p> : ""}
        </div>
      </div>
      <div className=" p-1 md:pt-10 md:px-32 mb-10">


        <div className="flex flex-col text-md">
          {user?.role === UserRoles.OWNER ? <a className="p-4 border-b-1 border-b-gray-200" onClick={() => router.push('/owner/properties')}>
            Properties
          </a> : ""}
          {/* {user?.role === UserRoles.OWNER ? <a className="p-4 border-b-1 border-b-gray-200" >
            Automated invoicing & payments <br /><span className="bg-green-700 text-white text-xs p-1 px-2 rounded-md font-semibold">Coming Soon..</span>
          </a> : ""} */}
          {user?.role === UserRoles.OWNER ? <a className="p-4 border-b-1 border-b-gray-200" onClick={() => router.push('/owner/bank-upi-list')}>
            Bank & UPI Details
          </a> : ""}
          {user?.role === UserRoles.OWNER ? <a className="p-4 border-b-1 border-b-gray-200" onClick={() => router.push('/owner/subscription-plan')}>
            Subscription
          </a> : ""}
           {user?.role === UserRoles.OWNER ? <a className="p-4 border-b-1 border-b-gray-200" onClick={() => router.push('/owner/subcription-payments')}>
            Subscription Payments
          </a> : ""}

        </div>
      </div>
      <EditOrganisationDialog
        open={orgModalOpen}
        onClose={() => setOrgModalOpen(false)}
        organisation={organisation}
        onUpdated={() => {
          fetchOrganisation()
          toast.success("Updated successfully!")
        }}
      />

    </div>
  );
}

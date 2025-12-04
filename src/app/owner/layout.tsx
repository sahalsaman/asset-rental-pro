'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { User, XIcon, Home, Building2, Store, Building, Lamp, } from 'lucide-react'; // icons
import localStorageServiceSelectedOptions from '@/utils/localStorageHandler';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { IProperty } from '../types';
import { PropertyStatus, SubscritptionStatus, UserRoles } from '@/utils/contants';
import SubscriptionPlan from './subscription-plan/page';
import { Button } from '@/components/ui/button';
import { app_config } from '../../../app-config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const prop = localStorageServiceSelectedOptions.getItem()?.property;
  const router = useRouter();
  const pathname = usePathname();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [organisation, setOrganisation] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { title: 'Dashboard', path: '/owner/dashboard' },
    { title: 'Organisation', path: '/owner/organisation' },
    { title: 'Properties', path: '/owner/properties' },
    { title: 'Units / Rooms', path: '/owner/units' },
  ]

  const mobileMenu = [
    { title: 'Dashboard', path: '/owner/dashboard', icon: <Home size={22} /> },
    { title: 'Units/Rooms', path: '/owner/units', icon: <Lamp size={21} /> },
    { title: 'Properties', path: '/owner/properties', icon: <Building size={22} /> },
    { title: 'Organisation', path: '/owner/organisation', icon: <Building2 size={22} /> },
    // { title: 'Profile', path: '/owner/profile', icon: <UserCircle size={21} /> },
  ];

  const fetchUser = async () => {
    try {
      const res = await apiFetch("/api/me");
      const data = await res.json();
      setUser(data)
      if (data.role !== UserRoles.OWNER && data.role !== UserRoles.MANAGER && data.role !== UserRoles.ADMIN) {
        router.push('/');
      }
    }
    catch (err) {
      console.log(err);
    }
  };


  const fetchProperties = async () => {
    const res = await apiFetch("/api/property?status=" + PropertyStatus.ACTIVE);
    const data = await res.json();
    setProperties(data);
    if (data.length > 0) {
      if (prop && prop?._id) {
        setSelectedPropertyId(prop?._id);
        return;
      } else {
        localStorageServiceSelectedOptions.setItem({ property: data[0] });
        setSelectedPropertyId(data[0]._id);
      }
    };
  }

  const fetchOrganisation = async () => {
    const res = await apiFetch("/api/organisation");
    const data = await res.json();
    setOrganisation(data);
  };


  useEffect(() => {
    fetchUser()
    fetchOrganisation();
    fetchProperties();
  }, []);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setSelectedPropertyId(value);
    const prop = properties.find(p => p._id === value)
    localStorageServiceSelectedOptions.setItem({ property: prop });
    window.location.reload();
  };



  return (
    <div className="min-h-screen pb-24">
      <div className=" w-full bg-cover bg-center bg-green-700 md:px-32 px-5  py-5">
        <div className="w-full flex justify-between items-center">
          {/* Desktop Nav */}
          <div className=" mr-5  block lg:hidden">
            <div
              className=" flex items-center gap-3"
            >
              {/* <ArrowLeft className={` text-white cursor-pointer   ${pathname === "/owner/dashboard" ? "hidden" : "block"}`} onClick={() => router.back()} /> */}
              <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={30} className='cursor-pointer'
                onClick={() => router.push('/owner/dashboard')} />
            </div>

          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={30} className='cursor-pointer' />
              <h1
                onClick={() => router.push('/owner/dashboard')}
                className="text-3xl font-bold text-white mr-5 cursor-pointer"
              >
                Rentities
              </h1></div>
            {options.map((card, idx) => (
              <div
                key={idx}
                onClick={() => router.push(card.path)}
                className={`cursor-pointer hover:border-b-white text-white font-light 
                  ${pathname === card.path ? "border-b-1 border-white text-green-300" : ""}`}
              >
                <span>{card.title}</span>
              </div>
            ))}
          </div>
          {/* Profile Dropdown */}
          <div className="flex items-center gap-8">

            {user?.role == UserRoles.OWNER ?
              <div className='hidden md:block'>
                {properties?.length ? <div >
                  {/* <p className='text-white'>Current Property</p> */}
                  <div className='w-full  bg-green-800 border-green-800 border rounded-md flex items-center justify-between pr-2'>
                    <Building className='ml-4 text-white' />
                    <select
                      name="frequency"
                      value={selectedPropertyId || ""}
                      onChange={handleChange}
                      className=" text-white focus:outline-none hover:border-b-white border-0 outline-0 pr-2"
                      style={{ minWidth: "220px", border: "0px", height: "48px" }}
                      required
                    >
                      <option value=""> Select Property</option>
                      {properties.map((property: any) => (
                        <option key={property?._id} value={property?._id}>
                          {property?.name} - {property?.category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div> :
                  organisation?.subscription ?
                    <Button className=" w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/owner/properties')}>
                      Add Property
                    </Button> :
                    <Button className=" w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/owner/subscription-plan')}>
                      Start Free Trial
                    </Button>
                }
              </div> : ""}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => router.push('/owner/profile')}
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-900 text-white cursor-pointer"
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </div>

        {user?.role == UserRoles.OWNER ? <div className='block md:hidden mt-2'>
          {properties?.length ?
            <div className='w-full  bg-green-800 border-green-800 border rounded-md flex items-center justify-between pr-2'>
              <Building className='ml-3 text-white' />
              <select
                name="frequency"
                value={selectedPropertyId || ""}
                onChange={handleChange}
                className=" text-white focus:outline-none hover:border-b-white border-0 outline-0 pr-2"
                style={{ minWidth: "220px", border: "0px", height: "48px" }}
                required
              >
                <option value=""> Select Property</option>
                {properties.map((property: any) => (
                  <option key={property?._id} value={property?._id}>
                    {property?.name} - {property?.category}
                  </option>
                ))}
              </select>
            </div>
            :
            organisation?.subscription ?
              <Button className=" w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/owner/properties')}>
                Add Property
              </Button> :
              <Button className=" w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/owner/subscription-plan')}>
                Start Free Trial
              </Button>
          }
        </div> : ""}
      </div>
      {organisation?.subscription?.status && organisation?.subscription?.status !== SubscritptionStatus.ACTIVE ? <div className=" bg-amber-300 py-2 md:px-32 px-5 flex items-center justify-between text-sm">
        {organisation?.subscription?.status === SubscritptionStatus.FREE ? 'Your subscription is free' : organisation?.subscription?.status === SubscritptionStatus.EXPIRED ? 'Your subscription has expired. Please renew to continue using our services.' : organisation?.subscription?.status === SubscritptionStatus.CANCELLED ? 'Your subscription has been cancelled. Please contact support for more information.' : ''}
      </div> : ""}

      {organisation?.subscription?.status === SubscritptionStatus.EXPIRED ? <SubscriptionPlan /> : <main>{children}</main>}

      {/* Mobile Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-evenly py-4 lg:hidden">
        {mobileMenu.map((item, idx) => (
          <button
            key={idx}
            onClick={() => router.push(item.path)}
            className={`flex flex-col gap-1 items-center text-xs ${pathname === item.path ? "text-green-600" : "text-gray-500"
              }`}
          >
            {item.icon}
            <span>{item.title}</span>
          </button>
        ))}
      </div>

    </div>
  );
}

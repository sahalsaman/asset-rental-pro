'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, XIcon, Home, Building2, BuildingIcon, BadgeDollarSign, UserCircle, } from 'lucide-react'; // icons
import localStorageServiceSelectedOptions from '@/utils/localStorageHandler';
import logo from "../../../public/arp logo-white.png"
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { IProperty } from '../types';
import { SubscritptionStatus } from '@/utils/contants';
import SubscriptionPlan from './subscription-plan/page';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const prop = localStorageServiceSelectedOptions.getItem()?.property;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [organisation, setOrganisation] = useState<any | null>(null);
  const [app_data, setApp_data] = useState<any | null>(null);


  const options = [
    { title: 'Dashboard', path: '/owner/dashboard' },
    { title: 'Organisation', path: '/owner/organisation' },
    { title: 'Payments', path: '/owner/payments' },
  ];

  const mobileMenu = [
    { title: 'Dashboard', path: '/owner/dashboard', icon: <Home size={21} /> },
    { title: 'Rooms', path: '/owner/rooms', icon: <BuildingIcon size={21} /> },
    { title: 'Payments', path: '/owner/payments', icon: <BadgeDollarSign size={21} /> },
    // { title: 'Organisation', path: '/owner/organisation', icon: <Building2 size={20} /> },
    { title: 'Profile', path: '/owner/profile', icon: <UserCircle size={21} /> },
  ];

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  const fetchProperties = async () => {
    const res = await apiFetch("/api/property");
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

  const remainingDate = (endDate: string) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    currentDate.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - currentDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Your subscription has expired. Please renew to continue using our services.";
    return `You have ${diffDays} day${diffDays > 1 ? "s" : ""} remaining in your free trial.`;
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
              <Image src={logo} alt="Logo" width={40} className='cursor-pointer'
                onClick={() => router.push('/owner/dashboard')} />
            </div>

          </div>
          <div className="hidden lg:flex items-center gap-4">
            <h1
              onClick={() => router.push('/owner/dashboard')}
              className="text-2xl font-bold text-white mr-5 cursor-pointer"
            >
              <Image src={logo} alt="Logo" width={50} className='cursor-pointer' />
            </h1>
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

          <div className='hidden md:block'>
            {properties?.length ? <div >
              {/* <p className='text-white'>Current Property</p> */}
              <div className='w-full  bg-green-800 border-green-800 border rounded-md flex items-center justify-between pr-2'>
                <Building2 className='ml-4 text-white' />
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
              <Button className=" w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/owner/subscription-plan')}>
                Start Free Trial
              </Button>
            }
          </div>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-green-900 text-white cursor-pointer"
            >
              {!open ? <User size={20} /> : <XIcon size={20} />}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 min-w-80 w-full md:w-48  bg-white border rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push('/owner/profile');
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push('/owner/organisation');
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Help & Support
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
        <div className='block md:hidden'>
          {properties?.length ? <div className='mt-2'>
            {/* <p className='text-white'>Current Property</p> */}
            <div className='w-full  bg-green-800 border-green-800 border rounded-md flex items-center justify-between pr-2'>
              <Building2 className='ml-2 text-white' />
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
            <Button className="mt-3 w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/owner/subscription-plan')}>
              Start Free Trial
            </Button>
          }
        </div>
      </div>
      {organisation?.subscription?.status && organisation?.subscription?.status !== SubscritptionStatus.ACTIVE ? <div className=" bg-amber-300 py-2 md:px-32 px-5 flex items-center justify-between text-sm">
        {organisation?.subscription?.status === SubscritptionStatus.TRIAL ? `${remainingDate(organisation?.subscription?.endDate)}` : organisation?.subscription?.status === SubscritptionStatus.PENDING ? 'Your subscription is pending' : organisation?.subscription?.status === SubscritptionStatus.EXPIRED ? 'Your subscription has expired. Please renew to continue using our services.' : organisation?.subscription?.status === SubscritptionStatus.CANCELLED ? 'Your subscription has been cancelled. Please contact support for more information.' : ''}
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

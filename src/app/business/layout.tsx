'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { User, XIcon, Home, Building2, Store, Building, Lamp, Calendar, NotepadTextDashed, MessageCircleMore, Users, PlusIcon, QrCodeIcon, ReceiptIndianRupee, Crown, ChartBar, TrendingUp, TrendingDown, SettingsIcon, Star, Stars, LayoutDashboard, } from 'lucide-react'; // icons
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
  const [business, setBusiness] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { title: 'Profile', path: '/business/profile', icon: <User size={26} /> },
    { title: 'Business', path: '/business/business', icon: <SettingsIcon size={26} /> },
    { title: 'Dashboard', path: '/business/dashboard', icon: <LayoutDashboard size={26} /> },
    { title: 'Properties', path: '/business/properties', icon: <Building size={26} /> },
    { title: 'Units/Rooms', path: '/business/units', icon: <Lamp size={26} /> },
    { title: 'Bookings', path: '/business/bookings', icon: <Calendar size={26} /> },
    { title: 'Finances', path: '/business/revenue', icon: <ReceiptIndianRupee size={26} /> },
    { title: 'Broadcast', path: '/business/announcement', icon: <MessageCircleMore size={26} /> },
    { title: 'Managers', path: '/business/managers', icon: <Users size={26} /> },
    { title: 'Reviews', path: '/business/review-management', icon: <Stars size={26} /> },
  ];

  const mobileMenu = [
    { title: 'Dashboard', path: '/business/dashboard', icon: <LayoutDashboard size={22} /> },
    { title: 'Bookings', path: '/business/bookings', icon: <Calendar size={22} /> },
    { title: 'Units/Rooms', path: '/business/units', icon: <Lamp size={22} /> },
    { title: 'Business', path: '/business/business', icon: <SettingsIcon size={22} /> },
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

  const fetchBusiness = async () => {
    const res = await apiFetch("/api/business");
    const data = await res.json();
    setBusiness(data);
  };


  useEffect(() => {
    fetchUser()
    fetchBusiness();
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
    <div className="h-screen flex flex-col overflow-hidden">
      <div className=" w-full bg-cover bg-center bg-green-700 md:px-16 px-5  py-5 md:py-3">
        <div className="w-full flex justify-between items-center">
          {/* Desktop Nav */}
          <div className=" mr-5  block lg:hidden">
            <div
              className=" flex items-center gap-3"
            >
              {/* <ArrowLeft className={` text-white cursor-pointer   ${pathname === "/business/dashboard" ? "hidden" : "block"}`} onClick={() => router.back()} /> */}
              <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={30} className='cursor-pointer'
                onClick={() => router.push('/business/dashboard')} />
            </div>

          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={30} className='cursor-pointer' />
              <h1
                onClick={() => router.push('/business/dashboard')}
                className="text-3xl font-bold text-white mr-5 cursor-pointer"
              >
                {business?.name}
              </h1></div>
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
                  business?.subscription ?
                    <Button className=" w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/business/properties')}>
                      Add Property
                    </Button> :
                    <Button className=" w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/business/subscription-plan')}>
                      Start Free Trial
                    </Button>
                }
              </div> : ""}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => router.push('/business/profile')}
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
            business?.subscription ?
              <Button className=" w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/business/properties')}>
                Add Property
              </Button> :
              <Button className=" w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/business/subscription-plan')}>
                Start Free Trial
              </Button>
          }
        </div> : ""}
      </div>
      {business?.subscription?.status && business?.subscription?.status !== SubscritptionStatus.ACTIVE ? <div className=" bg-amber-300 py-2 md:px-16 px-5 flex items-center justify-between text-sm">
        {business?.subscription?.status === SubscritptionStatus.FREE ? 'Your subscription is free' : business?.subscription?.status === SubscritptionStatus.EXPIRED ? 'Your subscription has expired. Please renew to continue using our services.' : business?.subscription?.status === SubscritptionStatus.CANCELLED ? 'Your subscription has been cancelled. Please contact support for more information.' : ''}
      </div> : ""}
      <div className="flex-1 flex overflow-hidden" >
        <div className='lg:flex hidden py-6 border-r border-gray-200 flex-col overflow-y-auto shrink-0 '>
          {options.map((item, idx) => (
            <button
              key={idx}
              onClick={() => router.push(item.path)}
              className={`flex flex-col gap-1 items-center text-xs cursor-pointer px-6 py-4 ${(item.path === '/business/dashboard' && pathname === '/business/dashboard') ||
                (item.path === '/business/revenue' && (pathname.startsWith('/business/revenue') || pathname.startsWith('/business/invoices') || pathname.startsWith('/business/expenses'))) ||
                (item.path !== '/business/dashboard' && item.path !== '/business/revenue' && pathname.startsWith(item.path))
                ? "text-green-600 border-l-4 border-green-600 bg-green-50" : "text-gray-500"
                } ${idx == 1 ? 'border-b-1 border-b-gray-200' : ''}`}
            >
              {item.icon}
            </button>
          ))}
        </div>
        {business?.subscription?.status === SubscritptionStatus.EXPIRED ?
          <div className="flex-1 overflow-y-auto"><SubscriptionPlan /></div> :
          <main className='flex-1 overflow-y-auto'>{children}</main>}
      </div>
      {/* Mobile Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-evenly py-4 lg:hidden">
        {mobileMenu.map((item, idx) => (
          <button
            key={idx}
            onClick={() => router.push(item.path)}
            className={`flex flex-col gap-1 items-center text-xs ${(item.path === '/business/dashboard' && pathname === '/business/dashboard') ||
              (item.path === '/business/revenue' && (pathname.startsWith('/business/revenue') || pathname.startsWith('/business/invoices') || pathname.startsWith('/business/expenses'))) ||
              (item.path !== '/business/dashboard' && item.path !== '/business/revenue' && pathname.startsWith(item.path))
              ? "text-green-600" : "text-gray-500"
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

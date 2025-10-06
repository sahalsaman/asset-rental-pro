'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, User, XIcon, Home, Building2, Printer, Megaphone, BuildingIcon, Users, ArrowBigLeft, ArrowLeft, } from 'lucide-react'; // icons
import localStorageServiceSelectedOptions from '@/utils/localStorageHandler';
import logo from "../../../public/arp logo-white.png"
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { IProperty } from '../types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const setQRcodeUrl = (propertyId: string) => {
    const selectedProp = properties.find((prop: IProperty) => prop._id === propertyId);
    setQrUrl(`http://arp.webcos.co/booking-form?property_id=${propertyId}`);
  }
  const options = [
    { title: 'Dashboard', path: '/owner/dashboard' },
    { title: 'Properties', path: '/owner/properties' },
    { title: 'Rooms', path: '/owner/rooms' },
    { title: 'Bookings', path: '/owner/bookings' },
    { title: 'Invoices', path: '/owner/invoices' },
    { title: 'Managers', path: '/owner/managers' },
    { title: 'Announcement', path: '/owner/announcement' },
  ];

  const mobileMenu = [
    { title: 'Dashboard', path: '/owner/dashboard', icon: <Home size={20} /> },
    { title: 'Rooms', path: '/owner/rooms', icon: <BuildingIcon size={20} /> },
    { title: 'Organisation', path: '/owner/organisation', icon: <Building2 size={20} /> },
    { title: 'Profile', path: '/owner/profile', icon: <User size={20} /> },
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
      setSelectedProperty(data[0]._id);
      localStorageServiceSelectedOptions.setItem({ property: data[0] });
      setQRcodeUrl(data[0]._id);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setSelectedProperty(value);
    localStorageServiceSelectedOptions.setItem({ property: value });
    setQRcodeUrl(value);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Navbar */}
      <div
        className=" w-full bg-cover bg-center bg-green-700 md:px-32 px-5 h-16 md:h-20  flex items-center"
      >
        <div className="w-full flex justify-between items-center">
          {/* Desktop Nav */}
          <div className=" mr-5  block md:hidden">
            <div
              className=" flex items-center gap-3"
            >
              {/* <ArrowLeft className={` text-white cursor-pointer   ${pathname === "/owner/dashboard" ? "hidden" : "block"}`} onClick={() => router.back()} /> */}
              <Image src={logo} alt="Logo" width={40} className='cursor-pointer'
                onClick={() => router.push('/owner/dashboard')} />
            </div>

          </div>
          <div className="hidden md:flex items-center gap-4">
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
          <div>
            <select
              name="frequency"
              value={selectedProperty || ""}
              onChange={handleChange}
              className="w-full  bg-green-800 border-green-800 text-white focus:outline-none hover:border-b-white border-0 outline-0 pr-2"
              style={{minWidth: "220px",border:"0px",height:"44px"}}
              required
            >
              <option value=""> Select Property</option>
              {properties.map((property: any) => (
                <option key={property?._id} value={property?._id}>
                  {property?.name}
                </option>
              ))}
            </select>
          </div>
          {/* Profile Dropdown */}
          <div className="relative">

            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-green-900 text-white cursor-pointer"
            >
              {!open ? <User size={16} /> : <XIcon size={20} />}
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
                  Organisation
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

      <main>{children}</main>
      {/* Mobile Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-4 md:hidden">
        {mobileMenu.map((item, idx) => (
          <button
            key={idx}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center text-xs ${pathname === item.path ? "text-green-600" : "text-gray-500"
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

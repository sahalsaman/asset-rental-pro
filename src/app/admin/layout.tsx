'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Building, Building2, FormInput, Home, Lamp, NotepadText, Tags, User, Users,  } from 'lucide-react'; 
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { app_config } from '../../../app-config';
import { UserRoles } from '@/utils/contants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { title: 'Dashboard', path: '/admin/dashboard' },
    { title: 'Organisations', path: '/admin/organisations' },
    { title: 'Properties', path: '/admin/properties' },
    { title: 'Users', path: '/admin/users' },
    { title: 'Enquies', path: '/admin/enquiries' },
    { title: 'Leads', path: '/admin/leads' },
  ]

    const mobileMenu = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: <Home size={22} /> },
    { title: 'Organisations', path: '/admin/organisations', icon: <Building2 size={22} /> },
    { title: 'Users', path: '/admin/users', icon: <Users size={21} /> },
    { title: 'Enquiries', path: '/admin/enquiries', icon: <NotepadText size={22} /> },
    { title: 'Leads', path: '/admin/leads', icon: <Tags size={22} /> },
  ];

  const fetchUser = async () => {
    try {
      const res = await apiFetch("/api/me");
      const data = await res.json();
      setUser(data)
     if(data.role !== UserRoles.ADMIN) router.push('/');
    }
    catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    fetchUser()
  }, []);




  return (
    <div className="min-h-screen pb-24">
      <div className=" w-full bg-cover bg-center bg-black md:px-32 px-5  py-5">
        <div className="w-full flex justify-between items-center">
          {/* Desktop Nav */}
          <div className=" mr-5  block lg:hidden">
            <div
              className=" flex items-center gap-3"
            >
              {/* <ArrowLeft className={` text-white cursor-pointer   ${pathname === "/admin/dashboard" ? "hidden" : "block"}`} onClick={() => router.back()} /> */}
              <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={30} className='cursor-pointer'
                onClick={() => router.push('/admin/dashboard')} />
            </div>

          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Image src={app_config.APP_LOGO_DARK_THEME} alt="Logo" width={30} className='cursor-pointer' />
              <h1
                onClick={() => router.push('/admin/dashboard')}
                className="text-3xl font-bold text-white mr-5 cursor-pointer"
              >
               Admin
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

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => router.push('/admin/profile')}
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 text-white cursor-pointer"
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
      <main>{children}</main>
     {/* Mobile Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-evenly py-4 lg:hidden">
        {mobileMenu.map((item, idx) => (
          <button
            key={idx}
            onClick={() => router.push(item.path)}
            className={`flex flex-col gap-1 items-center text-xs text-gray-500 p-2 rounded-xl ${pathname === item.path ? "bg-gray-100 " : ""
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

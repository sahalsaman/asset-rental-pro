'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, User, XIcon, Home, Building2, Calendar, Square, Printer } from 'lucide-react'; // icons

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const options = [
    { title: 'Dashboard', path: '/owner/dashboard' },
    { title: 'Properties', path: '/owner/properties' },
    { title: 'Bookings', path: '/owner/bookings' },
    { title: 'Invoices', path: '/owner/invoices' },
    { title: 'Managers', path: '/owner/managers' },
  ];

  const mobileMenu = [
    { title: 'Dashboard', path: '/owner/dashboard', icon: <Home size={20} /> },
    { title: 'Property', path: '/owner/properties', icon: <Building2 size={20} /> },
    { title: 'Booking', path: '/owner/bookings', icon: <Calendar size={20} /> },
    { title: 'Invoices', path: '/owner/invoices', icon: <Printer size={20} /> },
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

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <div className="bg-[url('/banner.png')] bg-cover bg-center md:bg-green-800 md:px-32 p-5 h-70 md:h-auto">
        <div className="flex justify-between items-center">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <h1
              onClick={() => router.push('/owner/dashboard')}
              className="text-2xl font-bold text-white mr-5 cursor-pointer"
            >
              ARP
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
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white"
            >
             {!open? <User size={20} />:<XIcon size={20} />}
            </button>

            {open && (
              <div className="absolute md:right-0 mt-2 min-w-80 w-full md:w-48  bg-white border rounded-md shadow-lg z-50">
                {/* Show nav options also in mobile */}
                <div className="flex flex-col md:hidden">
                  {options.map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setOpen(false);
                        router.push(card.path);
                      }}
                      className={`px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                        pathname === card.path ? "bg-gray-200" : ""
                      }`}
                    >
                      {card.title}
                    </button>
                  ))}
                  <hr className="my-1" />
                </div>

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
            className={`flex flex-col items-center text-xs ${
              pathname === item.path ? "text-green-600" : "text-gray-500"
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

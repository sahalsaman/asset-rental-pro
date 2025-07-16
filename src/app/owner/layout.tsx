'use client';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  
  const router = useRouter();
  const pathname = usePathname();
  const options = [
    { title: 'Dashboard', path: '/owner/dashboard' },
    { title: 'Properties', path: '/owner/properties' },
    { title: 'Invoices', path: '/owner/invoice' },
  ]
 
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-8 bg-green-800 md:px-32 p-5">
        <div className='flex items-center gap-4'>
        <h1 className="text-lg md:text-2xl font-bold text-white">AssetRentalPro</h1>
          {options.map((card, idx) => (
            <div
              key={idx}
              onClick={() => router.push(card.path)}

              className={`cursor-pointer hover:border-b-white text-white font-light 
              ${pathname === card.path ? "border-b-1 border-white text-green-300" : ""}`}>
              <span >{card.title}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('mkmsahiAuth');
            router.push('/auth/login');
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>


      <main className='pt-10 md:px-32 px-5 mb-10'>{children}</main>
    </div>
  );
}

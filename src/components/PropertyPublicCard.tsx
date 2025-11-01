import Image from "next/image";
import { Bed, Bath, Wifi, Snowflake } from "lucide-react";

export default function PropertyPublicCard({ property }:{property:any}) {
  const p = property;
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border" key={p.name}>
      <div className="relative">
        <Image
          src={p.image}
          alt={p.name}
          width={400}
          height={250}
          className="rounded-t-2xl object-cover w-full h-48"
        />
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          For Rental
        </span>
      </div>
      <div className="p-4">
        <p className="text-gray-900 font-bold text-lg">{p.name}</p>
        <p className="text-gray-500 text-sm">{p.location}</p>

        <div className="flex items-center gap-4 text-gray-600 text-sm mt-2">
          <div className="flex items-center gap-1">
            <Bed size={16} /> {p.type}
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} /> {p.bath}
          </div>
          {p.ac && (
            <div className="flex items-center gap-1">
              <Snowflake size={16} /> AC
            </div>
          )}
          {p.wifi && (
            <div className="flex items-center gap-1">
              <Wifi size={16} /> Wifi
            </div>
          )}
        </div>

        <p className="mt-3 font-semibold text-gray-800">
          ₹ {p.price} / Day <span className="text-gray-400 text-sm">+ GST</span>
        </p>
      </div>
    </div>
  );
}

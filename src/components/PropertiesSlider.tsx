"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Building2,
  Home,
  Hotel,
  Building,
  TreePine,
  Landmark,
  Briefcase,
  Sun,
} from "lucide-react";

const propertyTypes = [
  {
    name: "Hotel",
    icon: <Hotel className="w-10 h-10 text-green-600" />,
    desc: "Comfortable shared spaces with flexible rental options.",
    uri: ""
  },
  {
    name: "Flat / Apartment",
    icon: <Building2 className="w-10 h-10 text-green-600" />,
    desc: "Modern apartments with amenities and secure access.",
    uri: ""
  },
  {
    name: "Homestay",
    icon: <Home className="w-10 h-10 text-green-600" />,
    desc: "Independent Homestays for families or individuals.",
    uri: ""
  },
  {
    name: "Co-working / Office Space",
    icon: <Briefcase className="w-10 h-10 text-green-600" />,
    desc: "Flexible office spaces for teams and freelancers.",
    uri: ""
  },
  {
    name: "Resort",
    icon: <Sun className="w-10 h-10 text-green-500" />,
    desc: "Relaxing resort stays for holidays and short trips.",
    uri: ""
  },
  {
    name: "PG / Hostel",
    icon: <Hotel className="w-10 h-10 text-green-600" />,
    desc: "Comfortable shared spaces with flexible rental options.",
    uri: ""
  },
  {
    name: "Turf",
    icon: <TreePine className="w-10 h-10 text-emerald-600" />,
    desc: "Book and manage sports turfs with hourly rentals.",
    uri: ""
  },
  {
    name: "Auditorium",
    icon: <Landmark className="w-10 h-10 text-green-600" />,
    desc: "Spacious venues for events, meetings, and programs.",
    uri: ""
  },
];

export default function PropertyTypeSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 2500, stopOnMouseEnter: true }),
  ]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
          Explore Rental Property Types
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
          Choose from a wide range of property types available for rent and
          management.
        </p>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 px-6">
            {propertyTypes.map((item, idx) => (
              <div
                key={idx}
                className="w-[200px] flex-shrink-0 bg-slate-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300 "
              >
                <div className=" ">
                  <div className="p-3 bg-white rounded-xl shadow-sm w-fit mb-5">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 ">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

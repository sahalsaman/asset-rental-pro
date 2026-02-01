// app/documentation/thank-you/page.tsx
import { Building2, Mail, Globe, ArrowRight } from "lucide-react";
import { app_config } from "../../../app-config";

export default function ThankYouSlide() {
  return (
    <div className=" overflow-hidden">
      <div className="flex flex-col  min-h-[500px]">
        {/* Left - Brand Panel (Dark Teal) */}
        <div className="w-full  bg-[#1a5f7a] text-white flex flex-col justify-center p-8 lg:p-12 relative overflow-hidden">

          <div className="absolute -top-24 -left-24 w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] bg-white/5 rounded-full" />
          <div className="absolute -bottom-12 -right-12 w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] bg-white/5 rounded-full" />

          <div className="relative z-10">
            {/* <div className="flex items-center gap-4 mb-6 lg:mb-8">
              <Building2 className="w-12 h-12 lg:w-16 lg:h-16" />
              <h2 className="text-4xl lg:text-5xl font-extrabold font-montserrat">
                RENTITIES
              </h2>
            </div> */}

            <p className="text-lg lg:text-2xl font-light opacity-90 leading-relaxed text-center md:px-12 lg:px-24">
              Simplifying property management for owners worldwide. Seamlessly manage units,
              bookings, and finances in one place.
            </p>
          </div>
        </div>

        {/* Right - Info Panel (White) */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 ">
          {/* <h1 className="text-4xl lg:text-6xl font-extrabold font-montserrat text-[#1a5f7a] mb-6 lg:mb-10 leading-tight">
            Thank You!
          </h1> */}

          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl leading-relaxed mb-8 lg:mb-12">
            We appreciate your time exploring the RENTITIES owner application. We are committed
            to providing the best tools for your real estate success.
          </p>

          {/* Contact Card */}
          <div className="bg-gray-50 border-l-4 border-[#1a5f7a] p-6 lg:p-8 rounded-r-xl shadow-sm mb-8">
            <div className="space-y-6 lg:space-y-8">
              {/* Email */}
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-[#e0f2fe] rounded-xl flex items-center justify-center text-[#0284c7] text-xl lg:text-2xl flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wider font-semibold">
                    Email Support
                  </div>
                  <div className="text-base lg:text-xl font-semibold text-gray-800 break-all">
                    {app_config.SUPPORT_EMAIL}
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-[#e0f2fe] rounded-xl flex items-center justify-center text-[#0284c7] text-xl lg:text-2xl flex-shrink-0">
                  <Globe size={24} />
                </div>
                <div>
                  <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wider font-semibold">
                    Visit Website
                  </div>
                  <div className="text-base lg:text-xl font-semibold text-gray-800">
                    {app_config.PUBLIC_URL}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download CTA */}
          <div className="flex items-center gap-3 text-[#1a5f7a] font-semibold text-lg group cursor-pointer">
            <span>Download the App on iOS & Android</span>
            <ArrowRight className="transition-transform group-hover:translate-x-2" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
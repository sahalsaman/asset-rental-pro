// app/documentation/cover/page.tsx
import React from 'react';
import { Building2, Calendar, GitBranch } from 'lucide-react';

export default function CoverSlidePage() {
  return (
    <div className=" overflow-hidden relative">
      <div className="relative w-full overflow-hidden min-h-[600px] flex flex-col lg:flex-row">
        {/* Background Gradients */}
        {/* <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full bg-gradient-to-bl from-[#1a5f7a] to-[#2c7da0] opacity-10 lg:opacity-100 z-0 lg:clip-path-slide-1" /> */}

        {/* Main content */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center px-8 py-16 lg:px-16">
          {/* Left - Text content */}
          <div className="w-full lg:w-1/2 lg:pr-12 text-center lg:text-left">


            {/* Main title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-montserrat leading-tight text-[#2c3e50] mb-6">
              Property Owner
              <br />
              <span className="text-[#468faf]">App Guide</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl font-light text-[#576574] border-l-0 lg:border-l-4 border-[#468faf] lg:pl-6 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Comprehensive Property Management Application Documentation for Property Owners
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10 text-[#576574] text-base font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>January 31, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch size={18} />
                <span>Version 1.0</span>
              </div>
            </div>
          </div>

          {/* Right - Phone mockup */}
          <div className="w-full lg:w-1/2 flex justify-center mt-12 lg:mt-0">
            <div className="relative w-[80%] max-w-[320px] lg:max-w-[380px]">
              <div className="bg-white rounded-3xl p-2 shadow-2xl border border-gray-200">
                <div className="bg-[#f0f4f8] rounded-2xl overflow-hidden border border-[#e2e8f0] aspect-[9/19] flex flex-col">
                  {/* Header */}
                  <div className="h-14 bg-[#1a5f7a] flex items-center px-4 justify-between">
                    <div className="w-4 h-4 bg-white/30 rounded"></div>
                    <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                  </div>

                  {/* Content blocks */}
                  <div className="p-4 flex gap-3">
                    <div className="flex-1 h-16 bg-[#e0f2fe] rounded-xl"></div>
                    <div className="flex-1 h-16 bg-[#dcfce7] rounded-xl"></div>
                  </div>

                  <div className="px-4 pb-4 flex-1">
                    <div className="bg-white rounded-xl p-4 mb-3 shadow-sm h-20"></div>
                    <div className="bg-white rounded-lg h-8 mb-2 shadow-sm"></div>
                    <div className="bg-white rounded-lg h-8 mb-2 shadow-sm"></div>
                    <div className="bg-white rounded-lg h-8 shadow-sm"></div>
                  </div>

                  {/* Bottom navigation */}
                  <div className="h-14 bg-white border-t border-[#e2e8f0] flex items-center justify-around px-4">
                    <div className="w-5 h-5 bg-[#1a5f7a] rounded-md"></div>
                    <div className="w-5 h-5 bg-[#cbd5e1] rounded-md"></div>
                    <div className="w-5 h-5 bg-[#cbd5e1] rounded-md"></div>
                    <div className="w-5 h-5 bg-[#cbd5e1] rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
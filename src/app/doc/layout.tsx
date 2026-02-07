// app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "../globals.css";

// Define fonts with CSS variables
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // ← this creates --font-poppins variable
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat", // ← this creates --font-montserrat variable
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rentities | Owner App Guide",
  description: "Property Owner App Guide",
};

export default function DocLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className={`${poppins.variable} ${montserrat.variable} font-poppins antialiased bg-gray-50 text-gray-900`}>
      <div className="sticky top-0 z-50 bg-green-700 text-white shadow-md">
        <div className="max-w-screen-2xl mx-auto px-4 py-6 flex items-center justify-between">
          <h2 className="flex items-center gap-3 font-bold text-xl font-montserrat ml-6">
            Rentities Guide
          </h2>
          <p className="text-sm opacity-80 hidden md:block">
            Owner App Guide • Version 1.0
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
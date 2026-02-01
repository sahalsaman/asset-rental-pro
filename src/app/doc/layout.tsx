// app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { Building2 } from "lucide-react";

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
  title: "RENTITIES Owner App Documentation",
  description: "Property Owner App Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className="font-poppins antialiased bg-gray-50 text-gray-900">
        <div className="sticky top-0 z-50 bg-[#1a5f7a] text-white shadow-md">
          <div className="max-w-screen-2xl mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3 font-bold text-xl font-montserrat ml-6">

              RENTITIES Documentation
            </div>
            <div className="text-sm opacity-80 hidden md:block">
              Owner App Guide • Version 1.0
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
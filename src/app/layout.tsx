

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: 'Rental Property Management - Efficient Solutions for Landlords',
  description: 'Discover top-tier rental property management services to maximize your income and minimize hassle.',
  keywords: 'rental property management, property managers, real estate, pg management, apartment management, rent collection,flat management, tenant screening, maintenance services, landlord services',
  authors: [{ name: 'WEBCOS', url: 'https://webcos.co' }],
  creator: 'WEBCOS',
  publisher: 'WEBCOS',
  applicationName: 'Rental Property Management',
  openGraph: {
    title: 'Rental Property Management',
    description: 'Efficient Solutions for Landlords',
    images: '/og-image.jpg',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rental Property Management',
    description: 'Efficient Solutions for Landlords',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >{children}
            <Toaster /> 
      </body>
    </html>
  );
}


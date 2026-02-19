"use client";

import { motion } from "framer-motion";
import { Globe, Settings, Layout, Palette, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WebsiteManagementPage() {
    return (
        <div className="p-5 md:pt-10 md:px-16 min-h-screen mobile-footer mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Globe className="text-green-600" size={32} />
                        Website Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 max-w-xl">
                        Customize your business website, manage SEO, and preview how your properties look to potential tenants.
                    </p>
                </div>

                <Button variant="green" className="gap-2 h-11 px-6 shadow-md">
                    <ExternalLink size={18} /> Visit Live Site
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Site Configuration */}
                <Card className="border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                            <Settings size={24} />
                        </div>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Update your site name, logo, and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end">
                        <ArrowRight className="text-slate-300 group-hover:text-blue-500" />
                    </CardContent>
                </Card>

                {/* Theme & Styling */}
                <Card className="border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                            <Palette size={24} />
                        </div>
                        <CardTitle>Theme & Branding</CardTitle>
                        <CardDescription>Customize colors, fonts, and the overall look of your brand.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end">
                        <ArrowRight className="text-slate-300 group-hover:text-purple-500" />
                    </CardContent>
                </Card>

                {/* Page Builder */}
                <Card className="border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                            <Layout size={24} />
                        </div>
                        <CardTitle>Page Content</CardTitle>
                        <CardDescription>Edit home page sections, testimonials, and about us content.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end">
                        <ArrowRight className="text-slate-300 group-hover:text-green-500" />
                    </CardContent>
                </Card>
            </div>

            {/* Coming Soon Alert */}
            <div className="mt-12 p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-center flex flex-col items-center justify-center">
                <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                    <Globe className="text-slate-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Advanced Site Customization Coming Soon</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                    We are building a powerful drag-and-drop website builder to help you create stunning property showcases.
                </p>
                <Button variant="outline" className="mt-6 font-bold" disabled>
                    Join Beta Waitlist
                </Button>
            </div>
        </div>
    );
}

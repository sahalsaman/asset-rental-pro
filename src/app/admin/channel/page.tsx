"use client";

import React, { useEffect, useState } from "react";
import {
    Plus,
    Edit3,
    Trash2,
    Globe,
    Settings,
    Share2,
    Zap,
    Activity,
    Layers,
    ChevronRight,
    Search,
    LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import ChannelFormModal from "@/components/ChannelFormModal";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

const IconRenderer: React.FC<{ iconName: string; className?: string }> = ({ iconName, className }) => {
    if (iconName?.startsWith("http")) {
        return <img src={iconName} alt="channel-icon" className={className} />;
    }
    return <Globe className={className} />;
};

export default function AdminChannelPage() {
    const [channels, setChannels] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState<any>(null);

    const fetchChannels = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/admin/channel");
            if (res.ok) {
                const data = await res.json();
                setChannels(data);
            } else {
                toast.error("Failed to fetch channels");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading channels");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChannels();
    }, []);

    const handleCreate = () => {
        setEditingChannel(null);
        setIsModalOpen(true);
    };

    const handleEdit = (channel: any) => {
        setEditingChannel(channel);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to permanently decommission the ${name} integration?`)) return;

        try {
            const res = await apiFetch(`/api/admin/channel?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Channel integration purged.");
                fetchChannels();
            } else {
                toast.error("Deletion protocol failed.");
            }
        } catch (error) {
            toast.error("Critical error during channel purging.");
        }
    }

    const filtered = (channels || []).filter(c =>
        (c?.displayName || "").toLowerCase().includes(search.toLowerCase()) ||
        (c?.name || "").toLowerCase().includes(search.toLowerCase())
    );

    if (loading && channels.length === 0) return <FullscreenLoader />;

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4 italic uppercase">
                        <Share2 className="text-indigo-600" size={36} />
                        Channel Management
                    </h1>
                    <p className="text-slate-500 font-bold">Configure and monitor external channel integrations across the platform.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Filter nodes..."
                            className="pl-12 h-12 bg-white border-slate-200 rounded-[1.25rem] focus:ring-2 focus:ring-indigo-400/20 font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-[1.25rem] h-12 px-8 font-black shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Zap size={18} className="text-indigo-400" /> Spawn Node
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-8">
                {filtered.map((channel) => (
                    <div
                        key={channel._id}
                        className="group bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 relative overflow-hidden"
                    >
                        {/* Status Glow */}
                        <div className={`absolute -top-4 -right-4 w-12 h-12 blur-2xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity ${channel.isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />

                        <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-[1.75rem] flex items-center justify-center p-3.5 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                                <IconRenderer iconName={channel.icon} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100" />
                            </div>
                            <Badge className={`px-3 py-1 rounded-full text-[9px] font-black tracking-[0.15em] uppercase border-0 ${channel.isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                                {channel.isActive ? 'Linked' : 'Offline'}
                            </Badge>
                        </div>

                        <div className="space-y-1 mb-6">
                            <h3 className="text-2xl font-black text-slate-900 leading-tight italic">{channel.displayName}</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest leading-none">Node ID:</span>
                                <span className="text-[10px] text-slate-400 font-mono font-bold tracking-tight">{channel.name}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-50">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Traffic</p>
                                <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                    <Activity size={12} className="text-indigo-400" />
                                    Nominal
                                </p>
                            </div>
                            <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-50">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Layer</p>
                                <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                    <Layers size={12} className="text-indigo-400" />
                                    {channel.authType === 'oauth2' ? 'OAUTH' : channel.authType?.toUpperCase() || 'API'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-[1.25rem] h-12 border-slate-100 shadow-sm font-black text-slate-500 text-xs uppercase tracking-widest hover:bg-slate-50 group/btn transition-all"
                                onClick={() => handleEdit(channel)}
                            >
                                <Settings size={14} className="mr-2 group-hover/btn:rotate-90 transition-transform" />
                                Configure
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-12 w-12 p-0 rounded-[1.25rem] bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                                onClick={() => handleDelete(channel._id, channel.displayName)}
                            >
                                <Trash2 size={20} />
                            </Button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && !loading && (
                    <div className="col-span-full py-24 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-300">
                            <LayoutGrid size={64} className="opacity-20" />
                            <div>
                                <p className="font-black text-2xl text-slate-400 tracking-tight italic">No network nodes detected.</p>
                                <p className="text-sm font-bold text-slate-400">Initialize your first external channel node to begin global synchronization.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ChannelFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchChannels}
                initialData={editingChannel}
            />
        </div>
    );
}

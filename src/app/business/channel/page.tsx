"use client";

import { useEffect, useState } from "react";
import { Globe, Settings, LayoutGrid, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { CardGridSkeleton } from "@/components/Loader";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import ChannelConfigModal from "@/components/ChannelConfigModal";
import ChannelMappingModal from "@/components/ChannelMappingModal";

// Helper to render icon dynamically
const IconRenderer = ({ iconName, className }: { iconName: string; className?: string }) => {
    if (iconName?.startsWith("http")) {
        return <img src={iconName} alt="icon" className={className} />;
    }
    return <Globe className={className} />;
};

export default function OwnerChannelPage() {
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [configChannel, setConfigChannel] = useState<any>(null);
    const [mappingChannel, setMappingChannel] = useState<any>(null);

    const fetchChannels = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/channel");
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

    const handleToggle = async (channel: any) => {
        const action = channel.isConnected ? 'disconnect' : 'connect';
        setProcessingId(channel._id);

        try {
            const res = await apiFetch("/api/channel", {
                method: 'POST',
                body: JSON.stringify({
                    providerId: channel._id,
                    action
                })
            });

            if (res.ok) {
                toast.success(action === 'connect' ? "Channel connected" : "Channel disconnected");
                fetchChannels();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        } finally {
            setProcessingId(null);
        }
    };

    const handleSync = async (channel: any) => {
        setProcessingId(channel._id);
        try {
            const res = await apiFetch("/api/channel/sync", {
                method: 'POST',
                body: JSON.stringify({
                    providerId: channel._id,
                    action: 'pull-bookings'
                })
            });
            if (res.ok) {
                toast.success("Sync protocol initiated");
            } else {
                toast.error("Sync failed");
            }
        } catch (error) {
            toast.error("Sync error");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading && channels.length === 0) return <div className="p-6 md:p-10"><CardGridSkeleton count={4} /></div>;

    return (
        <div className="p-6 md:p-10 min-h-screen bg-gray-50 text-gray-800">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Channel Management</h1>
                <p className="text-gray-500 mt-1">Connect your property data with external channels</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {channels.map((channel) => (
                    <div key={channel._id}
                        className={`group bg-white rounded-2xl shadow-sm border p-6 flex flex-col transition-all duration-300 hover:shadow-md hover:border-green-200 ${channel.isConnected ? 'border-green-100 bg-green-50/5' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-xl transition-colors duration-300 ${channel.isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                                <IconRenderer iconName={channel.icon} className="w-10 h-10 object-contain" />
                            </div>
                            <Switch
                                checked={channel.isConnected}
                                onCheckedChange={() => handleToggle(channel)}
                                disabled={processingId === channel._id}
                                className="data-[state=checked]:bg-green-600"
                            />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-1">{channel.displayName}</h3>
                        <p className="text-sm text-gray-500 mb-4 capitalize">{channel.authType?.replace('_', ' ')} Connectivity</p>

                        <div className="flex items-center gap-2 mt-auto">
                            <div className={`w-2 h-2 rounded-full ${channel.isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                            <span className={`text-xs font-semibold tracking-wide uppercase ${channel.isConnected ? 'text-green-700' : 'text-gray-500'}`}>
                                {channel.isConnected ? 'Connected' : 'Not Connected'}
                            </span>
                        </div>

                        {channel.isConnected && (
                            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-50">
                                <Button variant="outline" size="sm" className="h-9 px-0 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100" onClick={() => setConfigChannel(channel)} title="Configure">
                                    <Settings size={16} />
                                </Button>
                                <Button variant="outline" size="sm" className="h-9 px-0 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100" onClick={() => setMappingChannel(channel)} title="Mapping">
                                    <LayoutGrid size={16} />
                                </Button>
                                <Button variant="outline" size="sm" className="h-9 px-0 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100" onClick={() => handleSync(channel)} disabled={processingId === channel._id} title="Force Sync">
                                    <Zap size={16} />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <ChannelConfigModal
                isOpen={!!configChannel}
                onClose={() => setConfigChannel(null)}
                channel={configChannel}
                onSuccess={fetchChannels}
            />

            <ChannelMappingModal
                isOpen={!!mappingChannel}
                onClose={() => setMappingChannel(null)}
                channel={mappingChannel}
            />
        </div>
    );
}

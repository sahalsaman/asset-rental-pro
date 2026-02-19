import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";
import {
    Zap,
    Settings,
    Globe,
    ShieldCheck,
    Key,
    Lock,
    CalendarDays,
    Activity
} from "lucide-react";

interface ChannelFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export default function ChannelFormModal({ isOpen, onClose, onSuccess, initialData }: ChannelFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        displayName: "",
        icon: "",
        authType: "api_key",
        syncType: "both",
        webhookUrl: "",
        isActive: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                displayName: initialData.displayName || "",
                icon: initialData.icon || "",
                authType: initialData.authType || "api_key",
                syncType: initialData.syncType || "both",
                webhookUrl: initialData.webhookUrl || "",
                isActive: initialData.isActive ?? true
            });
        } else {
            setFormData({
                name: "",
                displayName: "",
                icon: "",
                authType: "api_key",
                syncType: "both",
                webhookUrl: "",
                isActive: true
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, authType: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = "/api/admin/channel";
            const method = initialData ? "PUT" : "POST";
            const body = initialData ? { ...formData, id: initialData._id } : formData;

            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to save channel node.");
            }

            toast.success(initialData ? "Channel node updated successfully." : "New channel node spawned successfully.");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[1rem] shadow-2xl">
                <DialogHeader className="bg-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-white/10">
                                <Zap className="text-indigo-400" size={20} />
                            </div>
                            {initialData ? "Configure Node" : "Initialize Node"}
                        </DialogTitle>
                        <p className="text-slate-400 text-sm font-medium mt-1">
                            {initialData ? "Refine synchronization parameters for this entity." : "Deploy a new external synchronization endpoint."}
                        </p>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400">System Identifier *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. airbnb_node"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={!!initialData}
                                className="h-12 rounded-2xl border-slate-200 focus:ring-indigo-500/20 font-mono font-bold text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="displayName" className="text-xs font-black uppercase tracking-widest text-slate-400">Public Label *</Label>
                            <Input
                                id="displayName"
                                name="displayName"
                                placeholder="e.g. Airbnb Global"
                                value={formData.displayName}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-2xl border-slate-200 focus:ring-indigo-500/20 font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="icon" className="text-xs font-black uppercase tracking-widest text-slate-400">Visual Marker (ID or Secure URL)</Label>
                        <Input
                            id="icon"
                            name="icon"
                            placeholder="Globe, Building, Home, or https://..."
                            value={formData.icon}
                            onChange={handleChange}
                            className="h-12 rounded-2xl border-slate-200 focus:ring-indigo-500/20 font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="syncType" className="text-xs font-black uppercase tracking-widest text-slate-400">Sync Direction</Label>
                            <Select onValueChange={(v) => setFormData(p => ({ ...p, syncType: v }))} value={formData.syncType}>
                                <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                                    <SelectValue placeholder="Select Sync Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pull">Pull Only (Bookings)</SelectItem>
                                    <SelectItem value="push">Push Only (Availability)</SelectItem>
                                    <SelectItem value="both">Both (Full Sync)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="webhookUrl" className="text-xs font-black uppercase tracking-widest text-slate-400">Webhook Base URL</Label>
                            <Input
                                id="webhookUrl"
                                name="webhookUrl"
                                placeholder="https://api.provider.com/hooks"
                                value={formData.webhookUrl}
                                onChange={handleChange}
                                className="h-12 rounded-2xl border-slate-200"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <ShieldCheck size={12} /> Authentication Layer
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => handleSelectChange('api_key')}
                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${formData.authType === 'api_key' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                            >
                                <Key className={formData.authType === 'api_key' ? 'text-indigo-600' : 'text-slate-400'} size={20} />
                                <div>
                                    <p className="text-xs font-black text-slate-900">API Key</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Standard Key Access</p>
                                </div>
                            </div>
                            <div
                                onClick={() => handleSelectChange('oauth2')}
                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${formData.authType === 'oauth2' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                            >
                                <Lock className={formData.authType === 'oauth2' ? 'text-indigo-600' : 'text-slate-400'} size={20} />
                                <div>
                                    <p className="text-xs font-black text-slate-900">OAuth 2.0</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Delegated Auth</p>
                                </div>
                            </div>
                            <div
                                onClick={() => handleSelectChange('ical')}
                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${formData.authType === 'ical' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                            >
                                <CalendarDays className={formData.authType === 'ical' ? 'text-indigo-600' : 'text-slate-400'} size={20} />
                                <div>
                                    <p className="text-xs font-black text-slate-900">iCal Sync</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Calendar Feed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <Activity size={18} className="text-emerald-500" />
                            <span className="text-sm font-bold text-slate-700">Node Status (Active)</span>
                        </div>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-10 h-6 bg-slate-200 rounded-full appearance-none checked:bg-emerald-500 transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-4 shadow-inner"
                        />
                    </div>

                    <DialogFooter className="pt-4 border-t border-slate-50 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={loading}
                            className="h-12 px-6 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            Abort
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl shadow-slate-200 transition-all active:scale-95"
                        >
                            {loading ? "Processing..." : initialData ? "Synchronize Updates" : "Validate and Spawn"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

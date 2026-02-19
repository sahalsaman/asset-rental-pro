import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { Settings, Key, Link as LinkIcon } from "lucide-react";

interface ChannelConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    channel: any;
    onSuccess: () => void;
}

export default function ChannelConfigModal({ isOpen, onClose, channel, onSuccess }: ChannelConfigModalProps) {
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState<any>({});

    useEffect(() => {
        if (channel?.credentials) {
            setCredentials(channel.credentials);
        } else {
            setCredentials({});
        }
    }, [channel, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await apiFetch("/api/channel", {
                method: "POST",
                body: JSON.stringify({
                    providerId: channel._id,
                    action: "update-credentials",
                    credentials
                }),
            });

            if (!res.ok) throw new Error("Failed to update credentials");

            toast.success("Credentials updated successfully");
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
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings size={20} className="text-gray-500" />
                        Configure {channel?.displayName}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {channel?.authType === 'api_key' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="apiKey">API Key / Access Token</Label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <Input
                                        id="apiKey"
                                        name="apiKey"
                                        type="password"
                                        placeholder="Enter your API key"
                                        value={credentials.apiKey || ""}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="apiSecret">API Secret (Optional)</Label>
                                <Input
                                    id="apiSecret"
                                    name="apiSecret"
                                    type="password"
                                    placeholder="Enter your API secret if required"
                                    value={credentials.apiSecret || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {channel?.authType === 'ical' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="icalUrl">iCal Feed URL</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <Input
                                        id="icalUrl"
                                        name="icalUrl"
                                        placeholder="https://www.airbnb.com/calendar/ical/..."
                                        value={credentials.icalUrl || ""}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-slate-900">
                            {loading ? "Saving..." : "Save Configuration"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { LayoutGrid, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChannelMappingModalProps {
    isOpen: boolean;
    onClose: () => void;
    channel: any;
}

export default function ChannelMappingModal({ isOpen, onClose, channel }: ChannelMappingModalProps) {
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [mappings, setMappings] = useState<any[]>([]);

    const [selectedPropertyId, setSelectedPropertyId] = useState("");
    const [newMapping, setNewMapping] = useState({
        propertyId: "",
        unitId: "",
        externalPropertyId: "",
        externalUnitId: ""
    });

    useEffect(() => {
        if (isOpen && channel) {
            fetchProperties();
            fetchMappings();
        }
    }, [isOpen, channel]);

    const fetchProperties = async () => {
        try {
            const res = await apiFetch("/api/property?status=ACTIVE");
            if (res.ok) setProperties(await res.json());
        } catch (error) {
            toast.error("Failed to fetch properties");
        }
    };

    const fetchUnits = async (propertyId: string) => {
        try {
            const res = await apiFetch(`/api/unit?propertyId=${propertyId}`);
            if (res.ok) setUnits(await res.json());
        } catch (error) {
            toast.error("Failed to fetch units");
        }
    };

    const fetchMappings = async () => {
        try {
            const res = await apiFetch(`/api/channel/mapping?providerId=${channel._id}`);
            if (res.ok) setMappings(await res.json());
        } catch (error) {
            toast.error("Failed to fetch mappings");
        }
    };

    const handleAddMapping = async () => {
        if (!newMapping.unitId || !newMapping.externalUnitId) {
            toast.error("Please fill required fields");
            return;
        }

        setLoading(true);
        try {
            const res = await apiFetch("/api/channel/mapping", {
                method: "POST",
                body: JSON.stringify({
                    providerId: channel._id,
                    ...newMapping
                }),
            });

            if (res.ok) {
                toast.success("Mapping added");
                fetchMappings();
                setNewMapping({
                    propertyId: selectedPropertyId,
                    unitId: "",
                    externalPropertyId: "",
                    externalUnitId: ""
                });
            }
        } catch (error) {
            toast.error("Failed to add mapping");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMapping = async (id: string) => {
        try {
            const res = await apiFetch(`/api/channel/mapping?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Mapping removed");
                fetchMappings();
            }
        } catch (error) {
            toast.error("Failed to delete mapping");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LayoutGrid size={20} className="text-gray-500" />
                        Unit Mapping - {channel?.displayName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Add New Mapping */}
                    <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                        <h4 className="text-sm font-bold text-gray-700">Add New Mapping</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">Property</Label>
                                <Select onValueChange={(val) => {
                                    setSelectedPropertyId(val);
                                    setNewMapping(prev => ({ ...prev, propertyId: val, unitId: "" }));
                                    fetchUnits(val);
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Property" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {properties.map(p => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Unit/Room</Label>
                                <Select onValueChange={(val) => setNewMapping(prev => ({ ...prev, unitId: val }))} disabled={!selectedPropertyId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map(u => <SelectItem key={u._id} value={u._id}>{u.name} ({u.category})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">External Property ID</Label>
                                <Input
                                    placeholder="Hotel ID / Property ID"
                                    value={newMapping.externalPropertyId}
                                    onChange={(e) => setNewMapping(prev => ({ ...prev, externalPropertyId: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">External Unit/Room ID</Label>
                                <Input
                                    placeholder="Room Type ID / Unit ID"
                                    value={newMapping.externalUnitId}
                                    onChange={(e) => setNewMapping(prev => ({ ...prev, externalUnitId: e.target.value }))}
                                />
                            </div>
                        </div>
                        <Button onClick={handleAddMapping} disabled={loading} className="w-full bg-slate-900 gap-2">
                            <Plus size={16} /> Add Mapping
                        </Button>
                    </div>

                    {/* Existing Mappings List */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-700">Existing Mappings</h4>
                        <div className="border rounded-xl divide-y">
                            {mappings.length === 0 ? (
                                <p className="p-8 text-center text-gray-400 text-sm">No mappings found.</p>
                            ) : (
                                mappings.map((m) => (
                                    <div key={m._id} className="p-4 flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <LinkIcon size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {properties.find(p => p._id === m.propertyId)?.name || 'Unknown'} - {units.find(u => u._id === m.unitId)?.name || 'Unknown Unit'}
                                                </p>
                                                <p className="text-[10px] text-gray-500">
                                                    Ext: {m.externalPropertyId} / {m.externalUnitId}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteMapping(m._id)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

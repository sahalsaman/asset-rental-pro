"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader, DashboardSkeleton } from "@/components/Loader";
import {
    Star,
    MessageSquare,
    Globe,
    Search,
    CheckCircle2,
    Reply
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-hot-toast";

export default function ReviewManagementPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [replyText, setReplyText] = useState("");
    const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/business/reviews");
            if (res.ok) {
                const data = await res.json();
                setReviews(data || []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleReply = async (id: string) => {
        if (!replyText.trim()) return;

        try {
            const res = await apiFetch(`/api/business/reviews?id=${id}`, {
                method: "PUT",
                body: JSON.stringify({ response: replyText })
            });

            if (res.ok) {
                toast.success("Response posted");
                setReplyText("");
                setActiveReplyId(null);
                fetchReviews();
            }
        } catch (err) {
            toast.error("Failed to post response");
        }
    };

    const filteredReviews = reviews.filter(rev =>
        rev.feedback?.toLowerCase().includes(search.toLowerCase()) ||
        rev.userId?.firstName?.toLowerCase().includes(search.toLowerCase())
    );

    const averageRating = reviews.length > 0 ?
        reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;

    if (loading && reviews.length === 0) return <div className="p-5 md:pt-10 md:px-16"><DashboardSkeleton /></div>;

    return (
        <div className="p-5 md:pt-10 md:px-16 min-h-screen mobile-footer mb-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-auto">
                    <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Monitor and engage with guest feedback across the platform</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <div className="flex items-center gap-6 px-4 py-2 bg-white rounded-md shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Average Rating</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={12} fill={s <= Math.round(averageRating) ? "currentColor" : "none"} className={s <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-200"} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Total Reviews</span>
                            <span className="text-xl font-bold text-gray-900">{reviews.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Integration Card */}
            <Card className="mb-8 border-slate-200 bg-slate-50 overflow-hidden">
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-8 space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">Connect Google Business Profile</h2>
                            <p className="text-slate-600 text-sm">
                                Link your profile to sync reviews instantly and respond to them directly from Rentities.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="text-emerald-500" size={16} />
                                    Automatic review & rating synchronization
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="text-emerald-500" size={16} />
                                    Reply to Google reviews in one click
                                </li>
                            </ul>
                            <Button variant="green" className="mt-4">
                                <Globe size={18} className="mr-2" />
                                Integrate Google
                            </Button>
                        </div>
                        <div className="bg-white/50 p-8 flex items-center justify-center border-l border-slate-200">
                            <div className="p-6 bg-white shadow-md rounded-xl border border-slate-100 max-w-xs w-full">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">G</div>
                                    <span className="font-bold text-gray-900 text-sm">My Property Listing</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} fill="#facc15" className="text-yellow-400" size={14} />)}
                                    <span className="ml-2 text-xs font-bold text-gray-600">4.9 (128 reviews)</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full w-[90%] bg-green-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-900">Recent Feedback</h2>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input
                            placeholder="Search feedback..."
                            className="pl-9 h-10 text-sm bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredReviews.length === 0 ? (
                        <div className="bg-white rounded-lg p-20 text-center border-2 border-dashed border-gray-100">
                            <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400">No reviews found.</p>
                        </div>
                    ) : (
                        filteredReviews.map((rev) => (
                            <Card key={rev._id} className="hover:border-gray-300 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                                    {rev.userId?.firstName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">
                                                        {rev.userId?.firstName} {rev.userId?.lastName}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-gray-500 uppercase font-semibold">
                                                            {rev.propertyId?.name || "Unit"}
                                                        </span>
                                                        <span className="text-gray-200 text-[10px]">•</span>
                                                        <span className="text-[10px] text-gray-400">
                                                            {new Date(rev.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < rev.rating ? "#facc15" : "none"} className={i < rev.rating ? "text-yellow-400" : "text-gray-100"} />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm leading-relaxed italic">
                                            "{rev.feedback}"
                                        </p>

                                        <div className="mt-2 pt-4 border-t border-gray-50">
                                            {rev.response ? (
                                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Management Reply</span>
                                                        <Button variant="ghost" className="h-6 px-2 text-[10px] text-gray-400 hover:text-gray-900">Edit</Button>
                                                    </div>
                                                    <p className="text-xs text-gray-600 italic">
                                                        {rev.response}
                                                    </p>
                                                </div>
                                            ) : activeReplyId === rev._id ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        className="w-full min-h-[100px] p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-green-500 outline-none resize-none"
                                                        placeholder="Write your response..."
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            onClick={() => handleReply(rev._id)}
                                                            size="sm"
                                                            variant="green"
                                                            className="gap-2"
                                                        >
                                                            <Reply size={14} /> Post Response
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setActiveReplyId(null)}
                                                            className="text-gray-400"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setActiveReplyId(rev._id)}
                                                    className="gap-2 text-gray-600"
                                                >
                                                    <MessageSquare size={14} /> Respond to Guest
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

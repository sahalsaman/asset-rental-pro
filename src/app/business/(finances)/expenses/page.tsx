"use client";

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    Trash2,
    Edit,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { DashboardSkeleton, TableSkeleton, CardGridSkeleton } from "@/components/Loader";
import { InvoiceStatus } from "@/utils/contants";
import { IInvoice } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InvoiceFormModal from "@/components/InvoiceFormModal";
import InvoiceCard from "@/components/InvoiceCard";
import { toast } from "react-hot-toast";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

const categories = ['Maintenance', 'Utilities', 'Salaries', 'Rent', 'Marketing', 'Taxes', 'Other'];

export default function ExpensesPage() {
    const property = localStorageServiceSelectedOptions.getItem()?.property;
    const currency = property?.currency || "₹";
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        category: 'Other',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/business/expense");
            if (res.ok) {
                const data = await res.json();
                setExpenses(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [property?._id]);

    const handleSubmit = async () => {
        if (!formData.amount || !formData.category) {
            toast.error("Please fill in required fields");
            return;
        }

        try {
            const res = await apiFetch("/api/business/expense", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Expense added successfully");
                setIsModalOpen(false);
                setFormData({
                    category: 'Other',
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                });
                fetchExpenses();
            }
        } catch (err) {
            toast.error("Failed to add expense");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this expense?")) return;
        try {
            const res = await apiFetch(`/api/business/expense?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Expense deleted");
                fetchExpenses();
            }
        } catch (err) {
            toast.error("Failed to delete expense");
        }
    };

    const filteredExpenses = expenses.filter(exp => {
        const matchesSearch = exp.description?.toLowerCase().includes(search.toLowerCase()) ||
            exp.category?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "all" || exp.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    if (loading && expenses.length === 0) return <TableSkeleton rows={8} cols={5} />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-900">Operational Expenses</h2>
                    <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100 font-bold">
                        Total: {currency}{totalExpenses.toLocaleString()}
                    </Badge>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="green" size="sm" className="gap-2">
                            <Plus size={16} /> Add Expense
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Expense</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Category</label>
                                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Amount ({currency})</label>
                                <Input
                                    type="number"
                                    className="h-11"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Date</label>
                                <Input
                                    type="date"
                                    className="h-11"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Description</label>
                                <Input
                                    className="h-11"
                                    placeholder="Expense description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit} variant="green" className="w-full h-11">Save Expense Record</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between bg-gray-50/30">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <Input
                            placeholder="Search expenses..."
                            className="pl-9 h-10 text-xs bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-gray-400" />
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[160px] h-10 text-xs bg-white">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50">
                                <TableHead className="text-xs font-bold text-gray-900">Expense Detail</TableHead>
                                <TableHead className="text-xs font-bold text-gray-900">Category</TableHead>
                                <TableHead className="text-xs font-bold text-gray-900">Date</TableHead>
                                <TableHead className="text-xs font-bold text-gray-900 text-right">Amount</TableHead>
                                <TableHead className="text-right text-xs font-bold text-gray-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredExpenses.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="h-40 text-center text-gray-400 italic text-sm">No expenses found.</TableCell></TableRow>
                            ) : (
                                filteredExpenses.map((exp) => (
                                    <TableRow key={exp._id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">{exp.description || "N/A"}</span>
                                                {exp.propertyId && <span className="text-[10px] text-gray-400 uppercase font-bold">{exp.propertyId.name}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell><Badge variant="outline" className="text-[10px] font-bold uppercase rounded-md">{exp.category}</Badge></TableCell>
                                        <TableCell className="text-xs text-gray-500 font-medium">{new Date(exp.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right font-bold text-gray-900 text-sm">-{currency}{exp.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400"><Edit size={14} /></Button>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-red-500" onClick={() => handleDelete(exp._id)}><Trash2 size={14} /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}


"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, CheckCircle2, Clock, X, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface Service {
    id: string;
    name: string;
    basePrice: number;
    isActive: boolean;
    category?: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await apiClient("/services");
            if (res && res.success) {
                setServices(res.data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load services from database");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenModal = (service: Service | null = null) => {
        setCurrentService(service || { name: "", basePrice: 0, isActive: true, category: "General" });
        setIsModalOpen(true);
    };

    const handleSaveService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentService?.name || currentService.basePrice === undefined) return;

        setActionLoading(true);
        try {
            const isEdit = !!currentService.id;
            const endpoint = isEdit ? `/services/${currentService.id}` : "/services";
            const method = isEdit ? "PATCH" : "POST";

            const res = await apiClient(endpoint, {
                method,
                body: JSON.stringify(currentService),
            });

            if (res.success) {
                await fetchServices();
                setIsModalOpen(false);
            }
        } catch (err: unknown) {
            alert("Error saving service: " + (err as Error).message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this ritual?")) return;

        setActionLoading(true);
        try {
            const res = await apiClient(`/services/${id}`, { method: "DELETE" });
            if (res.success) {
                setServices(prev => prev.filter(s => s.id !== id));
            }
        } catch (err: unknown) {
            alert("Error deleting service: " + (err as Error).message);
        } finally {
            setActionLoading(false);
        }
    };

    const toggleStatus = async (service: Service) => {
        try {
            const res = await apiClient(`/services/${service.id}`, {
                method: "PATCH",
                body: JSON.stringify({ isActive: !service.isActive }),
            });
            if (res.success) {
                setServices(prev => prev.map(s => s.id === service.id ? { ...s, isActive: !service.isActive } : s));
            }
        } catch (err: unknown) {
            alert("Error updating status: " + (err as Error).message);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Sacred Services</h1>
                    <p className="text-zinc-500 mt-2">Manage the rituals and offerings available on the platform.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
                >
                    <Plus className="h-5 w-5" />
                    New Ritual
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:border-amber-500/20">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Rites</h3>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{services.length}</div>
                    </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:border-amber-500/20">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Avg. Price</h3>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">USD</span>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                            ${(services.reduce((acc, s) => acc + s.basePrice, 0) / (services.length || 1)).toFixed(0)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 flex justify-between items-center text-sm">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Service Inventory</h3>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Sync Active
                    </div>
                </div>
                
                {loading ? (
                    <div className="p-20 text-center text-zinc-500 animate-pulse font-medium">Synchronizing with sacred records...</div>
                ) : error ? (
                    <div className="p-20 text-center text-red-500 font-medium">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 uppercase text-[10px] tracking-[0.15em] font-black">
                                <tr>
                                    <th className="px-6 py-5">Ritual Name</th>
                                    <th className="px-6 py-5">Category</th>
                                    <th className="px-6 py-5">Base Price</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {services.map(service => (
                                    <tr key={service.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 border border-amber-500/10">
                                                    <Clock className="h-5 w-5" />
                                                </div>
                                                <span className="font-bold text-zinc-900 dark:text-zinc-100 underline decoration-zinc-200 dark:decoration-zinc-800 decoration-2 underline-offset-4 group-hover:decoration-amber-500 transition-all">{service.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-500 dark:text-zinc-400 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{service.category || "General"}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">${service.basePrice.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => toggleStatus(service)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all border ${
                                                    service.isActive 
                                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                                                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20"
                                                }`}
                                            >
                                                {service.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                                                {service.isActive ? "ACTIVE" : "HIDDEN"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button 
                                                    onClick={() => handleOpenModal(service)}
                                                    title="Edit Ritual" 
                                                    className="p-2 rounded-xl text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 transition-all border border-transparent hover:border-amber-500/20"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(service.id)}
                                                    title="Remove Ritual" 
                                                    className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {services.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <Clock className="h-8 w-8 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-zinc-500 font-medium">No ritual services found in the database.</p>
                                    <button 
                                        onClick={() => handleOpenModal()}
                                        className="mt-2 text-amber-500 font-bold hover:underline"
                                    >
                                        Add your first service
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Ritual Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
                        <div className="bg-amber-500/10 p-8 border-b border-amber-500/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {currentService?.id ? "Edit Ritual" : "New Ritual Offering"}
                                </h2>
                                <p className="text-sm text-zinc-500 font-medium">Configure sacred service details</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="h-6 w-6 text-zinc-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveService} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Service Name</label>
                                <input 
                                    autoFocus
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-amber-500 font-bold text-zinc-900 dark:text-zinc-100"
                                    placeholder="e.g., Kashi Pind Daan"
                                    value={currentService?.name}
                                    onChange={e => setCurrentService(prev => ({ ...prev!, name: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Base Price (USD)</label>
                                    <input 
                                        required
                                        type="number" 
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-amber-500 font-bold text-zinc-900 dark:text-zinc-100"
                                        placeholder="299"
                                        value={currentService?.basePrice}
                                        onChange={e => setCurrentService(prev => ({ ...prev!, basePrice: parseFloat(e.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Category</label>
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-amber-500 font-bold text-zinc-900 dark:text-zinc-100 appearance-none"
                                        value={currentService?.category}
                                        onChange={e => setCurrentService(prev => ({ ...prev!, category: e.target.value }))}
                                    >
                                        <option value="General">General</option>
                                        <option value="Ancestral">Ancestral</option>
                                        <option value="Immersion">Immersion</option>
                                        <option value="Annual">Annual</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                <input 
                                    type="checkbox" 
                                    id="service-status"
                                    className="h-5 w-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                                    checked={currentService?.isActive}
                                    onChange={e => setCurrentService(prev => ({ ...prev!, isActive: e.target.checked }))}
                                />
                                <label htmlFor="service-status" className="font-bold text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                                    Visible to Customers
                                </label>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-12 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-sans"
                                >
                                    Discard
                                </button>
                                <button 
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 font-black text-zinc-950 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (currentService?.id ? "Update Ritual" : "Create Ritual")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

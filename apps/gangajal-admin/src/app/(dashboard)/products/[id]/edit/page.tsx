"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ProductService } from "@/services/product.service";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const isNew = params.id === "new";

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        volumeMl: 500,
        price: 0,
        isActive: true,
    });

    useEffect(() => {
        if (!isNew) {
            fetchProduct();
        }
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            const res = await ProductService.getById(params.id as string);
            if (res.success) {
                setFormData({
                    name: res.data.name,
                    sku: res.data.sku,
                    volumeMl: res.data.volumeMl,
                    price: res.data.price,
                    isActive: res.data.isActive,
                });
            }
        } catch (err) {
            console.error("Failed to fetch product", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? Number(value) : value)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = isNew 
                ? await ProductService.create(formData)
                : await ProductService.update(params.id as string, formData);
            
            if (res.success) {
                router.push("/products");
            } else {
                alert("Failed to save product.");
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Error saving product.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-12 text-center text-zinc-500">Loading product details...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/products" className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-sm">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        {isNew ? "Add New Product" : "Edit Product"}
                    </h1>
                    <p className="text-zinc-500 mt-1">
                        {isNew ? "Create a new Gangajal variant." : `Modifying details for product ID: ${params.id}`}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 overflow-hidden space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Product Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">SKU Code</label>
                        <input 
                            type="text" 
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Volume (ml)</label>
                        <input 
                            type="number" 
                            name="volumeMl"
                            value={formData.volumeMl}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Price ($)</label>
                        <input 
                            type="number" 
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]"
                        />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <label className="flex items-center gap-3 cursor-pointer mt-4">
                            <input 
                                type="checkbox" 
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-zinc-300 text-[#FF9933] focus:ring-[#FF9933]"
                            />
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Product is active and available for purchase</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800 gap-3">
                    <Link href="/products" className="px-5 py-2.5 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        Cancel
                    </Link>
                    <button 
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#FF9933] text-white rounded-xl font-medium hover:bg-[#FF9933]/90 transition-all shadow-sm disabled:opacity-50">
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? "Saving..." : (isNew ? "Create Product" : "Save Changes")}
                    </button>
                </div>
            </form>
        </div>
    );
}

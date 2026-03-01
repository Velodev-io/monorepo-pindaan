"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</h1>
                <p className="text-zinc-500 mt-1">Configure global store preferences and notifications.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8 space-y-8">
                
                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Store Identity</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Store Name</label>
                            <input 
                                type="text" 
                                defaultValue="Gangajal.store"
                                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Support Email</label>
                            <input 
                                type="email" 
                                defaultValue="support@gangajal.store"
                                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20"
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800" />

                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Notifications</h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-zinc-300 text-[#FF9933] focus:ring-[#FF9933]" />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Email admin on new orders</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-zinc-300 text-[#FF9933] focus:ring-[#FF9933]" />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Send shipping confirmation to customers</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="w-5 h-5 rounded border-zinc-300 text-[#FF9933] focus:ring-[#FF9933]" />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Low stock alerts (under 50 liters)</span>
                        </label>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-[#FF9933] text-white rounded-xl font-bold hover:bg-[#FF9933]/90 transition-all shadow-md shadow-[#FF9933]/20">
                        <Save size={18} />
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
}

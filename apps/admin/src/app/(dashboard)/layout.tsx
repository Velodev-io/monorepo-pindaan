"use client";

import { AuthGuard } from "@/lib/auth-guard";
import { Users, LayoutDashboard, Bookmark, Settings, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";

const NAVIGATION = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Bookings", href: "/bookings", icon: Bookmark },
  { name: "Services", href: "/services", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/login";
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center px-6 gap-3 border-b border-zinc-200 dark:border-zinc-800 bg-amber-500/10">
            <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-bold text-zinc-950">P</div>
            <span className="font-bold text-xl tracking-tight hidden md:block dark:text-amber-500">Admin</span>
          </div>

          <nav className="flex-1 overflow-y-auto pt-4 px-4 space-y-2">
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-amber-500 text-zinc-950 shadow shadow-amber-500/20"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-zinc-950" : "text-zinc-500"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
             <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
             >
                <LogOut className="h-5 w-5" />
                Sign Out
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* Mobile App Bar */}
          <div className="md:hidden flex items-center justify-between h-16 shrink-0 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm z-30">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-bold text-zinc-950">P</div>
               <span className="font-bold text-lg dark:text-amber-500">Admin</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
             <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
               {children}
             </div>
          </div>
        </main>

      </div>
    </AuthGuard>
  );
}

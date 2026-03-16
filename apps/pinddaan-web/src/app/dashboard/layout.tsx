"use client"

import { usePathname } from "next/navigation"
import { ShieldCheck, Video, FileText, UserCircle, LayoutDashboard, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const links = [
    { name: "Back to Home", href: "/", icon: Home },
    { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Account Profile", href: "/dashboard/profile", icon: UserCircle },
    { name: "Ritual Bookings", href: "/dashboard/bookings", icon: FileText },
    { name: "Download Proofs", href: "/dashboard/proofs", icon: Video },
    { name: "Contact Support", href: "/dashboard/support", icon: ShieldCheck },
  ]

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row relative">
      {/* Sidebar - Fixed on desktop, hidden on mobile (accessible via Navbar menu) */}
      <aside className="hidden md:flex md:w-64 bg-orange-950 text-orange-100 flex-shrink-0 md:fixed md:top-0 md:left-0 md:h-screen z-[60] border-r border-orange-900/50 shadow-2xl overflow-y-auto flex-col">
        {/* Branding header in the sidebar area */}
        <div className="pt-10 pb-12 flex flex-col items-center border-b border-white/5 bg-gradient-to-b from-orange-900/20 to-transparent">
            <Link href="/" className="transition-transform hover:scale-105 active:scale-95 mb-6">
                <Image 
                    src="/images/pinddaan-logo-v3.png" 
                    alt="Pinddaan.store Logo" 
                    width={150} 
                    height={150} 
                    className="object-contain drop-shadow-2xl"
                    priority
                />
            </Link>
            <div className="text-center px-4">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white mb-1 uppercase">My Rites</h2>
                <div className="flex flex-col items-center gap-1.5">
                    <p className="text-[10px] uppercase tracking-widest text-orange-400 font-bold opacity-80 decoration-amber-500 underline underline-offset-4">Portal Secured</p>
                    <div className="h-1 w-8 bg-amber-500 rounded-full opacity-50" />
                </div>
            </div>
        </div>
        
        <nav className="mt-8 flex flex-col gap-2 px-4 pb-8">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all group ${
                  isActive 
                    ? "bg-amber-600/20 text-white shadow-inner border-l-4 border-amber-500" 
                    : "text-orange-200/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <link.icon className={`w-5 h-5 transition-colors ${isActive ? "text-amber-500" : "group-hover:text-amber-400"}`} />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Spacer for fixed sidebar on desktop */}
      <div className="hidden md:block w-64 flex-shrink-0" />

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-12 relative z-10 bg-cream min-h-screen">
        <div className="max-w-5xl mx-auto pt-6 md:pt-12">
          {children}
        </div>
      </main>
    </div>
  )
}

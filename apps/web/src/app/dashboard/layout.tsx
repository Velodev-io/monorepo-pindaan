"use client"

import { usePathname } from "next/navigation"
import { ShieldCheck, Video, FileText, UserCircle, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app we'd verify JWT via cookies here
  // const user = verifyAuth(cookies.get('token')?.value)

  const pathname = usePathname()

  const links = [
    { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Account Profile", href: "/dashboard/profile", icon: UserCircle },
    { name: "Ritual Bookings", href: "/dashboard/bookings", icon: FileText },
    { name: "Download Proofs", href: "/dashboard/proofs", icon: Video },
    { name: "Contact Support", href: "/dashboard/support", icon: ShieldCheck },
  ]

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-orange-950 text-orange-100 flex-shrink-0 pt-24 md:pt-28">
        <div className="p-6">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-white mb-2">My Rites</h2>
          <p className="text-xs text-orange-300">Portal secured</p>
        </div>
        
        <nav className="mt-6 flex flex-col gap-1 px-4 pb-8">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-white/10 text-white shadow-sm ring-1 ring-white/20" 
                    : "text-orange-200 hover:bg-white/5 hover:text-white"
                }`}
              >
                <link.icon className={`w-4 h-4 ${isActive ? "text-amber-400" : ""}`} />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-12 pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

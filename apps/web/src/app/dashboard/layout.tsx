import { redirect } from "next/navigation"
import { ShieldCheck, Video, FileText, UserCircle } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app we'd verify JWT via cookies here
  // const user = verifyAuth(cookies.get('token')?.value)

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-orange-950 text-orange-100 flex-shrink-0">
        <div className="p-6">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-white mb-2">My Rites</h2>
          <p className="text-xs text-orange-300">Portal secured</p>
        </div>
        
        <nav className="mt-6 flex flex-col gap-1 px-4">
          <a href="/dashboard" className="flex items-center gap-3 bg-white/10 text-white rounded-lg px-3 py-2 text-sm font-medium">
            <UserCircle className="w-4 h-4" /> My Profile
          </a>
          <a href="/dashboard/bookings" className="flex items-center gap-3 hover:bg-white/5 rounded-lg px-3 py-2 text-sm text-orange-200">
            <FileText className="w-4 h-4" /> Ritual Bookings
          </a>
          <a href="/dashboard/proofs" className="flex items-center gap-3 hover:bg-white/5 rounded-lg px-3 py-2 text-sm text-orange-200">
            <Video className="w-4 h-4" /> Download Proofs
          </a>
          <a href="/dashboard/support" className="flex items-center gap-3 hover:bg-white/5 rounded-lg px-3 py-2 text-sm text-orange-200">
            <ShieldCheck className="w-4 h-4" /> Contact Support
          </a>
        </nav>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

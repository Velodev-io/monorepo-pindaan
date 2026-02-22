"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Menu, UserCircle, LogOut, Home, LayoutDashboard, User, FileText, Video, ShieldCheck, X } from "lucide-react"
import Image from "next/image"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      unsubscribe()
    }
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setMobileMenuOpen(false)
      router.push("/")
    } catch (error) {
      console.error(error)
    }
  }
  
  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Locations", href: "/locations" },
    { name: "How it Works", href: "/how-it-works" },
  ]

  const dashboardLinks = [
    { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Account Profile", href: "/dashboard/profile", icon: User },
    { name: "Ritual Bookings", href: "/dashboard/bookings", icon: FileText },
    { name: "Download Proofs", href: "/dashboard/proofs", icon: Video },
    { name: "Contact Support", href: "/dashboard/support", icon: ShieldCheck },
  ]

  const isHomePage = pathname === '/'
  const isDashboard = pathname.startsWith('/dashboard')
  const isSolid = isScrolled || !isHomePage || isDashboard

  return (
    <>
      <header 
        className={`z-[70] transition-all duration-300 ${
          isDashboard ? "fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)]" : "fixed top-0 left-0 w-full"
        } ${
          isSolid 
            ? "bg-orange-50/95 backdrop-blur-md shadow-sm h-16 md:h-20"
            : "bg-transparent h-20 md:h-24"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6 h-full relative">
          <div className="flex items-center gap-2">
            {/* Mobile Nav Toggle - Left Corner */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden relative z-[80] ${isSolid ? "text-orange-950" : "text-white"}`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Main Logo - Shown on Homepage, and on mobile dashboard */}
            <Link href="/" className={`relative flex items-center h-full z-10 ${isDashboard ? "md:hidden" : ""}`}>
                <Image 
                  src="/images/pinddaan-logo-v3.png" 
                  alt="Pinddaan.store Logo" 
                  width={220}
                  height={220}
                  className={`object-contain transition-all duration-300 origin-left drop-shadow-lg ${
                    isSolid 
                      ? "h-10 md:h-16" 
                      : "h-14 md:h-28 mt-2 md:mt-4"
                  }`}
                  priority
                />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive 
                      ? (isSolid ? "text-amber-600" : "text-amber-400") 
                      : (isSolid ? "text-orange-950/80 hover:text-amber-600" : "text-white/90 hover:text-white")
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
          
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <Link href="/dashboard/profile">
                <div 
                  className={`p-1 md:p-1.5 rounded-full border-2 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    isSolid 
                      ? "border-amber-500 bg-amber-50 text-amber-600" 
                      : "border-white/50 bg-white/10 text-white"
                  }`}
                  title="View Profile"
                >
                  <UserCircle className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </Link>
            ) : (
              <Link href="/auth/login" className="hidden md:block">
                <Button variant="ghost" className={isSolid ? "text-orange-950 hover:bg-orange-100/50" : "text-white hover:bg-white/20 hover:text-white"}>
                  Sign In
                </Button>
              </Link>
            )}
            <Link href="/booking">
              <Button variant="default" size="sm" className="shadow-md text-xs md:text-sm h-10 md:h-12 px-4 md:px-6">Assemble Ritual</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer - Outside header to bypass stacking context */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div 
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-[110] w-72 bg-orange-950 shadow-[20px_0_50px_-10px_rgba(0,0,0,0.5)] animate-in slide-in-from-left duration-300 flex flex-col overflow-y-auto border-r border-white/5">
            {/* Drawer Header - Mirrors Dashboard Sidebar if on Dashboard */}
            <div className="p-8 border-b border-white/5 bg-gradient-to-b from-orange-900/40 to-transparent flex flex-col items-center relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(false)} 
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                title="Close Menu"
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mb-4">
                <Image 
                    src="/images/pinddaan-logo-v3.png" 
                    alt="Pinddaan.store Logo" 
                    width={100} 
                    height={100} 
                    className="object-contain drop-shadow-2xl"
                    priority
                />
              </Link>
              
              <div className="text-center">
                <h2 className="font-serif text-xl font-bold tracking-tight text-white mb-1 uppercase">Pinddaan</h2>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] uppercase tracking-widest text-orange-400 font-bold opacity-80 decoration-amber-500 underline underline-offset-4">Portal Secured</p>
                </div>
              </div>
            </div>
            
            <nav className="flex flex-col p-4 gap-1 flex-1">
              {/* General Section */}
              <div className="mb-6">
                <div className="px-4 py-2 flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-orange-400/50 font-black">Menu</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <Link 
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all ${
                    pathname === '/' ? "bg-amber-600/20 text-white" : "text-orange-100/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Home className="w-5 h-5 opacity-70" /> Home
                </Link>
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all ${
                        pathname === link.href ? "bg-amber-600/20 text-white" : "text-orange-100/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Sacred Portal Section for Logged-in Users */}
              {user && (
                <div className="mb-6">
                  <div className="px-4 py-2 flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-amber-500 font-black">Sacred Portal</span>
                    <div className="h-[1px] flex-1 bg-amber-500/10" />
                  </div>
                  {dashboardLinks.map((link) => (
                    <Link 
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all ${
                        pathname === link.href ? "bg-amber-600/30 text-white border-l-4 border-amber-500" : "text-orange-100/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <link.icon className={`w-5 h-5 ${pathname === link.href ? "text-amber-400" : "opacity-70"}`} />
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Account Actions */}
              <div className="mt-4 border-t border-white/5 pt-6 px-4">
                {user ? (
                   <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all border border-red-500/10"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full text-white border-white/20 h-12 font-bold rounded-xl">Sign In</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-white/5 bg-black/40 mt-auto">
                <div className="flex flex-col items-center gap-1 text-center">
                    <p className="text-[10px] text-orange-200/30 uppercase tracking-[0.3em] font-black">Pinddaan Store</p>
                    <p className="text-[9px] text-orange-100/10">© 2026 Secured</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

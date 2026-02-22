"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Menu } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Locations", href: "/locations" },
    { name: "How it Works", href: "/how-it-works" },
  ]

  // Solid mode is engaged when scrolled down or when not on the home page (which has the dark hero image)
  const isHomePage = pathname === '/'
  const isSolid = isScrolled || !isHomePage

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isSolid 
          ? "bg-orange-50/95 backdrop-blur-md shadow-sm h-20"
          : "bg-transparent h-24"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 h-full">
        {/* Logo overlapping the navbar bottom border */}
        <Link href="/" className="relative flex items-center h-full z-10 block w-40 md:w-52">
          <Image 
            src="/images/pinddaan-logo-v3.png" 
            alt="Pinddaan.store Logo" 
            width={220} 
            height={220} 
            className={`absolute object-contain origin-top-left transition-transform duration-300 drop-shadow-lg ${
              isSolid ? "top-0 md:-top-2 scale-[1] md:scale-[1.1]" : "top-2 md:top-4 scale-[1.1] md:scale-[1.3]"
            }`}
            priority
          />
        </Link>
        
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
        
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className={isSolid ? "text-orange-950 hover:bg-orange-100/50" : "text-white hover:bg-white/20 hover:text-white"}>
              Sign In
            </Button>
          </Link>
          <Link href="/booking">
            <Button variant="default" className="shadow-md">Assemble Ritual</Button>
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className={`h-6 w-6 ${isSolid ? "text-orange-950" : "text-white"}`} />
        </Button>
      </div>
    </header>
  )
}

import Link from "next/link"
import Image from "next/image"
import { SERVICES_DATA } from "@/config/data"

export default function Footer() {
  return (
    <footer className="bg-orange-950 py-12 text-orange-100">
      <div className="container mx-auto px-4 md:px-6 grid gap-8 md:grid-cols-4">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <Link href="/" className="inline-block relative">
            <Image 
              src="/images/pinddaan-logo-v3.png" 
              alt="Pinddaan.store Logo" 
              width={250} 
              height={250} 
              className="object-contain h-36 w-auto drop-shadow-xl hover:scale-105 transition-transform origin-left"
            />
          </Link>
          <p className="max-w-xs text-orange-200 text-sm leading-relaxed mt-6">
            Facilitating authentic, respectful, and transparent Hindu rituals at sacred Ganges Tirthas for families residing abroad.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/services">
            <h4 className="font-semibold text-white hover:text-amber-400 transition-colors inline-block">Services</h4>
          </Link>
          <ul className="space-y-2 text-sm text-orange-300">
            {SERVICES_DATA.map((service) => (
              <li key={service.id}>
                <Link href={service.href} className="hover:text-amber-400 transition-colors uppercase tracking-tight font-medium">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm text-orange-300">
            <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact Support</Link></li>
            <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 mt-12 pt-8 border-t border-orange-900/50 text-xs text-orange-400/80 flex justify-between items-center flex-wrap gap-4">
        <p>© {new Date().getFullYear()} Pinddaan Services. All rights reserved.</p>
        <p>Verified Secure Platform</p>
      </div>
    </footer>
  )
}

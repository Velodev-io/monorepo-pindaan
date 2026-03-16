"use client"

import Image from "next/image"
import Link from "next/link"
import { 
  ClipboardList, 
  Video, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  FileCheck, 
  ArrowRight,
  PhoneCall,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import BackButton from "@/components/shared/BackButton"

const STEPS = [
  {
    id: 1,
    title: "Select Ritual & Sacred Site",
    description: "Choose the specific ritual your family requires—Asthi Visarjan, Pind Daan, or Tarpana. Select from our verified sacred locations like Kashi, Prayagraj, Haridwar, or Gaya.",
    details: [
      "Browse through our deep Vedic ritual descriptions",
      "Check auspicious Tithi dates on our spiritual calendar",
      "Select a sacred location that resonates with your family tradition"
    ],
    image: "/images/step1.png",
    icon: Calendar
  },
  {
    id: 2,
    title: "Provide Ancestral Details",
    description: "Share the necessary details securely with our team. This information is vital for the Purohit to perform the Sankalp (initial vow) correctly.",
    details: [
      "Submit the names of the departed souls and their family tree",
      "Provide your Gotra and family background",
      "Specify any special requirements or family preferences"
    ],
    image: "/images/step2.png",
    icon: ClipboardList,
    accent: "orange"
  },
  {
    id: 3,
    title: "The Sacred Sankalp & Execution",
    description: "Our verified local Purohit performs the ritual on the banks of the holy river. We bridge the distance using modern technology while maintaining ancient purity.",
    details: [
      "Receive a live video link to witness the Sankalp (Vow)",
      "Watch the ritual performed with full Shastric vidhi",
      "Interactive session options to participate remotely from home"
    ],
    image: "/images/step3.png",
    icon: Video,
    accent: "amber"
  },
  {
    id: 4,
    title: "Digital Proof & Eternal Peace",
    description: "After the successful completion of the ritual, we provide you with comprehensive proof and documentation for your family records.",
    details: [
      "Receive high-definition 4K video recording of the entire ceremony",
      "Digital certificate with timestamp and location coordinates",
      "Optional physical Prasad delivery to your doorstep"
    ],
    image: "/images/step4.png",
    icon: FileCheck
  }
]

export default function HowItWorksPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="bg-orange-950 pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/triveni_sangam_hero_1771775992808.png" 
            alt="Background" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-start mb-12">
            <BackButton variant="ghost" className="text-white hover:text-amber-400 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg" />
          </div>
          <h1 className="font-serif text-4xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            The <span className="text-amber-400 italic">Sacred</span> Process
          </h1>
          <p className="text-orange-50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Bringing centuries-old traditions to your doorstep through a transparent, respectful, and digitally-enabled journey.
          </p>
          <div className="mt-12 animate-bounce">
            <ChevronDown className="mx-auto h-8 w-8 text-amber-500" />
          </div>
        </div>
      </section>

      {/* Main Timeline Section */}
      <section className="py-20 md:py-32 container mx-auto px-4 max-w-5xl">
        <div className="relative">
          {/* Vertical Line for Timeline */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-orange-100 -translate-x-1/2 hidden md:block" />
          
          <div className="flex flex-col gap-24 md:gap-40">
            {STEPS.map((step, index) => (
              <div 
                key={step.id} 
                className={`relative flex flex-col items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-10 md:gap-0`}
              >
                {/* Timeline Number Circle */}
                <div className="absolute left-4 md:left-1/2 top-0 h-10 w-10 rounded-full bg-amber-500 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold -translate-x-1/2 z-20 md:top-1/2 md:-translate-y-1/2">
                  {step.id}
                </div>

                {/* Content Side */}
                <div className={`w-full md:w-[42%] ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-orange-100 hover:shadow-xl transition-all duration-500 group">
                    <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-amber-100 group-hover:scale-110 transition-all">
                      <step.icon className="h-8 w-8 text-amber-600" />
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-orange-950 mb-4">{step.title}</h2>
                    <p className="text-orange-900/70 mb-8 leading-relaxed font-medium">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-3 text-sm text-orange-950/80">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Image/Visual Side */}
                <div className={`w-full md:w-[45%] flex items-center justify-center ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                  <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl group border-8 border-white">
                    <Image 
                      src={step.image} 
                      alt={step.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-orange-50/50 border-t border-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-10 md:p-20 shadow-2xl shadow-orange-950/5 border border-amber-100 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-amber-600" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-600">Verified Purohits</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-orange-950 leading-tight">
                Have more questions about the process?
              </h2>
              <p className="text-orange-900/60 text-lg">
                Our dedicated family coordinators are available 24/7 to guide you through every step of this spiritual journey.
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-orange-950 hover:bg-orange-900 group">
                <PhoneCall className="mr-3 h-5 w-5 group-hover:animate-bounce" /> Call Coordinator
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-orange-200 hover:bg-orange-50 text-orange-950 font-bold">
                WhatsApp Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 md:py-32 container mx-auto px-4 text-center">
        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-orange-900/30 mb-12">Built on Principles of Faith</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-1000">
          <div className="flex flex-col items-center gap-4">
            <ShieldCheck className="h-10 w-10 text-amber-600" />
            <span className="font-bold text-orange-950">Secure Details</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Waves className="h-10 w-10 text-amber-600" />
            <span className="font-bold text-orange-950">Ganga Jal Proof</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Video className="h-10 w-10 text-amber-600" />
            <span className="font-bold text-orange-950">4K Documentation</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <FileCheck className="h-10 w-10 text-amber-600" />
            <span className="font-bold text-orange-950">Vedic Authenticity</span>
          </div>
        </div>
        
        <div className="mt-24">
          <Link href="/booking">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 h-16 px-16 rounded-full text-xl shadow-2xl shadow-amber-600/20 group">
              Begin the Journey <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function Waves({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    </svg>
  )
}

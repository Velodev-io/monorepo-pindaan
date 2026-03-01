"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { HelpCircle, Mail, MessageSquare } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="space-y-8 pb-20">
      <div>
          <h1 className="text-3xl font-serif font-bold text-orange-950 mb-2">Sacred Support</h1>
          <p className="text-orange-900/60 font-medium tracking-tight">Got a question? Connect with our global priest concierge.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="hover:border-amber-500 transition-all p-8 flex flex-col gap-4 border border-orange-100 bg-white">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-amber-600">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl text-orange-950">Email Support</h3>
          <p className="text-orange-900/60 text-sm leading-relaxed font-medium">
            Send us your detailed query or booking concern via email. We typically respond within 12 hours.
          </p>
          <a href="mailto:support@pinddaan.store" className="mt-auto text-amber-600 font-bold uppercase tracking-widest text-xs hover:underline decoration-amber-500 underline-offset-4">support@pinddaan.store</a>
        </Card>

        <Card className="hover:border-amber-500 transition-all p-8 flex flex-col gap-4 border border-orange-100 bg-white">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-amber-600">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl text-orange-950">WhatsApp Concierge</h3>
          <p className="text-orange-900/60 text-sm leading-relaxed font-medium">
            Instant chat for quick questions about your booking. Use the live chat button on the bottom right.
          </p>
          <span className="mt-auto text-[10px] font-black uppercase text-orange-400 tracking-[0.2em] animate-pulse italic">Priority for NRI Gold Members</span>
        </Card>
      </div>

      <div className="bg-orange-950 p-12 rounded-[40px] text-white overflow-hidden relative shadow-2xl shadow-orange-950/20">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <HelpCircle size={240} />
        </div>
        <h3 className="font-serif text-2xl font-bold mb-4">Dedicated Help for NRIs</h3>
        <p className="text-orange-100/70 max-w-xl leading-relaxed">
            Performing Pinddaan and rituals from across the world shouldn&apos;t feel distant. We are here to bridge that distance and ensure your prayers reach their destination safely.
        </p>
      </div>
    </div>
  )
}

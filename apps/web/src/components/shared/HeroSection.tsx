"use client"

import { motion } from "framer-motion"
import { Button } from "../ui/Button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-24 md:pt-32 pb-16">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      />
      {/* Dark Gradient Overlay for text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent mix-blend-multiply" />
      <div className="absolute inset-0 z-0 bg-black/30" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center text-white"
      >
        <span className="mb-4 text-amber-400 font-medium tracking-widest uppercase text-sm md:text-base">
          Honoring Your Loved Ones
        </span>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl drop-shadow-lg text-white">
          Perform Sacred Hindu Rituals from Anywhere in the World
        </h1>
        <p className="mt-6 text-lg md:text-xl text-orange-50 max-w-2xl font-light drop-shadow-md">
          Respectful, authentic, and verified rituals performed by learned Pandits at Kashi, Haridwar, and Prayagraj.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/booking">
            <Button size="lg" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold">
              Arrange a Ritual
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10 hover:text-white">
              Learn How It Works
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

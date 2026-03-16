"use client"

import { motion } from "framer-motion"

interface SacredLoadingProps {
  message?: string
}

export default function SacredLoading({ message = "Connecting to Sacred Grounds..." }: SacredLoadingProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Breathing Background */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#451a03_0%,_#0c0a09_100%)]"
      />

      <div className="absolute inset-0 backdrop-blur-xl" />
      
      <div className="relative flex flex-col items-center">
        {/* Layered Sacred Geometry Animation */}
        <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-amber-500/20 shadow-[0_0_80px_rgba(217,119,6,0.1)]"
            />
            
            {/* Middle Decorative Ring */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-2 border-dashed border-amber-500/10"
            />

            {/* Inner Rotating Vessel */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-10 rounded-full border-t-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            />

            {/* Glowing Core */}
            <motion.div
                animate={{ 
                    scale: [0.8, 1.1, 0.8],
                    boxShadow: [
                        "0 0 20px rgba(245,158,11,0.2)",
                        "0 0 60px rgba(245,158,11,0.6)",
                        "0 0 20px rgba(245,158,11,0.2)"
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 rounded-full flex items-center justify-center"
            >
                <div className="w-12 h-12 rounded-full bg-orange-950/20 backdrop-blur-sm border border-white/20" />
            </motion.div>
        </div>

        {/* Uplifting Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, x: 0, opacity: 0 }}
            animate={{ 
              y: -150, 
              opacity: [0, 1, 0],
              x: (i - 2.5) * 30 + (Math.random() * 20 - 10)
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity, 
              delay: i * 0.4,
              ease: "easeOut" 
            }}
            className="absolute bottom-20 w-1 h-1 bg-amber-300 rounded-full blur-[1px]"
          />
        ))}

        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="mt-16 text-center z-10"
        >
          <h3 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 tracking-wider">
            {message}
          </h3>
          <motion.div 
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mt-4 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" 
          />
          <p className="mt-6 text-orange-100/40 text-[9px] uppercase tracking-[0.4em] font-black">
            Ancient Rites • Modern Security • Eternal Peace
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

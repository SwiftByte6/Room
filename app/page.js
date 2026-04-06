'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Box, Layout } from 'lucide-react'

/**
 * Landing Page - Premium Hero Section
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden px-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-float">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Next-Gen Interior Design</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1]">
            Design Your <br />
            <span className="text-gradient">Dream Space.</span>
          </h1>

          <p className="text-lg md:text-xl opacity-60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the future of room planning. Interactive 3D environments, 
            data-driven layouts, and a premium interface designed for the next generation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/spaces">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 px-10 py-5 bg-gradient rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-all cursor-pointer"
              >
                Start Designing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <button className="px-10 py-5 glass rounded-2xl font-bold text-lg hover:bg-white/5 transition-colors cursor-pointer">
              View Gallery
            </button>
          </div>
        </motion.div>

        {/* Feature Grid Segment */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-8 glass rounded-3xl text-left hover:border-primary/50 transition-colors">
            <Box className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Real-time 3D</h3>
            <p className="text-sm opacity-50">Fully interactive environments powered by React Three Fiber.</p>
          </div>
          <div className="p-8 glass rounded-3xl text-left hover:border-secondary/50 transition-colors">
            <Layout className="w-8 h-8 text-secondary mb-4" />
            <h3 className="text-xl font-bold mb-2">Modular Assets</h3>
            <p className="text-sm opacity-50">Choose from a library of curated, high-fidelity furniture pieces.</p>
          </div>
          <div className="p-8 glass rounded-3xl text-left hover:border-accent/50 transition-colors">
            <Sparkles className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">AI-Ready</h3>
            <p className="text-sm opacity-50">Built-in configuration engine for smart layout suggestions.</p>
          </div>
        </motion.div>
      </main>

      <footer className="absolute bottom-8 left-0 w-full text-center px-4">
        <p className="text-xs opacity-30 font-medium tracking-widest uppercase">Room Decor &copy; 2026 • Advanced Coding Lab</p>
      </footer>
    </div>
  )
}
'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AVAILABLE_SPACES } from '@/lib/data/rooms'
import { ArrowLeft, ChevronRight, Layout } from 'lucide-react'

/**
 * Space Selection Page - Neo-Brutalist Grid
 */
export default function SpaceSelectionPage() {
  return (
    <div className="min-h-screen bg-[#A5F3FC] bg-grid-magenta text-black p-8 md:p-16 flex flex-col selection:bg-black selection:text-white">

      <header className="mb-20 max-w-4xl">
        <Link href="/">
          <button className="flex items-center gap-2 font-game uppercase text-xs hover:translate-x-1 transition-transform mb-12 bg-black text-white px-4 py-2 neo-shadow-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </button>
        </Link>
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none">
          Select a Scene
        </h1>
        <p className="text-base md:text-lg leading-relaxed opacity-70 max-w-3xl font-medium">
          Each environment is a self-contained 3D world. Pick one to explore modular components, adjust lighting, and interact with spatial geometry in real time.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {AVAILABLE_SPACES.map((space, index) => (
          <motion.div
            key={space.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/spaces/${space.id}`} className="group block h-full">
              <div className="bg-white neo-border neo-shadow-hover flex flex-col h-full overflow-hidden">
                {/* Thumbnail Area */}
                <div className="relative h-72 overflow-hidden neo-border-b">
                  <img 
                    src={space.thumbnail} 
                    alt={space.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-black text-white px-4 py-2 font-game text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_#EC4899]">
                    Space {index + 1}
                  </div>
                  <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-1 bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#4ADE80] p-2 neo-border neo-shadow-sm">
                       <Layout className="w-5 h-5 text-black" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">{space.name}</h2>
                  </div>
                  <p className="text-sm leading-relaxed opacity-70 mb-8 flex-1 font-medium">
                    {space.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase opacity-30">Components</span>
                       <span className="text-sm font-black">{space.availableItems.length || 'Modular'} Layers</span>
                    </div>
                    <div className="bg-black text-white px-6 py-3 font-game uppercase text-xs neo-shadow-sm group-hover:bg-purple-600 transition-colors flex items-center gap-2">
                      Enter
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </main>

      <footer className="mt-32 py-12 border-t-4 border-black font-game uppercase text-[10px] tracking-[0.4em] flex items-center justify-center text-center">
        <span>Built with Three.js + Next.js · Computer Graphics Project 2026 · Interactive Visuals Lab</span>
      </footer>
    </div>
  )
}


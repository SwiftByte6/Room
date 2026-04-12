'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AVAILABLE_SPACES } from '@/lib/data/rooms'
import { ArrowLeft, ChevronRight, Layout, Sparkles } from 'lucide-react'

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
        <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-none">
          Choose Your <br />
          <span className="bg-yellow-400 neo-border neo-shadow px-6 py-2 inline-block rotate-[1deg] mt-4">Arena</span>
        </h1>
        <p className="font-game uppercase text-sm tracking-widest opacity-60 max-w-xl">
          Select an environment to start your interactive 3D layout experiment. 
          Each space features fully modular components.
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
                  <p className="font-game uppercase text-[10px] leading-relaxed opacity-60 mb-8 flex-1">
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

      <footer className="mt-32 py-12 border-t-4 border-black font-game uppercase text-[10px] tracking-[0.4em] flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-yellow-400" />
           </div>
           <span>Asset Selection Protocol v1.0.8</span>
        </div>
        <div className="flex gap-12 opacity-40">
           <span className="hover:opacity-100 cursor-pointer">Security</span>
           <span className="hover:opacity-100 cursor-pointer">Terms</span>
           <span className="hover:opacity-100 cursor-pointer">Archive</span>
        </div>
      </footer>
    </div>
  )
}


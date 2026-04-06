'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AVAILABLE_SPACES } from '@/lib/data/rooms'
import { ArrowLeft, ChevronRight, Layout } from 'lucide-react'

/**
 * Space Selection Page - A grid of available 3D rooms to load.
 */
export default function SpaceSelectionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 flex flex-col">
      <header className="mb-16">
        <Link href="/">
          <button className="flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </Link>
        <h1 className="text-4xl md:text-6xl font-black mb-4">Choose Your Space.</h1>
        <p className="opacity-60 max-w-xl text-lg">
          Select a template to start your interior design journey. 
          Each space is fully customizable and interactive.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {AVAILABLE_SPACES.map((space, index) => (
          <motion.div
            key={space.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link href={`/spaces/${space.id}`} className="group block h-full">
              <div className="glass rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all shadow-xl shadow-black/20 group-hover:scale-[1.02] active:scale-[0.98]">
                {/* Thumbnail Area */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img 
                    src={space.thumbnail} 
                    alt={space.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full glass-dark text-[10px] font-black uppercase tracking-widest text-accent">
                    Template {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Layout className="w-4 h-4 text-primary" />
                    <h2 className="text-2xl font-bold tracking-tight">{space.name}</h2>
                  </div>
                  <p className="text-sm opacity-50 leading-relaxed mb-8 flex-1">
                    {space.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                       <span className="text-xs opacity-30 font-medium">Assets:</span>
                       <span className="text-xs font-bold text-accent">{space.availableItems.length} curated</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 pl-4 pr-3 py-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                      Select
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </main>

      <footer className="mt-24 pt-8 border-t border-white/5 opacity-20 text-xs flex justify-between items-center">
        <span>Room Decor &bull; Selection Mode</span>
        <div className="flex gap-6">
          <span>v1.0.4</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </footer>
    </div>
  )
}

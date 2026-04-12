'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Box, Layout, Gamepad2, Search } from 'lucide-react'
import Image from 'next/image'

/**
 * Landing Page - Playful Neo-Brutalism Aesthetic
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-neo-yellow bg-grid-magenta overflow-hidden px-4 py-8 text-black selection:bg-black selection:text-white">
      
      {/* Navigation Bar */}
      <nav className="relative z-50 w-full max-w-6xl flex items-center justify-between mb-20">
         <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-2xl neo-border neo-shadow-sm">
            <Gamepad2 className="w-8 h-8 text-white" />
         </div>
         
         <div className="hidden md:flex items-center gap-8 font-game uppercase text-sm tracking-widest">
            <span className="cursor-pointer hover:underline decoration-4 underline-offset-8 decoration-purple-500">All spaces</span>
            <span className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity">Isometric</span>
            <span className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity">Creative</span>
            <span className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity">Minimal</span>
         </div>

         <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-white neo-border px-4 py-2 items-center gap-3 neo-shadow-sm">
               <input type="text" placeholder="Search" className="bg-transparent outline-none w-24 font-bold text-xs" />
               <Search className="w-4 h-4" />
            </div>
         </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl w-full flex flex-col items-center">
        
        {/* Floating Illustrative Assets */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -top-12 -left-12 drop-shadow-[10px_10px_0px_#000] hidden lg:block"
        >
          <Image 
            src="/images/stickers/controller.png" 
            width={180} height={180} alt="Playful Controller" 
          />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-0 -right-8 drop-shadow-[10px_10px_0px_#000] hidden lg:block"
        >
          <Image 
            src="/images/stickers/soccer.png" 
            width={120} height={120} alt="Soccer Ball" 
          />
        </motion.div>


        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-center mb-24"
        >
          <h1 className="text-7xl md:text-[9rem] font-black leading-none uppercase tracking-tighter mb-4 flex flex-col items-center">
            <span className="text-purple-600 drop-shadow-[10px_10px_0px_#000] text-stroke">Let The</span>
            <div className="bg-[#4ADE80] neo-border neo-shadow px-10 py-4 rotate-[-2deg] my-4 leading-none">
               <span className="text-white">Game</span>
            </div>
            <span className="text-purple-600 drop-shadow-[10px_10px_0px_#000] text-stroke">Begin</span>
          </h1>
          
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-sm">
             <div className="bg-purple-600 text-white px-8 py-4 neo-border neo-shadow font-game uppercase text-xs tracking-widest leading-relaxed">
                Design the ultimate environment. 3D visualization meets playful creativity.
             </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <div className="mt-32 w-full bg-[#7C3AED] neo-border neo-shadow p-10 rounded-[2rem] flex flex-col items-center relative gap-8">
           <div className="absolute -top-6 left-10 bg-yellow-400 neo-border neo-shadow-sm px-6 py-2 font-game uppercase text-xs">
              Most Popular Spaces
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {[
                { name: 'Minimalist Studio', type: 'Studio', color: 'bg-blue-400', id: 'minimalist-studio' },
                { name: 'Dorm Room', type: 'Dorm', color: 'bg-orange-400', id: 'dorm-room' },
                { name: 'Future Lab', type: 'Modern', color: 'bg-green-400', id: 'lab' },
              ].map((item, i) => (
                <Link key={i} href={item.id === 'lab' ? '/spaces' : `/spaces/${item.id}`}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white neo-border neo-shadow-sm p-4 cursor-pointer group"
                  >
                    <div className={`${item.color} h-48 mb-4 neo-border relative overflow-hidden flex items-center justify-center p-8`}>
                       <Box className="w-16 h-16 text-white group-hover:scale-125 transition-transform" />
                       <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase text-white">Next-Gen v1</div>
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                          <h3 className="font-game text-sm uppercase">{item.name}</h3>
                          <span className="text-[10px] opacity-40 uppercase font-black">{item.type} Space</span>
                       </div>
                       <div className="bg-black text-white p-2">
                          <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
           </div>

           <Link href="/spaces">
             <button className="bg-[#4ADE80] px-10 py-5 neo-border neo-shadow font-game uppercase tracking-[0.2em] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
                Enter All Environments
             </button>
           </Link>
        </div>

        {/* Bottom Decorative Section */}
        <div className="mt-20 flex gap-20 items-center opacity-40">
           <span className="font-game text-lg uppercase tracking-widest text-[#EC4899]">Retro Logic</span>
           <span className="font-game text-lg uppercase tracking-widest text-[#3B82F6]">3D Rendering</span>
           <span className="font-game text-lg uppercase tracking-widest text-[#8B5CF6]">Gen-Z Lab</span>
        </div>
      </main>

      <footer className="mt-20 py-10 opacity-20 font-game uppercase text-[10px] tracking-[0.4em]">
        Interior Designer &copy; 2026 • Interactive Visuals Lab
      </footer>
    </div>
  )
}
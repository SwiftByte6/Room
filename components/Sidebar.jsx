'use client'
import React, { useMemo } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { useEditorStore } from '@/lib/store'
import { 
  Plus, 
  Trash2, 
  Maximize, 
  Palette, 
  Box, 
  ChevronRight, 
  MousePointer2, 
  Sun as SunIcon, 
  Moon as MoonIcon, 
  Cloud as CloudIcon 
} from 'lucide-react'


import { AVAILABLE_ITEMS } from './3d/Furniture'

/**
 * Sidebar - The UI for managing items in the 3D Planner.
 * Modern Gen-Z design with glassmorphism and smooth transitions.
 */
export default function Sidebar({ 
  space,
  cameraView, 
  setCameraView 
}) {
  const { 
    getRoomData,
    addItem, 
    removeItem, 
    updateItem, 
    selectedId, 
    setSelectedId, 
    updateRoomConfig 
  } = useEditorStore();
  
  const { items, roomConfig } = getRoomData(space.id);
  const isDormSpace = Boolean(space.autoPopulateDormItems);
  
  const filteredAvailableItems = isDormSpace
    ? items.map((item) => ({
        type: item.type,
        label: item.label || item.type,
        icon: item.icon || '📦',
        itemId: item.id,
      }))
    : AVAILABLE_ITEMS.filter(item => space.availableItems.includes(item.type));

  const selectedItem = useMemo(() => items.find(i => i.id === selectedId), [items, selectedId]);

  return (
    <aside className="w-[380px] h-full glass-dark border-r border-white/5 p-6 flex flex-col gap-8 overflow-y-auto z-50">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
          <Box className="w-3 h-3" />
          Interior Lab v1.0
        </div>
        <h1 className="text-2xl font-black tracking-tight">{space.name}</h1>
        <p className="text-xs opacity-40 font-medium">Design & Arrangement Mode</p>
      </header>

      {/* Item Customization - Appears when an item is selected */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6 p-6 bg-primary/5 border border-primary/20 rounded-3xl"
          >
             <div className="flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">Selected Item</span>
                   <h3 className="text-sm font-bold truncate max-w-[150px]">{selectedItem.label}</h3>
                </div>
                <button 
                  onClick={() => setSelectedId(null)}
                  className="text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-opacity"
                >
                  Deselect
                </button>
             </div>

             <div className="flex flex-col gap-3">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Material Tint</span>
                <div className="flex items-center gap-4">
                   <input 
                     type="color" 
                     value={selectedItem.color || '#ffffff'} 
                     onChange={(e) => updateItem(space.id, selectedId, { color: e.target.value })}
                     className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer overflow-hidden"
                   />
                   <span className="text-[10px] font-mono opacity-60">{selectedItem.color || '#FFFFFF'}</span>
                </div>
             </div>

             <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Dimension Scale</span>
                   <span className="text-[10px] font-mono opacity-60">x{(selectedItem.scale || AVAILABLE_ITEMS.find(a => a.type === selectedItem.type)?.defaultScale || 1.0).toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="4.0" 
                  step="0.01"
                  value={selectedItem.scale || AVAILABLE_ITEMS.find(a => a.type === selectedItem.type)?.defaultScale || 1.0}
                  onChange={(e) => updateItem(space.id, selectedId, { scale: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
             </div>

             <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Vertical Elevation</span>
                   <span className="text-[10px] font-mono opacity-60">{(selectedItem.position[1] || 0).toFixed(2)}m</span>
                </div>
                <input 
                  type="range" 
                  min="0.0" 
                  max="3.5" 
                  step="0.01"
                  value={selectedItem.position[1] || 0}
                  onChange={(e) => {
                    const newPos = [...selectedItem.position];
                    newPos[1] = parseFloat(e.target.value);
                    updateItem(space.id, selectedId, { position: newPos });
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                />
             </div>

             <div className="flex gap-2">
                <button 
                  onClick={() => removeItem(space.id, selectedId)}
                  className="flex-1 py-2 text-[9px] font-black uppercase bg-red-500/20 text-red-100 rounded-xl hover:bg-red-500 transition-all font-bold"
                >
                   Remove Item
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Viewport Presets */}
      <section className="flex flex-col gap-4">
        <h2 className="text-[10px] uppercase tracking-widest font-black opacity-30">Viewports</h2>
        <div className="grid grid-cols-3 gap-2">
          {['isometric', 'front', 'top'].map((view) => (
            <button
              key={view}
              onClick={() => setCameraView(view)}
              className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                cameraView === view 
                  ? 'bg-primary text-secondary' 
                  : 'bg-white/5 opacity-40 hover:opacity-100'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </section>

      {/* Item Library / Assets */}
      <section className="flex flex-col gap-4 flex-1">
        <h2 className="text-[10px] uppercase tracking-widest font-black opacity-30">Asset Library</h2>
        <div className="grid grid-cols-2 gap-3 pb-8">
           {filteredAvailableItems.map((item) => (
             <button
               key={item.itemId || item.type}
               onClick={() => {
                 if (isDormSpace) {
                   setSelectedId(item.itemId);
                 } else {
                   addItem(space.id, item.type);
                 }
               }}
               className="group relative flex flex-col items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-3xl hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
             >
                <div className="text-2xl group-hover:scale-125 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wide opacity-40 group-hover:opacity-100 truncate w-full text-center">
                  {item.label}
                </span>
                {/* Accent Decor */}
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="w-3 h-3 text-primary" />
                </div>
             </button>
           ))}
        </div>
      </section>

      {/* Lighting Settings - Advanced */}
      {!isDormSpace && (
        <section className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-6">
           <div className="flex flex-col gap-4">
             <h2 className="text-[10px] uppercase tracking-widest font-black opacity-30">Lighting Environment</h2>
             <div className="flex gap-2">
                {[
                  { name: 'day', icon: SunIcon, preset: 'apartment' },
                  { name: 'neutral', icon: CloudIcon, preset: 'city' },
                  { name: 'night', icon: MoonIcon, preset: 'night' }
                ].map((l) => (
                  <button
                    key={l.name}
                    onClick={() => updateRoomConfig(space.id, { 
                      lightingSettings: { ...roomConfig.lightingSettings, preset: l.preset } 
                    })}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all cursor-pointer ${
                      roomConfig?.lightingSettings?.preset === l.preset 
                        ? 'bg-primary/20 border border-primary/30 text-primary' 
                        : 'bg-white/5 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <l.icon className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase">{l.name}</span>
                  </button>
                ))}
             </div>
           </div>

           <div className="flex flex-col gap-4 px-1">
             <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase opacity-40">Ambient Light</span>
                <span className="text-[9px] font-mono text-primary">{(roomConfig?.lightingSettings?.ambient || 1.0).toFixed(1)}x</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="2" 
               step="0.1"
               value={roomConfig?.lightingSettings?.ambient || 1.0}
               onChange={(e) => updateRoomConfig(space.id, { 
                 lightingSettings: { ...roomConfig?.lightingSettings, ambient: parseFloat(e.target.value) } 
               })}

               className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
             />
           </div>
        </section>
      )}
    </aside>
  )
}

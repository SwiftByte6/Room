'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Maximize, Palette, Box, ChevronRight, MousePointer2 } from 'lucide-react'
import { AVAILABLE_ITEMS } from './3d/Furniture'

/**
 * Sidebar - The UI for managing items in the 3D Planner.
 * Modern Gen-Z design with glassmorphism and smooth transitions.
 */
export default function Sidebar({ 
  space,
  items, 
  addItem, 
  removeItem, 
  updateItem, 
  selectedId, 
  onSelect, 
  roomConfig, 
  setRoomConfig, 
  cameraView, 
  setCameraView 
}) {
  const isDormSpace = Boolean(space.autoPopulateDormItems);
  
  const filteredAvailableItems = isDormSpace
    ? items.map((item) => ({
        type: item.type,
        label: item.label || item.type,
        icon: item.icon || '📦',
        itemId: item.id,
      }))
    : AVAILABLE_ITEMS.filter(item => space.availableItems.includes(item.type));

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
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'glass hover:bg-white/5 opacity-60'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </section>

      {/* Item Palette */}
      <section className="flex flex-col gap-4">
        <h2 className="text-[10px] uppercase tracking-widest font-black opacity-30">
          {isDormSpace ? 'Dorm Components' : 'Asset Library'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {filteredAvailableItems.map((item) => (
            <motion.button
              key={item.itemId || item.type}
              whileHover={{ y: -2, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (isDormSpace) {
                  onSelect(item.itemId);
                  return;
                }
                addItem(item.type);
              }}
              className="flex flex-col items-center justify-center p-4 glass rounded-2xl gap-2 transition-colors cursor-pointer group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100">{item.label}</span>
              {!isDormSpace && (
                <Plus className="w-3 h-3 text-accent absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Instance Manager / Layers */}
      <section className="flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] uppercase tracking-widest font-black opacity-30">Scene Layers</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 opacity-40">{items.length}</span>
        </div>
        
        <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <div className="py-8 glass rounded-2xl border-dashed border-white/10 flex flex-col items-center justify-center gap-3 opacity-20">
                <MousePointer2 className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Workspace Empty</span>
              </div>
            ) : (
              items.map((item) => {
                const isSelected = selectedId === item.id;
                const meta = AVAILABLE_ITEMS.find(a => a.type === item.type);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col group"
                  >
                    <div 
                      onClick={() => onSelect(item.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-primary/10 border-primary shadow-xl shadow-primary/5' 
                          : 'glass border-transparent hover:border-white/10'
                      }`}
                    >
                      <span className="text-lg">{meta?.icon || item.icon || '📦'}</span>
                      <div className="flex flex-col flex-1 truncate">
                        <span className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? 'text-primary' : 'opacity-80'}`}>
                          {meta?.label || item.label || item.type}
                        </span>
                        <span className="text-[9px] font-bold opacity-30 uppercase tracking-tighter truncate">
                          {item.isLocked ? 'Fixed Structure' : item.id}
                        </span>
                      </div>
                      {!item.isLocked && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                          className="p-2 opacity-0 group-hover:opacity-40 hover:opacity-100 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <ChevronRight className={`w-3 h-3 transition-transform ${isSelected ? 'rotate-90 text-primary' : 'opacity-20'}`} />
                    </div>

                    {/* Quick Config Overlay for Selected Item */}
                    {isSelected && !item.isLocked && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="overflow-hidden glass rounded-b-2xl border-x border-b border-primary/20 bg-primary/5 p-4 flex flex-col gap-4"
                      >
                         <div className="flex flex-col gap-2">
                           <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
                             <span>Elevation (Y)</span>
                             <span className="text-primary">{item.position[1].toFixed(2)}m</span>
                           </div>
                           <input 
                             type="range" min="0" max="2" step="0.01"
                             value={item.position[1]}
                             onChange={(e) => updateItem(item.id, { position: [item.position[0], parseFloat(e.target.value), item.position[2]] })}
                             className="w-full accent-primary h-1.5 rounded-full appearance-none bg-white/5 cursor-pointer"
                           />
                         </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Global Config Section */}
      <section className="pt-6 border-t border-white/5 flex flex-col gap-6">
        <h2 className="text-[10px] uppercase tracking-widest font-black opacity-30">Global Config</h2>
        
        <div className="flex flex-col gap-2">
           <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
             <span>Map Scale</span>
             <span className="text-secondary">{(roomConfig.scale * 100).toFixed(0)}%</span>
           </div>
           <input 
             type="range" min="0.5" max="1.5" step="0.01"
             value={roomConfig.scale}
             onChange={(e) => setRoomConfig({ ...roomConfig, scale: parseFloat(e.target.value) })}
             className="w-full accent-secondary h-1.5 rounded-full appearance-none bg-white/5 cursor-pointer"
           />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1">
             <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Walls</span>
             <div className="flex gap-1.5">
                {['#ffffff', '#121212', '#4c1d95', '#1e40af'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setRoomConfig({...roomConfig, wallColor: c})}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${roomConfig.wallColor === c ? 'border-primary scale-125' : 'border-transparent shadow-lg'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
             </div>
          </div>
          <div className="flex flex-col gap-2 flex-1">
             <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Floor</span>
             <div className="flex gap-1.5">
                {['#e5e7eb', '#171717', '#451a03', '#064e3b'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setRoomConfig({...roomConfig, floorColor: c})}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${roomConfig.floorColor === c ? 'border-secondary scale-125' : 'border-transparent shadow-lg'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
             </div>
          </div>
        </div>
      </section>

      <footer className="text-[9px] opacity-20 font-bold uppercase tracking-widest pointer-events-none mt-auto">
        R: Rotate • Del: Remove • Drag: Move
      </footer>
    </aside>
  );
}

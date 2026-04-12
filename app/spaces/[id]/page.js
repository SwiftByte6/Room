'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import Scene from '@/components/Scene'
import Sidebar from '@/components/Sidebar'
import { getSpaceById } from '@/lib/data/rooms'
import { useEditorStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Maximize2, Share2, Save } from 'lucide-react'
import Link from 'next/link'

const DORM_MODEL_PATH = '/models/rooms/Dorm-Room-transformed.glb';
let dormTemplateCache = null;

const formatDormLabel = (name) => {
  const cleaned = name
    .replace(/[_\-.]+/g, ' ')
    .replace(/[0-9]+/g, ' ')
    .replace(/\b(st|tx|md|mo|a|b|c|d)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return 'Dorm Item';
  return cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const iconForDormLabel = (label) => {
  const value = label.toLowerCase();
  if (value.includes('bed') || value.includes('pillow') || value.includes('comforter')) return '🛏️';
  if (value.includes('desk') || value.includes('table') || value.includes('chair')) return '🪑';
  if (value.includes('book') || value.includes('paper') || value.includes('post')) return '📚';
  if (value.includes('tech') || value.includes('tv') || value.includes('screen') || value.includes('camera')) return '🖥️';
  if (value.includes('light') || value.includes('lamp')) return '💡';
  if (value.includes('food') || value.includes('coffee')) return '☕';
  if (value.includes('vase') || value.includes('plant')) return '🪴';
  return '📦';
};

const isDormFixedNode = (nodeName) => {
  const name = nodeName.toLowerCase();
  return name.includes('st_walls') || name.includes('st_win') || name.includes('st_ground');
};

const toDormTemplates = (children) => {
  const namedChildren = children.filter((child) => child.name);
  const bedNodeName = 'ST_Furn_RoomBed01mo';
  const bedsheetNodeName = 'ST_Fab_Comforter04mo';
  const hasBedsheet = namedChildren.some((child) => child.name === bedsheetNodeName);
  const skippedNodeNames = new Set();

  return namedChildren
    .map((child, index) => {
      if (skippedNodeNames.has(child.name)) return null;

      const isBedBundleRoot = child.name === bedNodeName && hasBedsheet;
      if (isBedBundleRoot) {
        skippedNodeNames.add(bedsheetNodeName);
      }

      const label = formatDormLabel(child.name);
      const isLocked = isDormFixedNode(child.name);
      return {
        id: `dorm-${child.name}-${index}`,
        type: isBedBundleRoot ? 'dorm-bed-bedsheet' : `dorm-${child.name}`,
        label: isBedBundleRoot ? 'Room Bed + Bedsheet' : label,
        icon: isBedBundleRoot ? '🛏️' : iconForDormLabel(label),
        nodeName: child.name,
        nodeNames: isBedBundleRoot ? [bedNodeName, bedsheetNodeName] : [child.name],
        isLocked,
        position: [child.position.x, child.position.y, child.position.z],
        rotation: [child.rotation.x, child.rotation.y, child.rotation.z],
      };
    })
    .filter(Boolean);
};

const cloneDormTemplates = (templates) => {
  return templates.map((item) => ({
    ...item,
    nodeNames: item.nodeNames ? [...item.nodeNames] : undefined,
    position: [...item.position],
    rotation: [...item.rotation],
  }));
};

/**
 * SpacePlannerPage - The dynamic route for interacting with a specific 3D space.
 */
export default function SpacePlannerPage() {
  const params = useParams();
  const router = useRouter();
  const space = useMemo(() => getSpaceById(params.id), [params.id]);
  const isDormSpace = Boolean(space?.autoPopulateDormItems);
  const defaultCameraView = space?.defaultCameraView || 'isometric';
  const defaultCameraFov = space?.initialCamera?.fov || 35;

  // State from Store
  const { 
    getRoomData,
    setItems, 
    addItem, 
    updateItem, 
    removeItem, 
    selectedId, 
    setSelectedId,
    updateRoomConfig,
  } = useEditorStore();

  const { items, roomConfig } = useMemo(() => getRoomData(params.id), [getRoomData, params.id]); // Removed 'items' dependency to fix initialization error


  const [cameraView, setCameraView] = useState(defaultCameraView);
  const [cameraFov, setCameraFov] = useState(defaultCameraFov);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Rehydration check for Next.js
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Handle invalid space IDs
  useEffect(() => {
    if (!space) {
      router.push('/spaces');
      return;
    }
    // Simulate loading delay for premium feel
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, [space, router]);

  // Load Dorm Room Templates if needed
  useEffect(() => {
    if (!isDormSpace || !isHydrated) return;
    
    // If we already have items (e.g. from persistence), don't reload defaults
    const currentItems = getRoomData(params.id).items;
    if (currentItems.length > 0 && currentItems.some(i => i.id.startsWith('dorm-'))) return;

    let isMounted = true;

    if (dormTemplateCache) {
      const cachedItems = cloneDormTemplates(dormTemplateCache);
      queueMicrotask(() => {
        if (!isMounted) return;
        setItems(params.id, cachedItems);
        setSelectedId(cachedItems[0]?.id ?? null);
      });
      return () => { isMounted = false; };
    }

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      DORM_MODEL_PATH,
      (gltf) => {
        if (!isMounted) return;
        const templates = toDormTemplates(gltf.scene.children);
        dormTemplateCache = templates;
        const dormItems = cloneDormTemplates(templates);
        setItems(params.id, dormItems);
        setSelectedId(dormItems[0]?.id ?? null);
      },
      undefined,
      () => {
        if (!isMounted) return;
        setItems(params.id, []);
      }
    );

    return () => {
      isMounted = false;
      dracoLoader.dispose();
    };
  }, [params?.id, isDormSpace, isHydrated]); 

  const handleSaveLayout = useCallback(() => {
    alert('Layout Synced to Local Storage!');
  }, []);

  if (!space || !isHydrated) return null;

  return (
    <div className="flex w-screen h-screen bg-background overflow-hidden relative font-sans antialiased text-foreground">
      {/* Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-[100] bg-background flex flex-col items-center justify-center p-12 text-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 border-t-2 border-primary rounded-full mb-8 shadow-lg shadow-primary/20"
            />
            <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-gradient">Initialising Lab</h2>
            <p className="opacity-40 text-xs font-bold uppercase mt-2 tracking-widest">Loading: {space.name}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Action Bar */}
      <div className="absolute top-6 left-6 right-6 z-50 pointer-events-none flex items-center justify-between">
        <div className="pointer-events-auto flex gap-4">
          <Link href="/spaces">
             <button className="flex items-center gap-2 glass px-5 py-3 rounded-2xl hover:bg-white/10 transition-colors">
               <ArrowLeft className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Registry</span>
             </button>
          </Link>
          <div className="px-6 py-3 glass rounded-2xl flex flex-col justify-center">
             <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">{space.id}</span>
             <h2 className="text-xs font-bold whitespace-nowrap">{space.name}</h2>
          </div>
        </div>

        <div className="pointer-events-auto flex gap-3">
           <button className="glass p-3 rounded-2xl hover:bg-white/5 transition-all text-foreground/40 hover:text-foreground">
             <Share2 className="w-4 h-4" />
           </button>
           <button className="glass p-3 rounded-2xl hover:bg-white/5 transition-all text-foreground/40 hover:text-foreground">
             <Maximize2 className="w-4 h-4" />
           </button>
           <button 
             onClick={handleSaveLayout}
             className="bg-primary hover:bg-primary-600 transition-colors flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl shadow-primary/20"
           >
              <Save className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Store Layout</span>
           </button>
        </div>
      </div>

      {/* Interactive Toolbar (Quick Access) */}
      <div className="absolute left-[400px] bottom-8 z-50 pointer-events-auto filter drop-shadow-2xl">
         <div className="glass px-6 py-4 rounded-3xl flex items-center gap-8 border-white/5">
             <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Active Entities</span>
                <span className="text-sm font-black text-accent">{items.length} units</span>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <div className="flex gap-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 animate-pulse">Design System Phase v1</span>
             </div>
         </div>
      </div>

      {/* Main UI Layout */}
      <Sidebar 
        space={space}
        cameraView={cameraView}
        setCameraView={setCameraView}
        cameraFov={cameraFov}
        setCameraFov={setCameraFov}
      />

      <section className="flex-1 relative">
        <Scene 
          space={space}
          cameraView={cameraView}
          cameraFov={cameraFov}
        />
      </section>
    </div>
  );
}

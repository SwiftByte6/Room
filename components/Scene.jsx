'use client'
import React, { Suspense, useEffect, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, Grid, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { StaticRoom } from './Room'
import { MovableItem } from './3d/MovableItem'
import { ITEM_COMPONENTS, AVAILABLE_ITEMS } from './3d/Furniture'
import { DormNodeAsset } from './3d/DormNodeAsset'
import { useEditorStore } from '@/lib/store'

/**
 * Scene - The main 3D environment for the Room Planner.
 * @param {object} space - The configuration for the current room.
 */
export default function Scene({ space, cameraView }) {
  const { 
    getRoomData,
    updateItem, 
    selectedId, 
    setSelectedId, 
    removeItem, 
  } = useEditorStore();

  const { items, roomConfig } = getRoomData(space.id);

  const [isSpacePressed, setIsSpacePressed] = useState(false)
  
  const viewPresets = {
    isometric: { pos: space.initialCamera.position, fov: space.initialCamera.fov },
    front: { pos: [0, 5, 12], fov: 35 },
    top: { pos: [0, 15, 0], fov: 25 },
  };

  const currentView = viewPresets[cameraView] || viewPresets.isometric;

  // Register a global delete key listener for the selected item
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          removeItem(space.id, selectedId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, removeItem, space.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const lightingSettings = useMemo(() => {
    switch (roomConfig.lighting) {
      case 'day':
        return {
          preset: 'sunset',
          ambient: 0.8,
          directional: 1.5,
          color: '#ffffff',
          position: [10, 10, 5],
        };
      case 'night':
        return {
          preset: 'night',
          ambient: 0.2,
          directional: 0.4,
          color: '#3b82f6',
          position: [-5, 5, -5],
        };
      case 'neutral':
      default:
        return {
          preset: 'city',
          ambient: 0.7,
          directional: 1.2,
          color: '#ffffff',
          position: [10, 10, 5],
        };
    }
  }, [roomConfig.lighting]);

  return (
    <div className="w-full h-full bg-background relative">
      <Canvas shadows camera={{ position: currentView.pos, fov: currentView.fov }}>
        <Suspense fallback={null}>
          <Environment preset={lightingSettings.preset} />
          <ambientLight intensity={lightingSettings.ambient} />
          <directionalLight
            position={lightingSettings.position}
            intensity={lightingSettings.directional}
            color={lightingSettings.color}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />


          <OrbitControls
            makeDefault
            enabled={isSpacePressed}
            enableDamping
            dampingFactor={0.08}
            target={[0, 0, 0]}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.1}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN,
            }}
          />

          {/* Static Room Layout - Loaded from space config */}
          {!space.autoPopulateDormItems && (
            <StaticRoom glbPath={space.glbPath} config={roomConfig} />
          )}

          {/* Contact Shadows */}
          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={4.5} 
          />

          {/* Design Grid */}
          <Grid
            infiniteGrid
            fadeDistance={30}
            fadeStrength={5}
            cellSize={0.5}
            sectionSize={1}
            sectionThickness={1}
            sectionColor="#333"
            cellColor="#222"
            position={[0, -0.01, 0]}
          />

          {/* Dynamic Draggable Items */}
          {items.map((item) => {
            const isDormItem = Boolean(item.nodeName);
            const isLockedDormStructure = isDormItem && item.isLocked;
            const FurnitureComponent = ITEM_COMPONENTS[item.type];
            const itemMeta = AVAILABLE_ITEMS.find((entry) => entry.type === item.type);
            if (!isDormItem && !FurnitureComponent) return null;

            if (isLockedDormStructure) {
              return (
                <group
                  key={item.id}
                  position={item.position}
                  rotation={item.rotation}
                >
                  <DormNodeAsset 
                    nodeName={item.nodeName} 
                    nodeNames={item.nodeNames} 
                    color={item.color}
                  />
                </group>
              );
            }

            return (
              <MovableItem
                key={item.id}
                initialPosition={item.position}
                initialRotation={item.rotation}
                isSelected={selectedId === item.id}
                onSelect={() => setSelectedId(item.id)}
                onUpdate={(updates) => updateItem(space.id, item.id, updates)}
                bounds={space.bounds}
                snap={0.25}
              >
                {isDormItem ? (
                  <DormNodeAsset 
                    nodeName={item.nodeName} 
                    nodeNames={item.nodeNames} 
                    color={item.color}
                  />
                ) : (
                  <FurnitureComponent 
                    scale={item.scale} 
                    color={item.color}
                  />
                )}

              </MovableItem>
            );
          })}
        </Suspense>
      </Canvas>

      {/* UI Overlay for controls hint */}
      <div className="absolute bottom-8 right-8 flex gap-4 text-[10px] font-black uppercase tracking-widest opacity-20 pointer-events-none">
        <span>Orbit: Hold Space + Drag</span>
        <span>Drag: Move</span>
        <span>R: Rotate</span>
        <span>DEL: Delete</span>
      </div>
    </div>
  );
}
'use client'
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Grid, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { StaticRoom } from './Room'
import { MovableItem } from './3d/MovableItem'
import { ITEM_COMPONENTS } from './3d/Furniture'
import { DormNodeAsset } from './3d/DormNodeAsset'
import { useEditorStore } from '@/lib/store'

function CameraSync({ view, cameraView, fov }) {
  const { camera, controls } = useThree()
  const manInitializedRef = useRef(false)
  const previousViewRef = useRef(null)
  const customPoseRef = useRef(null)

  useFrame(() => {
    if (cameraView !== 'custom') return

    customPoseRef.current = {
      position: camera.position.clone(),
      target: controls?.target ? controls.target.clone() : new THREE.Vector3(0, 0, 0),
    }
  })

  useEffect(() => {
    const activeFov = fov || view.fov
    const viewChanged = previousViewRef.current !== cameraView

    camera.fov = activeFov

    if (cameraView === 'man') {
      if (!manInitializedRef.current) {
        camera.position.set(0, 1.65, 4.5)
        camera.rotation.set(0, Math.PI, 0)
        if (controls?.target) {
          controls.target.set(0, 1.5, 0)
          controls.update()
        }
        manInitializedRef.current = true
      }
      previousViewRef.current = cameraView
    } else {
      manInitializedRef.current = false

      if (cameraView === 'custom') {
        if (viewChanged) {
          if (customPoseRef.current?.position) {
            camera.position.copy(customPoseRef.current.position)
            if (controls?.target) {
              controls.target.copy(customPoseRef.current.target)
              controls.update()
            }
          } else {
            camera.position.set(...view.pos)
            if (controls?.target) {
              controls.target.set(0, 0, 0)
              controls.update()
            }
            camera.lookAt(0, 0, 0)
          }
        }
      } else if (viewChanged) {
        camera.position.set(...view.pos)
        if (controls?.target) {
          controls.target.set(0, 0, 0)
          controls.update()
        }
        camera.lookAt(0, 0, 0)
      }

      previousViewRef.current = cameraView
    }

    camera.updateProjectionMatrix()

  }, [camera, controls, cameraView, fov, view])

  return null
}

function FreeMoveControls({ enabled, bounds }) {
  const { camera } = useThree()
  const keysRef = useRef({})
  const initializedRef = useRef(false)
  const yawRef = useRef(0)
  const pitchRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      initializedRef.current = false
      return
    }

    camera.rotation.order = 'YXZ'
    yawRef.current = camera.rotation.y
    pitchRef.current = camera.rotation.x
    initializedRef.current = true
  }, [camera, enabled])

  useEffect(() => {
    if (!enabled) return undefined

    const handleKeyDown = (event) => {
      if (['INPUT', 'TEXTAREA'].includes(event.target?.tagName) || event.target?.isContentEditable) return
      keysRef.current[event.code] = true
    }

    const handleKeyUp = (event) => {
      keysRef.current[event.code] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [enabled])

  useFrame((_, delta) => {
    if (!enabled || !initializedRef.current) return

    const keys = keysRef.current
    const moveSpeed = (keys.ShiftLeft || keys.ShiftRight ? 9 : 5) * delta
    const turnSpeed = 1.5 * delta

    if (keys.ArrowLeft) yawRef.current += turnSpeed
    if (keys.ArrowRight) yawRef.current -= turnSpeed
    if (keys.ArrowUp) pitchRef.current += turnSpeed * 0.8
    if (keys.ArrowDown) pitchRef.current -= turnSpeed * 0.8

    pitchRef.current = THREE.MathUtils.clamp(pitchRef.current, -1.15, 1.15)

    const forward = new THREE.Vector3(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current))
    const right = new THREE.Vector3(-forward.z, 0, forward.x).normalize()

    const movement = new THREE.Vector3()
    if (keys.KeyW) movement.add(forward)
    if (keys.KeyS) movement.sub(forward)
    if (keys.KeyD) movement.add(right)
    if (keys.KeyA) movement.sub(right)
    if (keys.Space) movement.y += 1
    if (keys.ControlLeft || keys.ControlRight) movement.y -= 1

    if (movement.lengthSq() > 0) {
      movement.normalize().multiplyScalar(moveSpeed)
      camera.position.add(movement)

      if (bounds?.x) {
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, bounds.x[0], bounds.x[1])
      }
      if (bounds?.z) {
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, bounds.z[0], bounds.z[1])
      }
      camera.position.y = THREE.MathUtils.clamp(camera.position.y, 1.45, 2.1)
    }

    camera.rotation.set(pitchRef.current, yawRef.current, 0)
    camera.updateProjectionMatrix()
  })

  return null
}

/**
 * Scene - The main 3D environment for the Room Planner.
 * @param {object} space - The configuration for the current room.
 */
export default function Scene({ space, cameraView, cameraFov }) {
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
    isometric: { pos: space.initialCamera.position, fov: cameraFov || space.initialCamera.fov },
    front: { pos: [0, 5, 12], fov: 35 },
    top: { pos: [0, 15, 0], fov: 25 },
    custom: { pos: space.initialCamera.position, fov: cameraFov || space.initialCamera.fov },
    man: { pos: space.initialCamera.position, fov: cameraFov || space.initialCamera.fov },
  };

  const currentView = viewPresets[cameraView] || viewPresets.isometric;
  const currentFov = cameraFov || currentView.fov;
  const isManView = cameraView === 'man';

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
    const selectedPreset = roomConfig?.lightingSettings?.preset || roomConfig?.lighting || 'city';
    const ambientMultiplier = roomConfig?.lightingSettings?.ambient ?? 1;
    const lightMultiplier = Math.max(0.25, ambientMultiplier);

    const presetMap = {
      apartment: {
        background: '#edf4ff',
        ambient: 0.95,
        hemisphere: 0.6,
        directional: 1.8,
        fill: 0.75,
        color: '#ffffff',
        fillColor: '#dbeafe',
        position: [-10, 10, 5],
        fillPosition: [8, 6, -4],
      },
      city: {
        background: '#e7edf5',
        ambient: 0.8,
        hemisphere: 0.45,
        directional: 1.35,
        fill: 0.55,
        color: '#ffffff',
        fillColor: '#cbd5e1',
        position: [-10, 10, 5],
        fillPosition: [7, 5, -3],
      },
      night: {
        background: '#080b14',
        ambient: 0.28,
        hemisphere: 0.24,
        directional: 0.7,
        fill: 0.32,
        color: '#3b82f6',
        fillColor: '#1d4ed8',
        position: [-8, 5, -5],
        fillPosition: [4, 3, 4],
      },
      day: {
        background: '#edf4ff',
        ambient: 0.95,
        hemisphere: 0.6,
        directional: 1.8,
        fill: 0.75,
        color: '#ffffff',
        fillColor: '#dbeafe',
        position: [-10, 10, 5],
        fillPosition: [8, 6, -4],
      },
      neutral: {
        background: '#e7edf5',
        ambient: 0.8,
        hemisphere: 0.45,
        directional: 1.35,
        fill: 0.55,
        color: '#ffffff',
        fillColor: '#cbd5e1',
        position: [-10, 10, 5],
        fillPosition: [7, 5, -3],
      },
    };

    const base = presetMap[selectedPreset] || presetMap.city;
    return {
      ...base,
      ambient: base.ambient * ambientMultiplier,
      hemisphere: base.hemisphere * ambientMultiplier,
      directional: base.directional * lightMultiplier,
      fill: base.fill * lightMultiplier,
    };
  }, [roomConfig?.lightingSettings, roomConfig?.lighting]);

  return (
    <div className="w-full h-full bg-background relative">
      <Canvas shadows camera={{ position: space.initialCamera.position, fov: currentFov }}>
        <Suspense fallback={null}>
          <CameraSync view={{ ...currentView, fov: currentFov }} cameraView={cameraView} fov={currentFov} />
          <FreeMoveControls enabled={isManView} bounds={space.bounds} />
          <color attach="background" args={[lightingSettings.background]} />
          <ambientLight intensity={lightingSettings.ambient} />
          <hemisphereLight
            intensity={lightingSettings.hemisphere}
            color={lightingSettings.color}
            groundColor="#1f2937"
          />
          <directionalLight
            position={lightingSettings.position}
            intensity={lightingSettings.directional}
            color={lightingSettings.color}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-normalBias={0.03}
          />
          <directionalLight
            position={lightingSettings.fillPosition}
            intensity={lightingSettings.fill}
            color={lightingSettings.fillColor}
          />

          <OrbitControls
            makeDefault
            enabled={!isManView && (cameraView !== 'custom' || isSpacePressed)}
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
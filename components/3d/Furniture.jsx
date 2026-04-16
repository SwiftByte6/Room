'use client'
import React, { useMemo } from 'react'
import { Clone, useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'
import { ITEM_LIBRARY } from '@/lib/data/items'


function GLTFAsset({ modelPath, scale = 1, color, ...props }) {
  const { scene } = useGLTF(modelPath)

  const cloned = useMemo(() => {
    const next = scene.clone(true)
    next.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
        if (color) {
          node.material = node.material.clone()
          node.material.color = new THREE.Color(color)
        }
      }
    })
    return next
  }, [scene, color])

  return (
    <group {...props} dispose={null}>
      <Center bottom>
        <group scale={scale}>
          <Clone object={cloned} />
        </group>
      </Center>
    </group>
  )
}

function LanternLight({ scale = 1, color = '#ffd166', ...props }) {
  const glow = new THREE.Color(color)

  return (
    <group {...props} dispose={null}>
      <Center bottom>
        <group scale={scale}>
          <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 24]} />
            <meshStandardMaterial color="#2f2f2f" metalness={0.55} roughness={0.45} />
          </mesh>

          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.34, 24]} />
            <meshStandardMaterial
              color={glow}
              emissive={glow}
              emissiveIntensity={1.25}
              transparent
              opacity={0.82}
              roughness={0.2}
              metalness={0.05}
            />
          </mesh>

          <mesh position={[0, 0.5, 0]} castShadow>
            <torusGeometry args={[0.1, 0.018, 16, 40]} />
            <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
          </mesh>

          <pointLight
            position={[0, 0.3, 0]}
            color={glow}
            intensity={2.2}
            distance={4.8}
            decay={2}
            castShadow
          />
        </group>
      </Center>
    </group>
  )
}

function LightTube({ scale = 1, color = '#f8fafc', ...props }) {
  const tubeColor = new THREE.Color(color)

  return (
    <group {...props} dispose={null}>
      <Center bottom>
        <group scale={scale}>
          <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.08, 0.16]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.35} roughness={0.65} />
          </mesh>

          <mesh position={[0, 0.11, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.88, 8, 16]} />
            <meshStandardMaterial
              color={tubeColor}
              emissive={tubeColor}
              emissiveIntensity={1.9}
              roughness={0.08}
              metalness={0.03}
            />
          </mesh>

          <pointLight
            position={[0, 0.14, 0]}
            color={tubeColor}
            intensity={2.8}
            distance={6.5}
            decay={2}
            castShadow
          />
        </group>
      </Center>
    </group>
  )
}

const createAssetComponent = ({ path, defaultScale }) => {
  return function AssetComponent(props) {
    const scale = props.scale ?? defaultScale
    return <GLTFAsset {...props} modelPath={path} scale={scale} color={props.color} />
  }
}

const createCustomComponent = (model) => {
  if (model.type === 'normal-lantern-light') {
    return function LanternAsset(props) {
      const scale = props.scale ?? model.defaultScale
      return <LanternLight {...props} scale={scale} color={props.color} />
    }
  }

  if (model.type === 'light-tube') {
    return function TubeAsset(props) {
      const scale = props.scale ?? model.defaultScale
      return <LightTube {...props} scale={scale} color={props.color} />
    }
  }

  return null
}


// Metadata for the sidebar
export const AVAILABLE_ITEMS = ITEM_LIBRARY.map(({ type, label, iconChar, defaultScale }) => ({
  type,
  label,
  icon: iconChar,
  defaultScale,
}))

// Mapping types to components
export const ITEM_COMPONENTS = ITEM_LIBRARY.reduce((acc, model) => {
  const customComponent = createCustomComponent(model)
  acc[model.type] = customComponent || createAssetComponent(model)
  return acc
}, {})

ITEM_LIBRARY.forEach((model) => {
  if (model.path) {
    useGLTF.preload(model.path)
  }
})


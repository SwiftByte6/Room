'use client'
import React, { useMemo } from 'react'
import { Clone, useGLTF, Center } from '@react-three/drei'

const MODEL_LIBRARY = [
  {
    type: 'gaming-chair',
    label: 'Gaming Chair',
    icon: '🪑',
    path: '/models/red_gaming_chair_highquality.glb',
    defaultScale: 0.95,
  },
  {
    type: 'bean-bag',
    label: 'Bean Bag',
    icon: '🛋️',
    path: '/models/velvet_bean_bag.glb',
    defaultScale: 0.8,
  },
  {
    type: 'plant',
    label: 'Plant Pot',
    icon: '🪴',
    path: '/models/plant_pot_ivy.glb',
    defaultScale: 0.9,
  },
  {
    type: 'monitor',
    label: 'Curved Monitor',
    icon: '🖥️',
    path: '/models/curved_gaming_monitor.glb',
    defaultScale: 0.6,
  },
  {
    type: 'computer-setup',
    label: 'PC Setup',
    icon: '🧑‍💻',
    path: '/models/dream_computer_setup.glb',
    defaultScale: 0.55,
  },
  {
    type: 'console',
    label: 'PS5',
    icon: '🎮',
    path: '/models/ps5.glb',
    defaultScale: 0.55,
  },
]

function GLTFAsset({ modelPath, scale = 1, ...props }) {
  const { scene } = useGLTF(modelPath)

  const cloned = useMemo(() => {
    const next = scene.clone(true)
    next.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
    return next
  }, [scene])

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

const createAssetComponent = ({ path, defaultScale }) => {
  return function AssetComponent(props) {
    const scale = props.scale ?? defaultScale
    return <GLTFAsset {...props} modelPath={path} scale={scale} />
  }
}

// Metadata for the sidebar
export const AVAILABLE_ITEMS = MODEL_LIBRARY.map(({ type, label, icon, defaultScale }) => ({
  type,
  label,
  icon,
  defaultScale,
}))

// Mapping types to components
export const ITEM_COMPONENTS = MODEL_LIBRARY.reduce((acc, model) => {
  acc[model.type] = createAssetComponent(model)
  return acc
}, {})

MODEL_LIBRARY.forEach((model) => {
  useGLTF.preload(model.path)
})

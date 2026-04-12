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

const createAssetComponent = ({ path, defaultScale }) => {
  return function AssetComponent(props) {
    const scale = props.scale ?? defaultScale
    return <GLTFAsset {...props} modelPath={path} scale={scale} color={props.color} />
  }
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
  acc[model.type] = createAssetComponent(model)
  return acc
}, {})

ITEM_LIBRARY.forEach((model) => {
  useGLTF.preload(model.path)
})


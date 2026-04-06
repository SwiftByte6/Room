'use client'
import React, { useMemo } from 'react'
import { Clone, useGLTF } from '@react-three/drei'

const DORM_MODEL_PATH = '/Dorm-Room-transformed.glb'

export function DormNodeAsset({ nodeName, nodeNames }) {
  const { scene } = useGLTF(DORM_MODEL_PATH)

  const names = useMemo(() => {
    if (Array.isArray(nodeNames) && nodeNames.length > 0) return nodeNames
    if (nodeName) return [nodeName]
    return []
  }, [nodeNames, nodeName])

  const clonedObjects = useMemo(
    () =>
      names
        .map((name) => {
          const source = scene.getObjectByName(name)
          if (!source) return null

          const next = source.clone(true)
          // Position and rotation are controlled by MovableItem wrapper.
          next.position.set(0, 0, 0)
          next.rotation.set(0, 0, 0)

          next.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true
              node.receiveShadow = true
            }
          })
          return { name, object: next }
        })
        .filter(Boolean),
    [scene, names]
  )

  if (!clonedObjects.length) return null

  return (
    <group>
      {clonedObjects.map((entry) => (
        <Clone key={entry.name} object={entry.object} />
      ))}
    </group>
  )
}

useGLTF.preload(DORM_MODEL_PATH)
'use client'
import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * MovableItem - A generic wrapper to make 3D objects draggable on the X-Z plane.
 * Syncs position and rotation back to parent state with refined selection visuals.
 */
export function MovableItem({ 
  children, 
  initialPosition = [0, 0, 0], 
  initialRotation = [0, 0, 0],
  onSelect,
  isSelected = false,
  onUpdate,
  snap = 0.1,
  bounds = { x: [-2.2, 2.2], z: [-2.2, 2.2] } 
}) {
  const { raycaster } = useThree()
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const groupRef = useRef()
  const positionRef = useRef(new THREE.Vector3(...initialPosition))
  const targetPositionRef = useRef(new THREE.Vector3(...initialPosition))
  const rotationRef = useRef(new THREE.Euler(...initialRotation))
  const keyStateRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  })
  const keyboardMovedRef = useRef(false)
  
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const offset = useRef(new THREE.Vector3())

  const applyBoundsAndSnap = (x, z, shouldSnap = true) => {
    let nextX = x
    let nextZ = z

    if (snap && shouldSnap) {
      nextX = Math.round(nextX / snap) * snap
      nextZ = Math.round(nextZ / snap) * snap
    }

    nextX = THREE.MathUtils.clamp(nextX, bounds.x[0], bounds.x[1])
    nextZ = THREE.MathUtils.clamp(nextZ, bounds.z[0], bounds.z[1])

    return { x: nextX, z: nextZ }
  }

  // Sync position from props
  useEffect(() => {
    if (!isDragging) {
      positionRef.current.set(...initialPosition)
      targetPositionRef.current.set(...initialPosition)
      if (groupRef.current) {
        groupRef.current.position.copy(positionRef.current)
      }
    }
  }, [initialPosition, isDragging])

  // Sync rotation from props
  useEffect(() => {
    rotationRef.current.set(...initialRotation)
    if (groupRef.current) {
      groupRef.current.rotation.copy(rotationRef.current)
    }
  }, [initialRotation])

  // 'R' Key Rotation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isSelected) return
      if (e.target?.tagName === 'INPUT' || e.target?.tagName === 'TEXTAREA') return

      if (isSelected && (e.key === 'r' || e.key === 'R')) {
        const newRot = new THREE.Euler(
          rotationRef.current.x,
          rotationRef.current.y + Math.PI / 2,
          rotationRef.current.z
        )
        rotationRef.current.copy(newRot)
        if (groupRef.current) {
          groupRef.current.rotation.copy(newRot)
        }
        onUpdate?.({ rotation: [newRot.x, newRot.y, newRot.z] })
      }

      if (e.code === 'ArrowUp' || e.code === 'KeyW') keyStateRef.current.up = true
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keyStateRef.current.down = true
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keyStateRef.current.left = true
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keyStateRef.current.right = true

      if (
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.code === 'KeyW' ||
        e.code === 'KeyA' ||
        e.code === 'KeyS' ||
        e.code === 'KeyD'
      ) {
        e.preventDefault()
      }
    }

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keyStateRef.current.up = false
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keyStateRef.current.down = false
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keyStateRef.current.left = false
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keyStateRef.current.right = false

      const isMoving = Object.values(keyStateRef.current).some(Boolean)
      if (!isMoving && keyboardMovedRef.current) {
        keyboardMovedRef.current = false
        onUpdate?.({
          position: [
            targetPositionRef.current.x,
            targetPositionRef.current.y,
            targetPositionRef.current.z,
          ],
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isSelected, onUpdate])

  useFrame((_, delta) => {
    if (isSelected && !isDragging) {
      const moveDir = new THREE.Vector3(
        (keyStateRef.current.right ? 1 : 0) - (keyStateRef.current.left ? 1 : 0),
        0,
        (keyStateRef.current.down ? 1 : 0) - (keyStateRef.current.up ? 1 : 0)
      )

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize()
        const keyboardSpeed = 2.6
        const step = keyboardSpeed * delta
        const nextX = targetPositionRef.current.x + moveDir.x * step
        const nextZ = targetPositionRef.current.z + moveDir.z * step
        const clamped = applyBoundsAndSnap(nextX, nextZ, false)

        targetPositionRef.current.set(clamped.x, targetPositionRef.current.y, clamped.z)
        keyboardMovedRef.current = true
      }
    }

    positionRef.current.lerp(targetPositionRef.current, 0.2)

    if (positionRef.current.distanceToSquared(targetPositionRef.current) < 0.000001) {
      positionRef.current.copy(targetPositionRef.current)
    }

    if (groupRef.current) {
      groupRef.current.position.copy(positionRef.current)
    }
  })

  const onPointerDown = (e) => {
    e.stopPropagation()
    setIsDragging(true)
    onSelect()
    
    const intersectPoint = new THREE.Vector3()
    raycaster.ray.intersectPlane(planeRef.current, intersectPoint)
    offset.current.copy(intersectPoint).sub(positionRef.current)
  }

  const onPointerMove = (e) => {
    if (!isDragging) return
    e.stopPropagation()

    const intersectPoint = new THREE.Vector3()
    raycaster.ray.intersectPlane(planeRef.current, intersectPoint)
    
    let newX = intersectPoint.x - offset.current.x
    let newZ = intersectPoint.z - offset.current.z

    const constrained = applyBoundsAndSnap(newX, newZ, true)
    targetPositionRef.current.set(constrained.x, targetPositionRef.current.y, constrained.z)
  }

  const onPointerUp = () => {
    if (isDragging) {
      setIsDragging(false)
      onUpdate?.({
        position: [
          targetPositionRef.current.x,
          targetPositionRef.current.y,
          targetPositionRef.current.z,
        ],
      })
    }
  }

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={isHovered || isDragging ? 1.05 : 1}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        onPointerUp();
      }}
    >
      {/* Premium Selection Halo */}
      {(isSelected || isDragging) && (
        <group position-y={0.001}>
          {/* Main Neon Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.7, 0.72, 64]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.8} />
          </mesh>
          {/* Soft Glow */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.65, 0.75, 64]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
          </mesh>
          {/* Inner Light */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.7, 32]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.05} />
          </mesh>
        </group>
      )}
      
      <group>
        {children}
      </group>
    </group>
  )
}

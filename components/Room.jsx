'use client'
import React from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * StaticRoom - Renders the non-interactive architectural base of a room.
 * @param {string} glbPath - The dynamic path to the room model.
 */
export function StaticRoom({ glbPath, config, ...props }) {
  const { nodes, materials } = useGLTF(glbPath)
  
  const wallColor = config?.wallColor || '#ffffff';
  const floorColor = config?.floorColor || '#ffffff';
  const roughness = config?.roughness ?? 0.8;
  const scale = config?.scale || 1.0;

  return (
    <group {...props} scale={scale} rotation={[-Math.PI / 2, 0, 0]} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <group scale={5}>
          {/* Main Floor / Carpet - Assuming consistent node naming for floor/walls */}
          {nodes.Object_4 && (
            <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry}>
              <meshStandardMaterial 
                color={floorColor} 
                roughness={roughness} 
                envMapIntensity={0.5}
              />
            </mesh>
          )}
          {/* Main Walls */}
          {nodes.Object_5 && (
            <mesh castShadow receiveShadow geometry={nodes.Object_5.geometry}>
              <meshStandardMaterial 
                color={wallColor} 
                roughness={roughness} 
                envMapIntensity={0.5}
              />
            </mesh>
          )}
        </group>

        {/* Windows and fixtures */}
        {nodes.Object_7 && nodes.Object_8 && (
          <group position={[-2.805, 1.296, -3.86]} scale={0.921}>
            <mesh geometry={nodes.Object_7.geometry} material={materials.LightBlue} />
            <mesh geometry={nodes.Object_8.geometry} material={materials.Wood} />
          </group>
        )}
      </group>
    </group>
  )
}
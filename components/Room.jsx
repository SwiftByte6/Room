import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const TEXTURE_URLS = {
  wood: '/textures/wood.png',
  marble: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000&v=5',
  pattern: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=1000&v=5',
  bricks: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=1000&v=5',
  concrete: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000&v=5',
};





/**
 * StaticRoom - Renders the non-interactive architectural base of a room.
 * @param {string} glbPath - The dynamic path to the room model.
 */
export function StaticRoom({ glbPath, config, ...props }) {
  const { nodes, materials } = useGLTF(glbPath)
  const textureMaps = useTexture(TEXTURE_URLS)
  
  const wallColor = config?.wallColor || '#ffffff';
  const floorColor = config?.floorColor || '#ffffff';
  const roughness = config?.roughness ?? 0.8;
  const scale = config?.scale || 1.0;

  // Select Textures
  const floorMap = textureMaps[config?.floorTexture];
  const wallMap = textureMaps[config?.wallTexture];

  if (floorMap) {
    floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
    floorMap.repeat.set(1, 1);
    floorMap.colorSpace = THREE.SRGBColorSpace;
  }

  if (wallMap) {
    wallMap.wrapS = wallMap.wrapT = THREE.RepeatWrapping;
    wallMap.repeat.set(1, 1);
    wallMap.colorSpace = THREE.SRGBColorSpace;
  }



  return (
    <group {...props} scale={scale} rotation={[-Math.PI / 2, 0, 0]} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <group scale={5}>
          {/* Main Floor / Carpet */}
          {nodes.Object_4 && (
            <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry}>
              <meshStandardMaterial 
                color={floorColor} 
                map={floorMap}
                roughness={roughness} 
                envMapIntensity={1}
              />
            </mesh>
          )}
          {/* Main Walls */}
          {nodes.Object_5 && (
            <mesh castShadow receiveShadow geometry={nodes.Object_5.geometry}>
              <meshStandardMaterial 
                color={wallColor} 
                map={wallMap}
                roughness={roughness} 
                envMapIntensity={0.5}
              />
            </mesh>
          )}
        </group>

        {/* Bookshelf removed by request */}
      </group>
    </group>
  )
}


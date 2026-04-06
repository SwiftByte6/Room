/**
 * Space Configuration System
 * Each space represents a different 3D room model and layout environment.
 */
export const AVAILABLE_SPACES = [
  {
    id: 'minimalist-studio',
    name: 'Minimalist Studio',
    description: 'A clean, open space for focused work and high-fidelity productivity.',
    glbPath: '/isometric_room_1.glb',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    accentColor: '#3b82f6',
    initialCamera: { position: [8, 8, 8], fov: 35 },
    bounds: { x: [-2.2, 2.2], z: [-2.2, 2.2] },
    availableItems: ['gaming-chair', 'bean-bag', 'plant', 'monitor', 'computer-setup', 'console'],
  },
  {
    id: 'dorm-room',
    name: 'Dorm Room',
    description: 'Fully explodable dorm setup where every model component can be moved.',
    glbPath: '/Dorm-Room-transformed.glb',
    thumbnail: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800',
    accentColor: '#f97316',
    initialCamera: { position: [7, 6, 7], fov: 35 },
    bounds: { x: [-4.5, 4.5], z: [-4.5, 4.5] },
    availableItems: [],
    autoPopulateDormItems: true,
    defaultCameraView: 'front',
  },
];

export const getSpaceById = (id) => AVAILABLE_SPACES.find((s) => s.id === id);

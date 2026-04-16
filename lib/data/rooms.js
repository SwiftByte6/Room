/**
 * Space Configuration System
 * Each space represents a different 3D room model and layout environment.
 */
export const AVAILABLE_SPACES = [
  {
    id: 'minimalist-studio',
    name: 'Minimalist Studio',
    description: 'A clean, open workspace demonstrating sharp edge geometry, diffuse lighting, and layered depth rendering. Minimal clutter, maximum visual precision.',
    glbPath: '/models/rooms/isometric_room_1.glb',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    accentColor: '#3b82f6',
    initialCamera: { position: [7.5, 8.5, 8.5], fov: 34 },
    bounds: { x: [-4.5, 4.5], z: [-4.5, 4.5] },

    availableItems: [
      'gaming-chair', 'bean-bag', 'plant', 'monitor', 'computer-setup', 
      'console', 'desk-full', 'ac-unit', 'modern-bed', 'window-blinds',
      'blossom-katana', 'modern-desk-v2', 'ring-light', 'cloth-curtain',
      'sofa', 'normal-lantern-light', 'light-tube'
    ],


  },
  {
    id: 'dorm-room',
    name: 'Dorm Room',
    description: 'A compact living space where every object is a fully modular mesh component. Explore exploded views, translate and rotate individual assets, and see how 3D objects decompose.',
    glbPath: '/models/rooms/Dorm-Room-transformed.glb',
    thumbnail: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800',
    accentColor: '#f97316',
    initialCamera: { position: [7, 6, 7], fov: 35 },
    bounds: { x: [-4.5, 4.5], z: [-4.5, 4.5] },
    availableItems: [],
    autoPopulateDormItems: true,
    defaultCameraView: 'front',
  },
  {
    id: 'future-lab',
    name: 'Future Lab',
    description: "A futuristic command hub featuring reflective surfaces, dynamic point lights, and high-contrast materials. Built to push your renderer's limits - shadows, specularity and ambient occlusion on full display.",
    glbPath: '/models/rooms/isometric_room_1.glb',
    thumbnail: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&q=80&w=800',
    accentColor: '#d946ef',
    initialCamera: { position: [7.5, 8.5, 8.5], fov: 34 },
    bounds: { x: [-4.5, 4.5], z: [-4.5, 4.5] },
    availableItems: [
      'monitor', 'computer-setup', 'ring-light', 'light-tube', 'normal-lantern-light',
      'modern-desk-v2', 'sofa', 'plant', 'console'
    ],
  },
];


export const getSpaceById = (id) => AVAILABLE_SPACES.find((s) => s.id === id);

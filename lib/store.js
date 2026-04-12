import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getItemByType } from './data/items'

/**
 * useEditorStore - Centralized state for the Room Designer.
 * Persists multiple room layouts independently in LocalStorage.
 */
export const useEditorStore = create(
  persist(
    (set, get) => ({
      // State
      roomLayouts: {}, // { [roomId]: { items: [], roomConfig: {} } }
      selectedId: null,

      // Getters (Helper logic)
      getRoomData: (roomId) => {
        const defaultData = {
          items: [],
          roomConfig: {
            wallColor: '#ffffff',
            floorColor: '#e5e7eb',
            roughness: 0.8,
            scale: 1,
            lightingSettings: {
              preset: 'city',
              ambient: 1.0
            },
            floorTexture: 'plain', // 'plain', 'wood', 'marble'
            wallTexture: 'plain', // 'plain', 'pattern'
          }

        };

        return get().roomLayouts[roomId] || defaultData;
      },

      // Actions
      setItems: (roomId, items) => set((state) => ({
        roomLayouts: {
          ...state.roomLayouts,
          [roomId]: {
            ...(state.roomLayouts[roomId] || { roomConfig: { wallColor: '#ffffff', floorColor: '#e5e7eb', roughness: 0.8, scale: 1 } }),
            items
          }
        }
      })),
      
      addItem: (roomId, type, isDormSpace = false) => {
        if (isDormSpace) return;
        
        const itemMeta = getItemByType(type);
        const newItem = {
          id: `${type}-${Date.now()}`,
          type,
          label: itemMeta?.label || type,
          icon: itemMeta?.iconChar || '📦',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: itemMeta?.defaultScale || 1,
        };
        
        const currentData = get().getRoomData(roomId);
        
        set((state) => ({ 
          roomLayouts: {
            ...state.roomLayouts,
            [roomId]: {
              ...currentData,
              items: [...currentData.items, newItem]
            }
          },
          selectedId: newItem.id
        }));
      },

      updateItem: (roomId, id, updates) => {
        const currentData = get().getRoomData(roomId);
        set((state) => ({
          roomLayouts: {
            ...state.roomLayouts,
            [roomId]: {
              ...currentData,
              items: currentData.items.map((item) => 
                item.id === id && !item.isLocked ? { ...item, ...updates } : item
              )
            }
          }
        }));
      },

      removeItem: (roomId, id) => {
        const currentData = get().getRoomData(roomId);
        const item = currentData.items.find(i => i.id === id);
        if (item?.isLocked) return;

        set((state) => ({
          roomLayouts: {
            ...state.roomLayouts,
            [roomId]: {
              ...currentData,
              items: currentData.items.filter((item) => item.id !== id)
            }
          },
          selectedId: state.selectedId === id ? null : state.selectedId
        }));
      },

      setSelectedId: (id) => set({ selectedId: id }),

      updateRoomConfig: (roomId, config) => {
        const currentData = get().getRoomData(roomId);
        set((state) => ({
          roomLayouts: {
            ...state.roomLayouts,
            [roomId]: {
              ...currentData,
              roomConfig: { ...currentData.roomConfig, ...config }
            }
          }
        }));
      },

      resetRoom: (roomId, initialItems = []) => set((state) => ({
        roomLayouts: {
          ...state.roomLayouts,
          [roomId]: {
            items: initialItems,
            roomConfig: {
              wallColor: '#ffffff',
              floorColor: '#e5e7eb',
              roughness: 0.8,
              scale: 1,
              lighting: 'neutral',
              floorTexture: 'plain',
              wallTexture: 'plain',
            }

          }
        },
        selectedId: initialItems[0]?.id || null
      }))
    }),

    {
      name: 'room-decor-v2-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

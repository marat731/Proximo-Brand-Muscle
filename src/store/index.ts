import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  Brand,
  Template,
  CustomizedAsset,
  TemplateElement,
  SKU,
  Market,
  Notification,
  LibraryAsset,
} from '@/types';
import { sampleBrands, sampleTemplates, sampleSKUs, sampleMarkets, sampleAssets } from '@/data/sample-data';

interface AppState {
  // User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Brands
  brands: Brand[];
  selectedBrand: Brand | null;
  setSelectedBrand: (brand: Brand | null) => void;

  // Templates
  templates: Template[];
  addTemplate: (template: Template) => void;
  updateTemplate: (template: Template) => void;

  // Current Editor State
  currentTemplate: Template | null;
  setCurrentTemplate: (template: Template | null) => void;
  currentAsset: CustomizedAsset | null;
  setCurrentAsset: (asset: CustomizedAsset | null) => void;
  selectedElement: TemplateElement | null;
  setSelectedElement: (element: TemplateElement | null) => void;
  updateElement: (elementId: string, updates: Partial<TemplateElement>) => void;

  // Customized Assets
  customizedAssets: CustomizedAsset[];
  addCustomizedAsset: (asset: CustomizedAsset) => void;
  updateCustomizedAsset: (asset: CustomizedAsset) => void;

  // Asset Library
  skus: SKU[];
  logos: LibraryAsset[];
  backgrounds: LibraryAsset[];
  badges: LibraryAsset[];

  // Markets
  markets: Market[];
  selectedMarket: Market | null;
  setSelectedMarket: (market: Market | null) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  assetLibraryOpen: boolean;
  setAssetLibraryOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      currentUser: {
        id: 'user-1',
        name: 'Sarah Martinez',
        email: 'sarah.martinez@proximo.com',
        role: 'field_team',
        assignedBrands: ['jose-cuervo', '1800-tequila', 'kraken'],
        assignedMarkets: ['southwest', 'west-coast'],
      },
      setCurrentUser: (user) => set({ currentUser: user }),

      // Brands
      brands: sampleBrands,
      selectedBrand: null,
      setSelectedBrand: (brand) => set({ selectedBrand: brand }),

      // Templates
      templates: sampleTemplates,
      addTemplate: (template) =>
        set((state) => ({ templates: [...state.templates, template] })),
      updateTemplate: (template) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === template.id ? template : t
          ),
        })),

      // Current Editor State
      currentTemplate: null,
      setCurrentTemplate: (template) => set({ currentTemplate: template }),
      currentAsset: null,
      setCurrentAsset: (asset) => set({ currentAsset: asset }),
      selectedElement: null,
      setSelectedElement: (element) => set({ selectedElement: element }),
      updateElement: (elementId, updates) =>
        set((state) => {
          if (!state.currentAsset) return state;
          const updatedElements = state.currentAsset.elements.map((el) =>
            el.id === elementId ? { ...el, ...updates } : el
          );
          return {
            currentAsset: {
              ...state.currentAsset,
              elements: updatedElements,
              updatedAt: new Date().toISOString(),
            },
            selectedElement:
              state.selectedElement?.id === elementId
                ? { ...state.selectedElement, ...updates }
                : state.selectedElement,
          };
        }),

      // Customized Assets
      customizedAssets: [],
      addCustomizedAsset: (asset) =>
        set((state) => ({ customizedAssets: [...state.customizedAssets, asset] })),
      updateCustomizedAsset: (asset) =>
        set((state) => ({
          customizedAssets: state.customizedAssets.map((a) =>
            a.id === asset.id ? asset : a
          ),
        })),

      // Asset Library
      skus: sampleSKUs,
      logos: sampleAssets.logos,
      backgrounds: sampleAssets.backgrounds,
      badges: sampleAssets.badges,

      // Markets
      markets: sampleMarkets,
      selectedMarket: null,
      setSelectedMarket: (market) => set({ selectedMarket: market }),

      // Notifications
      notifications: [
        {
          id: 'notif-1',
          userId: 'user-1',
          type: 'approved',
          title: 'Asset Approved',
          message: 'Your Jose Cuervo shelf talker for Walmart has been approved.',
          assetId: 'asset-1',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      assetLibraryOpen: false,
      setAssetLibraryOpen: (open) => set({ assetLibraryOpen: open }),
    }),
    {
      name: 'proximo-brand-muscle-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        customizedAssets: state.customizedAssets,
      }),
    }
  )
);

"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Property, PropertyAlert, Message, Conversation, Notification, SearchCriteria } from "./types"

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  clearUser: () => void

  // Properties state
  properties: Property[]
  setProperties: (properties: Property[]) => void
  addProperty: (property: Property) => void
  updateProperty: (id: string, updates: Partial<Property>) => void
  deleteProperty: (id: string) => void

  // Search state
  searchCriteria: SearchCriteria
  setSearchCriteria: (criteria: SearchCriteria) => void
  searchResults: Property[]
  setSearchResults: (results: Property[]) => void

  // Saved properties
  savedProperties: string[]
  toggleSavedProperty: (propertyId: string) => void
  setSavedProperties: (properties: string[]) => void

  // Property alerts
  propertyAlerts: PropertyAlert[]
  addPropertyAlert: (alert: PropertyAlert) => void
  updatePropertyAlert: (id: string, updates: Partial<PropertyAlert>) => void
  deletePropertyAlert: (id: string) => void

  // Messages
  conversations: Conversation[]
  messages: { [conversationId: string]: Message[] }
  addMessage: (message: Message) => void
  markAsRead: (conversationId: string) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  clearAllNotifications: () => void

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentView: string
  setCurrentView: (view: string) => void

  // Loading states
  loading: {
    properties: boolean
    search: boolean
    user: boolean
  }
  setLoading: (key: keyof AppState["loading"], value: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      clearUser: () => set({ user: null, savedProperties: [], propertyAlerts: [], notifications: [] }),

      // Properties state
      properties: [],
      setProperties: (properties) => set({ properties }),
      addProperty: (property) =>
        set((state) => ({
          properties: [...state.properties, property],
        })),
      updateProperty: (id, updates) =>
        set((state) => ({
          properties: state.properties.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deleteProperty: (id) =>
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
        })),

      // Search state
      searchCriteria: {},
      setSearchCriteria: (criteria) => set({ searchCriteria: criteria }),
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),

      // Saved properties
      savedProperties: [],
      toggleSavedProperty: (propertyId) =>
        set((state) => ({
          savedProperties: state.savedProperties.includes(propertyId)
            ? state.savedProperties.filter((id) => id !== propertyId)
            : [...state.savedProperties, propertyId],
        })),
      setSavedProperties: (properties) => set({ savedProperties: properties }),

      // Property alerts
      propertyAlerts: [],
      addPropertyAlert: (alert) =>
        set((state) => ({
          propertyAlerts: [...state.propertyAlerts, alert],
        })),
      updatePropertyAlert: (id, updates) =>
        set((state) => ({
          propertyAlerts: state.propertyAlerts.map((alert) => (alert.id === id ? { ...alert, ...updates } : alert)),
        })),
      deletePropertyAlert: (id) =>
        set((state) => ({
          propertyAlerts: state.propertyAlerts.filter((alert) => alert.id !== id),
        })),

      // Messages
      conversations: [],
      messages: {},
      addMessage: (message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [message.conversationId]: [...(state.messages[message.conversationId] || []), message],
          },
        })),
      markAsRead: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
          ),
        })),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
        })),
      clearAllNotifications: () => set({ notifications: [] }),

      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      currentView: "overview",
      setCurrentView: (view) => set({ currentView: view }),

      // Loading states
      loading: {
        properties: false,
        search: false,
        user: false,
      },
      setLoading: (key, value) =>
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        })),
    }),
    {
      name: "nyumba-store",
      partialize: (state) => ({
        user: state.user,
        savedProperties: state.savedProperties,
        propertyAlerts: state.propertyAlerts,
        searchCriteria: state.searchCriteria,
      }),
    },
  ),
)

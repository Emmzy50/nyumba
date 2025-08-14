import type { User, Property, PropertyAlert, Message } from "./types"
import { signIn as firebaseSignIn, signUp as firebaseSignUp, convertFirebaseUser } from "./firebase/auth"
import { auth } from "./firebase/config"
import { onAuthStateChanged } from "firebase/auth"
import {
  getProperties as getFirestoreProperties,
  getPropertyById,
  deleteProperty as deleteFirestoreProperty,
} from "./firebase/firestore"

// Mock API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const signIn = async (email: string, password: string): Promise<User> => {
  const result = await firebaseSignIn(email, password)

  if (result.error) {
    throw new Error(result.error)
  }

  if (!result.user) {
    throw new Error("Authentication failed")
  }

  return result.user
}

export const signUp = async (userData: Partial<User>): Promise<User> => {
  const result = await firebaseSignUp(
    userData.email!,
    userData.password || "",
    userData.name || "",
    userData.role || "tenant",
  )

  if (result.error) {
    throw new Error(result.error)
  }

  if (!result.user) {
    throw new Error("Sign up failed")
  }

  return result.user
}

export const getProperties = async (filters?: any): Promise<Property[]> => {
  try {
    const firestoreProperties = await getFirestoreProperties()

    // Combine with mock properties for now to ensure some data is always available
    const mockPropertiesData: Property[] = mockProperties

    // Combine Firestore properties with mock properties
    let allProperties = [...firestoreProperties, ...mockPropertiesData]

    // Apply filters if provided
    if (filters) {
      if (filters.propertyType && filters.propertyType !== "all") {
        allProperties = allProperties.filter((p) => p.propertyType === filters.propertyType)
      }
      if (filters.minPrice) {
        allProperties = allProperties.filter((p) => p.price >= filters.minPrice)
      }
      if (filters.maxPrice) {
        allProperties = allProperties.filter((p) => p.price <= filters.maxPrice)
      }
      if (filters.bedrooms) {
        allProperties = allProperties.filter((p) => p.bedrooms >= filters.bedrooms)
      }
      if (filters.location) {
        allProperties = allProperties.filter((p) => p.location.toLowerCase().includes(filters.location.toLowerCase()))
      }
    }

    return allProperties
  } catch (error) {
    console.error("Error fetching properties:", error)
    // Fallback to mock data if Firestore fails
    return mockProperties
  }
}

export const getProperty = async (id: string): Promise<Property | null> => {
  try {
    const firestoreProperty = await getPropertyById(id)
    if (firestoreProperty) {
      return firestoreProperty
    }

    // Fallback to mock properties
    const properties = await getProperties()
    return properties.find((p) => p.id === id) || null
  } catch (error) {
    console.error("Error fetching property:", error)
    return null
  }
}

export const deleteProperty = async (propertyId: string): Promise<void> => {
  try {
    await deleteFirestoreProperty(propertyId)
    console.log(`Property ${propertyId} deleted successfully`)
  } catch (error) {
    console.error("Error deleting property:", error)
    throw new Error("Failed to delete property")
  }
}

export const getSavedProperties = async (userId: string): Promise<Property[]> => {
  await delay(400)

  // Mock saved properties for now
  const allProperties = await getProperties()
  return allProperties.slice(0, 1) // Return first property as saved for demo
}

export const toggleSavedProperty = async (userId: string, propertyId: string): Promise<boolean> => {
  await delay(300)

  // Mock implementation - in real app, use Firebase Firestore
  console.log(`Toggling saved property ${propertyId} for user ${userId}`)
  return Math.random() > 0.5 // Random true/false for demo
}

export const getPropertyAlerts = async (userId: string): Promise<PropertyAlert[]> => {
  await delay(300)

  // Mock alerts
  return [
    {
      id: "1",
      userId,
      name: "Downtown Apartments Under ZMW 3000",
      criteria: {
        location: "Lusaka",
        priceRange: [0, 3000],
        propertyTypes: ["apartment"],
      },
      frequency: "daily",
      active: true,
      createdAt: new Date().toISOString().split("T")[0],
      matchCount: 5,
    },
  ]
}

export const createPropertyAlert = async (alertData: Partial<PropertyAlert>): Promise<PropertyAlert> => {
  await delay(400)

  const newAlert: PropertyAlert = {
    id: Date.now().toString(),
    userId: alertData.userId!,
    name: alertData.name!,
    criteria: alertData.criteria || {},
    frequency: alertData.frequency || "daily",
    active: true,
    createdAt: new Date().toISOString().split("T")[0],
    matchCount: 0,
  }

  return newAlert
}

export const getMessages = async (userId: string): Promise<Message[]> => {
  await delay(300)

  // Mock messages
  return [
    {
      id: "1",
      conversationId: "conv-1",
      senderId: "landlord-1",
      receiverId: userId,
      content: "Hi! I'm interested in viewing the apartment. When would be a good time?",
      timestamp: new Date().toISOString(),
      read: false,
      type: "text",
    },
  ]
}

export const sendMessage = async (messageData: Partial<Message>): Promise<Message> => {
  await delay(400)

  const newMessage: Message = {
    id: Date.now().toString(),
    conversationId: messageData.conversationId || "",
    senderId: messageData.senderId!,
    receiverId: messageData.receiverId!,
    content: messageData.content!,
    timestamp: new Date().toISOString(),
    read: false,
    type: "text",
  }

  return newMessage
}

export const trackPropertyView = async (propertyId: string, userId?: string): Promise<void> => {
  try {
    await delay(200)

    // In a real implementation, this would save to Firebase Analytics or Firestore
    console.log(`Tracking property view: ${propertyId} by user: ${userId || "anonymous"}`)

    // Mock implementation - in real app, save to Firestore analytics collection
    const viewData = {
      propertyId,
      userId: userId || null,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : null,
    }

    // TODO: Implement actual Firebase Analytics or Firestore tracking
    // await addDoc(collection(db, 'property_views'), viewData)
  } catch (error) {
    console.error("Error tracking property view:", error)
    // Don't throw error to avoid disrupting user experience
  }
}

export const trackPropertySave = async (propertyId: string, userId?: string): Promise<void> => {
  try {
    await delay(200)
    console.log(`Tracking property save: ${propertyId} by user: ${userId || "anonymous"}`)
  } catch (error) {
    console.error("Error tracking property save:", error)
  }
}

export const trackPropertyInquiry = async (propertyId: string, userId?: string): Promise<void> => {
  try {
    await delay(200)
    console.log(`Tracking property inquiry: ${propertyId} by user: ${userId || "anonymous"}`)
  } catch (error) {
    console.error("Error tracking property inquiry:", error)
  }
}

export const getFeaturedProperties = async (): Promise<Property[]> => {
  try {
    const allProperties = await getProperties()

    // Return the first 3 properties as featured, or all if less than 3
    return allProperties.slice(0, 3)
  } catch (error) {
    console.error("Error fetching featured properties:", error)
    return []
  }
}

export const searchProperties = async (query: string): Promise<Property[]> => {
  try {
    const allProperties = await getProperties()
    const searchTerm = query.toLowerCase()

    return allProperties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.amenities?.some((amenity) => amenity.toLowerCase().includes(searchTerm)),
    )
  } catch (error) {
    console.error("Error searching properties:", error)
    return []
  }
}

export const filterProperties = async (criteria: any): Promise<Property[]> => {
  try {
    const allProperties = await getProperties()
    let filtered = allProperties

    if (criteria.priceRange) {
      const [min, max] = criteria.priceRange
      if (max === null) {
        // Handle "Above" price ranges
        filtered = filtered.filter((p) => p.price >= min)
      } else {
        filtered = filtered.filter((p) => p.price >= min && p.price <= max)
      }
    }

    if (criteria.propertyType) {
      filtered = filtered.filter((p) => p.propertyType === criteria.propertyType)
    }

    if (criteria.bedrooms) {
      const bedroomCount = criteria.bedrooms === "0" ? 0 : Number.parseInt(criteria.bedrooms)
      if (criteria.bedrooms === "4") {
        // Handle "4+ Bedrooms"
        filtered = filtered.filter((p) => p.bedrooms >= 4)
      } else {
        filtered = filtered.filter((p) => p.bedrooms === bedroomCount)
      }
    }

    return filtered
  } catch (error) {
    console.error("Error filtering properties:", error)
    return []
  }
}

export const api = {
  signIn,
  signUp,
  getProperties,
  getFeaturedProperties,
  searchProperties,
  filterProperties,
  getProperty,
  deleteProperty,
  getSavedProperties,
  toggleSavedProperty,
  getPropertyAlerts,
  createPropertyAlert,
  getMessages,
  sendMessage,
  trackPropertyView,
  trackPropertySave,
  trackPropertyInquiry,
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await convertFirebaseUser(firebaseUser)
      callback(user)
    } else {
      callback(null)
    }
  })
}

// Export mock data for components that need it
export const mockProperties = [
  {
    id: "mock-1",
    title: "Modern Downtown Apartment",
    price: 2500,
    location: "Lusaka, Zambia",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ["/modern-apartment-living-room.png", "/modern-apartment-bedroom.png"],
    amenities: ["Gym", "Pool", "Parking", "WiFi"],
    description: "Beautiful modern apartment in the heart of downtown with stunning city views.",
    landlord: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+260 700 123 456",
      avatar: "/diverse-female-avatar.png",
    },
    virtualTour: "/panoramic-living-room.png",
    availableFrom: "2024-02-01",
    coordinates: { lat: -15.3875, lng: 28.3228 },
  },
  {
    id: "mock-2",
    title: "Cozy Family House",
    price: 3200,
    location: "Ndola, Zambia",
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: ["/modern-apartment-kitchen.png", "/360-bedroom-view.png"],
    amenities: ["Garden", "Garage", "Security"],
    description: "Perfect family home with a beautiful garden and quiet neighborhood setting.",
    landlord: {
      name: "Mike Chen",
      email: "mike@example.com",
      phone: "+260 701 234 567",
      avatar: "/male-avatar.png",
    },
    availableFrom: "2024-02-15",
    coordinates: { lat: -12.9584, lng: 28.6369 },
  },
  {
    id: "mock-3",
    title: "Student Boarding House",
    price: 800,
    location: "Kitwe, Zambia",
    propertyType: "boarding-house",
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    images: ["/modern-apartment-bedroom.png", "/modern-apartment-living-room.png"],
    amenities: ["WiFi", "Shared Kitchen", "Study Area", "Security"],
    description: "Affordable boarding house perfect for students with shared facilities and study areas.",
    landlord: {
      name: "Grace Mwanza",
      email: "grace@example.com",
      phone: "+260 702 345 678",
      avatar: "/diverse-female-avatar.png",
    },
    availableFrom: "2024-01-15",
    coordinates: { lat: -12.8024, lng: 28.2132 },
  },
  {
    id: "mock-4",
    title: "Modern Studio Apartment",
    price: 1500,
    location: "Lusaka, Zambia",
    propertyType: "studio",
    bedrooms: 0,
    bathrooms: 1,
    area: 600,
    images: ["/modern-apartment-kitchen.png", "/360-bedroom-view.png"],
    amenities: ["WiFi", "Parking", "Gym", "Pool"],
    description: "Compact and modern studio apartment with all amenities included.",
    landlord: {
      name: "David Banda",
      email: "david@example.com",
      phone: "+260 703 456 789",
      avatar: "/male-avatar.png",
    },
    availableFrom: "2024-02-10",
    coordinates: { lat: -15.4067, lng: 28.2871 },
  },
  {
    id: "mock-5",
    title: "Executive Townhouse",
    price: 4500,
    location: "Lusaka, Zambia",
    propertyType: "townhouse",
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    images: ["/modern-apartment-living-room.png", "/modern-apartment-kitchen.png"],
    amenities: ["Garden", "Garage", "Security", "Pool", "Gym"],
    description: "Luxurious townhouse in a gated community with premium amenities.",
    landlord: {
      name: "Patricia Zulu",
      email: "patricia@example.com",
      phone: "+260 704 567 890",
      avatar: "/diverse-female-avatar.png",
    },
    availableFrom: "2024-03-01",
    coordinates: { lat: -15.3947, lng: 28.3119 },
  },
]

export const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "tenant" as const,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "landlord" as const,
  },
]

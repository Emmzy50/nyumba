// Mock property data and store functionality
export interface Property {
  id: string
  title: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  propertyType: string
  description: string
  images: string[]
  amenities: string[]
  available: boolean
  landlord: {
    name: string
    avatar?: string
    phone: string
    email: string
    rating: number
    properties: number
    responseTime: string
  }
  rating: number
  reviews: number
  datePosted: string
  featured?: boolean
  squareFootage: number
  leaseTerms: string
  petPolicy: string
  parkingSpaces: number
  utilities: string
  neighborhood: string
  nearbyTransport: string[]
  schoolDistrict: string
  walkScore: number
  analytics?: {
    views: number
    inquiries: number
    saves: number
    applications: number
    trending: boolean
    performanceScore: number
  }
}

// Mock properties data
const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    location: "123 Main St, Lusaka, Zambia",
    price: 4500,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "apartment",
    description: "Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities.",
    images: [
      "/placeholder.svg?height=400&width=600&text=Modern+Apartment+1",
      "/placeholder.svg?height=400&width=600&text=Modern+Apartment+2",
      "/placeholder.svg?height=400&width=600&text=Modern+Apartment+3",
    ],
    amenities: ["Gym", "Pool", "Parking", "Pet Friendly", "WiFi", "AC"],
    available: true,
    landlord: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      phone: "+265 999 123 456",
      email: "sarah.johnson@example.com",
      rating: 4.8,
      properties: 5,
      responseTime: "Usually responds within 2 hours",
    },
    rating: 4.8,
    reviews: 24,
    datePosted: "2024-01-15",
    featured: true,
    squareFootage: 1200,
    leaseTerms: "12 months minimum",
    petPolicy: "Cats and small dogs allowed with deposit",
    parkingSpaces: 1,
    utilities: "Water and electricity included",
    neighborhood: "City Centre",
    nearbyTransport: ["Bus stop: 2 blocks", "Taxi rank: 1 block"],
    schoolDistrict: "Lilongwe Central",
    walkScore: 85,
    analytics: {
      views: 156,
      inquiries: 23,
      saves: 45,
      applications: 8,
      trending: true,
      performanceScore: 92,
    },
  },
  {
    id: "2",
    title: "Cozy Family House",
    location: "456 Oak Street, Ndola, Zambia",
    price: 3200,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "house",
    description: "Perfect family home with a beautiful garden and quiet neighborhood setting.",
    images: [
      "/placeholder.svg?height=400&width=600&text=Family+House+1",
      "/placeholder.svg?height=400&width=600&text=Family+House+2",
    ],
    amenities: ["Backyard", "Garage", "Dishwasher", "Fireplace"],
    available: true,
    landlord: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=MC",
      phone: "+265 991 234 567",
      email: "mike.chen@example.com",
      rating: 4.5,
      properties: 3,
      responseTime: "Usually responds within 4 hours",
    },
    rating: 4.5,
    reviews: 18,
    datePosted: "2024-01-12",
    squareFootage: 1800,
    leaseTerms: "6 months minimum",
    petPolicy: "No pets allowed",
    parkingSpaces: 2,
    utilities: "Tenant pays all utilities",
    neighborhood: "Limbe",
    nearbyTransport: ["Bus route: 5 minutes walk"],
    schoolDistrict: "Blantyre South",
    walkScore: 65,
    analytics: {
      views: 89,
      inquiries: 12,
      saves: 28,
      applications: 4,
      trending: false,
      performanceScore: 78,
    },
  },
  {
    id: "3",
    title: "Luxury Condo with Pool",
    location: "789 Beach Road, Livingstone, Zambia",
    price: 6800,
    bedrooms: 3,
    bathrooms: 2.5,
    propertyType: "condo",
    description: "Luxury lakefront condo with stunning lake views and resort-style amenities.",
    images: [
      "/placeholder.svg?height=400&width=600&text=Luxury+Condo+1",
      "/placeholder.svg?height=400&width=600&text=Luxury+Condo+2",
      "/placeholder.svg?height=400&width=600&text=Luxury+Condo+3",
      "/placeholder.svg?height=400&width=600&text=Luxury+Condo+4",
    ],
    amenities: ["Pool", "Lake Access", "Concierge", "Gym", "High Ceilings"],
    available: true,
    landlord: {
      name: "Jennifer Davis",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
      phone: "+265 995 876 543",
      email: "jennifer.davis@example.com",
      rating: 4.9,
      properties: 2,
      responseTime: "Usually responds within 1 hour",
    },
    rating: 4.9,
    reviews: 31,
    datePosted: "2024-01-10",
    featured: true,
    squareFootage: 2200,
    leaseTerms: "12 months minimum",
    petPolicy: "No pets allowed",
    parkingSpaces: 2,
    utilities: "All utilities included",
    neighborhood: "Lakeshore",
    nearbyTransport: ["Private boat dock", "Airport shuttle: 30 minutes"],
    schoolDistrict: "Mangochi District",
    walkScore: 45,
    analytics: {
      views: 234,
      inquiries: 45,
      saves: 67,
      applications: 15,
      trending: true,
      performanceScore: 95,
    },
  },
]

// Store functions
export function getAllProperties(): Property[] {
  return mockProperties
}

export function getFeaturedProperties(): Property[] {
  return mockProperties.filter((p) => p.featured)
}

export function getPropertyById(id: string): Property | null {
  return mockProperties.find((p) => p.id === id) || null
}

export function getPropertiesByLandlord(landlordEmail: string): Property[] {
  return mockProperties.filter((p) => p.landlord.email === landlordEmail)
}

export function searchProperties(query: string): Property[] {
  const searchTerm = query.toLowerCase()
  return mockProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm) ||
      property.location.toLowerCase().includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm) ||
      property.neighborhood.toLowerCase().includes(searchTerm) ||
      property.amenities.some((amenity) => amenity.toLowerCase().includes(searchTerm)),
  )
}

export function addProperty(propertyData: Partial<Property>): Property {
  const newProperty: Property = {
    id: Date.now().toString(),
    title: propertyData.title || "",
    location: propertyData.location || "",
    price: propertyData.price || 0,
    bedrooms: propertyData.bedrooms || 0,
    bathrooms: propertyData.bathrooms || 0,
    propertyType: propertyData.propertyType || "apartment",
    description: propertyData.description || "",
    images: propertyData.images || [],
    amenities: propertyData.amenities || [],
    available: propertyData.available ?? true,
    landlord: propertyData.landlord || {
      name: "Unknown",
      phone: "",
      email: "",
      rating: 0,
      properties: 0,
      responseTime: "Unknown",
    },
    rating: 0,
    reviews: 0,
    datePosted: new Date().toISOString(),
    squareFootage: propertyData.squareFootage || 1000,
    leaseTerms: propertyData.leaseTerms || "12 months minimum",
    petPolicy: propertyData.petPolicy || "No pets allowed",
    parkingSpaces: propertyData.parkingSpaces || 0,
    utilities: propertyData.utilities || "Tenant pays all utilities",
    neighborhood: propertyData.neighborhood || "Unknown",
    nearbyTransport: propertyData.nearbyTransport || [],
    schoolDistrict: propertyData.schoolDistrict || "Unknown",
    walkScore: propertyData.walkScore || 50,
    analytics: {
      views: 0,
      inquiries: 0,
      saves: 0,
      applications: 0,
      trending: false,
      performanceScore: 0,
    },
  }

  mockProperties.push(newProperty)
  return newProperty
}

export function deleteProperty(id: string): boolean {
  const index = mockProperties.findIndex((p) => p.id === id)
  if (index > -1) {
    mockProperties.splice(index, 1)
    return true
  }
  return false
}

export function trackPropertyView(propertyId: string, viewData: any): void {
  const property = mockProperties.find((p) => p.id === propertyId)
  if (property && property.analytics) {
    property.analytics.views += 1
  }
}

export function trackPropertySave(propertyId: string, saveData: any): void {
  const property = mockProperties.find((p) => p.id === propertyId)
  if (property && property.analytics) {
    property.analytics.saves += 1
  }
}

export function formatKwacha(amount: number): string {
  return `ZMW ${amount.toLocaleString()}`
}

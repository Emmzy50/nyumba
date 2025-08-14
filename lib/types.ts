export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "landlord" | "tenant"
  joinDate: string
  phone: string
  bio: string
  verified: boolean
  emailVerified?: boolean
  phoneVerified?: boolean
  preferences?: UserPreferences
  savedProperties?: string[]
  applications?: PropertyApplication[]
}

export interface UserPreferences {
  priceRange: [number, number]
  propertyTypes: string[]
  locations: string[]
  amenities: string[]
  bedrooms: number[]
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    frequency: "instant" | "daily" | "weekly"
  }
}

export interface Property {
  id: string
  title: string
  description: string
  location: string
  coordinates?: { lat: number; lng: number }
  price: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  propertyType: string
  images: string[]
  virtualTour?: VirtualTour
  amenities: string[]
  utilities: string[]
  furnished: boolean
  petPolicy: string
  parkingSpaces: number
  available: boolean
  availableFrom: string
  leaseTerms: string
  securityDeposit: number
  landlord: Landlord
  neighborhood: NeighborhoodInfo
  features: PropertyFeatures
  analytics: PropertyAnalytics
  reviews: PropertyReview[]
  rating: number
  datePosted: string
  lastUpdated: string
  featured: boolean
  verified: boolean
  status: "active" | "rented" | "pending" | "inactive"
}

export interface VirtualTour {
  enabled: boolean
  views: TourView[]
  provider: string
}

export interface TourView {
  id: string
  name: string
  image: string
  panorama?: string
  hotspots?: Hotspot[]
}

export interface Hotspot {
  x: number
  y: number
  targetView: string
  label: string
}

export interface Landlord {
  id: string
  name: string
  avatar?: string
  phone: string
  email: string
  rating: number
  totalProperties: number
  responseTime: string
  verified: boolean
  joinDate: string
  languages: string[]
}

export interface NeighborhoodInfo {
  name: string
  walkScore: number
  transitScore: number
  bikeScore: number
  crimeRate: "low" | "medium" | "high"
  averageRent: number
  priceChange: string
  demographics: {
    averageAge: number
    families: number
    professionals: number
  }
  amenities: {
    restaurants: number
    schools: number
    hospitals: number
    shopping: number
    parks: number
  }
  transportation: TransportOption[]
}

export interface TransportOption {
  type: string
  name: string
  distance: string
  walkTime: number
}

export interface PropertyFeatures {
  heating: string
  cooling: string
  flooring: string[]
  appliances: string[]
  internetSpeed: string
  energyRating: string
  buildingAge: number
  floorLevel?: number
  totalFloors?: number
  orientation: string
  view: string[]
  accessibility: string[]
}

export interface PropertyAnalytics {
  views: number
  inquiries: number
  saves: number
  applications: number
  trending: boolean
  performanceScore: number
  viewsHistory: ViewHistory[]
  conversionRate: number
}

export interface ViewHistory {
  date: string
  views: number
  inquiries: number
}

export interface PropertyReview {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful: number
}

export interface PropertyApplication {
  id: string
  propertyId: string
  tenantId: string
  landlordId: string
  status: "pending" | "approved" | "rejected" | "withdrawn"
  submittedAt: string
  documents: ApplicationDocument[]
  personalInfo: PersonalInfo
  employmentInfo: EmploymentInfo
  references: Reference[]
  message?: string
}

export interface ApplicationDocument {
  id: string
  type: "id" | "payslip" | "bank_statement" | "reference" | "other"
  name: string
  url: string
  verified: boolean
}

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  maritalStatus: string
  dependents: number
}

export interface EmploymentInfo {
  employer: string
  position: string
  monthlyIncome: number
  employmentType: "permanent" | "contract" | "self_employed" | "unemployed"
  startDate: string
}

export interface Reference {
  name: string
  relationship: string
  phone: string
  email: string
}

export interface PropertyAlert {
  id: string
  userId: string
  name: string
  criteria: SearchCriteria
  frequency: "instant" | "daily" | "weekly"
  active: boolean
  createdAt: string
  lastTriggered?: string
  matchCount: number
}

export interface SearchCriteria {
  location?: string
  priceRange?: [number, number]
  propertyTypes?: string[]
  bedrooms?: number[]
  bathrooms?: number[]
  amenities?: string[]
  furnished?: boolean
  petFriendly?: boolean
  availableFrom?: string
  keywords?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
  type: "text" | "image" | "document" | "property_share"
  metadata?: any
}

export interface Conversation {
  id: string
  participants: string[]
  propertyId?: string
  lastMessage?: Message
  lastActivity: string
  unreadCount: number
}

export interface Notification {
  id: string
  userId: string
  type: "property_match" | "price_change" | "message" | "application_update" | "system"
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: string
}

export interface MarketInsight {
  location: string
  averagePrice: number
  priceChange: number
  totalListings: number
  averageDaysOnMarket: number
  mostPopularType: string
  trends: PriceTrend[]
}

export interface PriceTrend {
  month: string
  averagePrice: number
  listings: number
}

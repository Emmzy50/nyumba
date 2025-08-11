"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  Search,
  Heart,
  Settings,
  LogOut,
  Plus,
  Eye,
  MessageSquare,
  TrendingUp,
  Users,
  Building,
  DollarSign,
  Menu,
  X,
  Upload,
  MapPin,
  FileText,
  Camera,
  Edit,
  Trash2,
  Bed,
  Bath,
  Star,
  Phone,
  User,
  Save,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PropertyBrowse from "./property-browse"
import { addProperty, getPropertiesByLandlord, deleteProperty, type Property } from "./lib/property-store"
import AnalyticsDashboard from "./analytics-dashboard"
import { LogoutDialog } from "./components/logout-dialog"
import { getCurrentUser, setCurrentUser, initializeMockUser, updateUserProfile, type User } from "./lib/auth-utils"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState<User | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // Initialize user on component mount
  useEffect(() => {
    const currentUser = getCurrentUser() || initializeMockUser()
    setUser(currentUser)
  }, [])

  const handleRoleSwitch = () => {
    if (!user) return

    const newRole = user.role === "tenant" ? "landlord" : "tenant"
    const updatedUser = { ...user, role: newRole }

    setUser(updatedUser)
    setCurrentUser(updatedUser)

    // Reset to overview when switching roles
    setActiveTab("overview")
  }

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  // Don't render until user is loaded
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const sidebarItems =
    user.role === "landlord"
      ? [
          { id: "overview", label: "Overview", icon: Home },
          { id: "properties", label: "My Properties", icon: Building },
          { id: "add-property", label: "Add Property", icon: Plus },
          { id: "messages", label: "Messages", icon: MessageSquare },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
          { id: "profile", label: "Profile & Contact", icon: User },
          { id: "settings", label: "Settings", icon: Settings },
        ]
      : [
          { id: "overview", label: "Overview", icon: Home },
          { id: "browse-properties", label: "Browse Properties", icon: Search },
          { id: "favorites", label: "Saved Properties", icon: Heart },
          { id: "applications", label: "My Applications", icon: Eye },
          { id: "messages", label: "Messages", icon: MessageSquare },
          { id: "profile", label: "Profile", icon: User },
          { id: "settings", label: "Settings", icon: Settings },
        ]

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent user={user} setActiveTab={setActiveTab} />
      case "search":
        return <SearchContent />
      case "properties":
        return <PropertiesContent user={user} />
      case "add-property":
        return <AddPropertyContent user={user} setActiveTab={setActiveTab} />
      case "favorites":
        return <FavoritesContent />
      case "applications":
        return <ApplicationsContent />
      case "messages":
        return <MessagesContent />
      case "analytics":
        return <AnalyticsContent user={user} />
      case "profile":
        return <ProfileContent user={user} setUser={setUser} />
      case "settings":
        return <SettingsContent user={user} />
      case "browse-properties":
        return <PropertyBrowse />
      default:
        return <OverviewContent user={user} setActiveTab={setActiveTab} />
    }
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col bg-white shadow-sm border-r">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">RealEstate</h1>
          </div>

          <div className="px-6 pb-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <Badge variant={user.role === "landlord" ? "default" : "secondary"} className="text-xs">
                  {user.role === "landlord" ? "Landlord" : "Tenant"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="px-6 pb-4">
            <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleRoleSwitch}>
              Switch to {user.role === "tenant" ? "Landlord" : "Tenant"}
            </Button>
          </div>

          <Separator />

          <nav className="mt-4 px-4 flex-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogoutClick}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">RealEstate</h1>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)} className="p-1">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-6 py-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <Badge variant={user.role === "landlord" ? "default" : "secondary"} className="text-xs">
                  {user.role === "landlord" ? "Landlord" : "Tenant"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="px-6 pb-4">
            <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleRoleSwitch}>
              Switch to {user.role === "tenant" ? "Landlord" : "Tenant"}
            </Button>
          </div>

          <nav className="mt-4 px-4 flex-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogoutClick}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)} className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">RealEstate</h1>
            <Button variant="ghost" size="sm" onClick={handleLogoutClick} className="p-2">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-8">{renderContent()}</div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} />
    </>
  )
}

function OverviewContent({ user, setActiveTab }: { user: User; setActiveTab: (tab: string) => void }) {
  const [landlordProperties, setLandlordProperties] = useState<Property[]>([])

  useEffect(() => {
    if (user.role === "landlord") {
      const properties = getPropertiesByLandlord(user.email)
      setLandlordProperties(properties)
    }
  }, [user.email, user.role])

  const stats =
    user.role === "landlord"
      ? [
          {
            label: "Total Properties",
            value: landlordProperties.length.toString(),
            icon: Building,
            color: "text-blue-600",
          },
          {
            label: "Total Views",
            value: landlordProperties.reduce((sum, p) => sum + (p.analytics?.views || 0), 0).toString(),
            icon: Eye,
            color: "text-green-600",
          },
          {
            label: "Total Inquiries",
            value: landlordProperties.reduce((sum, p) => sum + (p.analytics?.inquiries || 0), 0).toString(),
            icon: MessageSquare,
            color: "text-purple-600",
          },
          {
            label: "Avg Performance",
            value:
              landlordProperties.length > 0
                ? Math.round(
                    landlordProperties.reduce((sum, p) => sum + (p.analytics?.performanceScore || 0), 0) /
                      landlordProperties.length,
                  ).toString()
                : "0",
            icon: Star,
            color: "text-orange-600",
          },
        ]
      : [
          { label: "Saved Properties", value: "23", icon: Heart, color: "text-red-600" },
          { label: "Applications Sent", value: "5", icon: Eye, color: "text-blue-600" },
          { label: "Messages", value: "12", icon: MessageSquare, color: "text-green-600" },
          { label: "Profile Views", value: "89", icon: Users, color: "text-purple-600" },
        ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">
          {user.role === "landlord"
            ? "Manage your properties and track your rental business."
            : "Continue your search for the perfect home."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.role === "landlord" ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm">
                      {landlordProperties.reduce((sum, p) => sum + (p.analytics?.inquiries || 0), 0)} total inquiries
                      received
                    </p>
                    <span className="text-xs text-gray-500">This month</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm">
                      {landlordProperties.reduce((sum, p) => sum + (p.analytics?.views || 0), 0)} total property views
                    </p>
                    <span className="text-xs text-gray-500">This month</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm">
                      {landlordProperties.filter((p) => p.analytics?.trending).length} properties trending
                    </p>
                    <span className="text-xs text-gray-500">Right now</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm">Application submitted for Sunset Villa</p>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm">Saved 3 new properties</p>
                    <span className="text-xs text-gray-500">3 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm">Profile viewed by landlord</p>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.role === "landlord" ? (
                <>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("add-property")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Property
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("properties")}
                  >
                    <Building className="mr-2 h-4 w-4" />
                    Manage Properties
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("browse-properties")}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Browse Properties
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("favorites")}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    View Saved Properties
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("applications")}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Check Applications
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PropertiesContent({ user }: { user: User }) {
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    const landlordProperties = getPropertiesByLandlord(user.email)
    setProperties(landlordProperties)
  }, [user.email])

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteProperty(propertyId)
      setProperties((prev) => prev.filter((p) => p.id !== propertyId))
    }
  }

  if (properties.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Properties</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't added any properties yet. Start by creating your first listing!
            </p>
            <Button onClick={() => (window.location.href = "#add-property")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
        <Button onClick={() => (window.location.href = "#add-property")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={property.images[0] || "/placeholder.svg?height=200&width=300&text=Property"}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteProperty(property.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-3 left-3">
                <Badge variant={property.available ? "default" : "secondary"}>
                  {property.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">${property.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="line-clamp-1">{property.location}</span>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Bed className="h-4 w-4 mr-1" />
                  {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bed`}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Bath className="h-4 w-4 mr-1" />
                  {property.bathrooms} bath
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {property.rating || 0} ({property.reviews})
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => (window.location.href = `/property/${property.id}`)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Posted: {new Date(property.datePosted).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AddPropertyContent({ user, setActiveTab }: { user: User; setActiveTab: (tab: string) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    houseNumber: "",
    price: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    squareFootage: "",
    leaseTerms: "",
    petPolicy: "",
    parkingSpaces: "",
    utilities: "",
    neighborhood: "",
    nearbyTransport: "",
    schoolDistrict: "",
    walkScore: "",
    amenities: [] as string[],
    images: [] as File[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const availableAmenities = [
    "Gym",
    "Pool",
    "Parking",
    "Pet Friendly",
    "Concierge",
    "Rooftop Terrace",
    "In-unit Laundry",
    "WiFi",
    "Study Area",
    "Bike Storage",
    "Backyard",
    "Garage",
    "Dishwasher",
    "AC",
    "Fireplace",
    "High Ceilings",
    "Exposed Brick",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const newImages = Array.from(files).filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isUnder5MB = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isImage && isUnder5MB
    })

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 6), // Max 6 images
    }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert images to URLs (in a real app, you'd upload to a file storage service)
      const imageUrls = formData.images.map(
        (image, index) =>
          `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(formData.title)}+${index + 1}`,
      )

      // Create the property data
      const propertyData = {
        title: formData.title,
        location: formData.location,
        price: Number.parseInt(formData.price),
        bedrooms: formData.bedrooms === "studio" ? 0 : Number.parseInt(formData.bedrooms),
        bathrooms: Number.parseFloat(formData.bathrooms),
        propertyType: formData.propertyType,
        description: formData.description,
        images: imageUrls.length > 0 ? imageUrls : ["/placeholder.svg?height=400&width=600&text=Property"],
        amenities: formData.amenities,
        available: true,
        landlord: {
          name: user.name,
          avatar: user.avatar,
          phone: user.phone || "(555) 123-4567",
          email: user.email,
          rating: 4.8,
          properties: 1,
          responseTime: "Usually responds within 2 hours",
        },
        squareFootage: Number.parseInt(formData.squareFootage) || 1000,
        leaseTerms: formData.leaseTerms || "12 months minimum",
        petPolicy: formData.petPolicy || "No pets allowed",
        parkingSpaces: Number.parseInt(formData.parkingSpaces) || 0,
        utilities: formData.utilities || "Tenant pays all utilities",
        neighborhood: formData.neighborhood || "Downtown",
        nearbyTransport: formData.nearbyTransport
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t) || ["Bus: 2 blocks"],
        schoolDistrict: formData.schoolDistrict || "Local School District",
        walkScore: Number.parseInt(formData.walkScore) || 75,
      }

      // Add the property to the store
      const newProperty = addProperty(propertyData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form on success
      setFormData({
        title: "",
        location: "",
        houseNumber: "",
        price: "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        description: "",
        squareFootage: "",
        leaseTerms: "",
        petPolicy: "",
        parkingSpaces: "",
        utilities: "",
        neighborhood: "",
        nearbyTransport: "",
        schoolDistrict: "",
        walkScore: "",
        amenities: [],
        images: [],
      })

      alert(
        `Property "${newProperty.title}" has been successfully listed! It will now appear on the home page for tenants to discover.`,
      )

      // Navigate to properties tab to see the new listing
      setActiveTab("properties")
    } catch (error) {
      console.error("Error submitting property:", error)
      alert("Failed to list property. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600 mt-2">Create a new property listing that will appear on the tenant home page</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Essential details about your property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Modern 2BR Apartment Downtown"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Select
                  value={formData.bedrooms}
                  onValueChange={(value) => handleInputChange("bedrooms", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4">4 Bedrooms</SelectItem>
                    <SelectItem value="5">5+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Select
                  value={formData.bathrooms}
                  onValueChange={(value) => handleInputChange("bathrooms", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bathroom</SelectItem>
                    <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                    <SelectItem value="2">2 Bathrooms</SelectItem>
                    <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                    <SelectItem value="3">3 Bathrooms</SelectItem>
                    <SelectItem value="3.5">3+ Bathrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Monthly Rent *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="2500"
                    className="pl-10"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  placeholder="1200"
                  value={formData.squareFootage}
                  onChange={(e) => handleInputChange("squareFootage", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </CardTitle>
            <CardDescription>Where is your property located?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Full Address *</Label>
                <Input
                  id="location"
                  placeholder="e.g., 123 Main St, New York, NY 10001"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input
                  id="neighborhood"
                  placeholder="e.g., Downtown, Financial District"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Property Description
            </CardTitle>
            <CardDescription>Describe your property to attract potential tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your property, amenities, nearby attractions, and what makes it special..."
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">{formData.description.length}/1000 characters</p>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>Select all amenities that apply to your property</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>Optional information that helps tenants understand your property better</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="leaseTerms">Lease Terms</Label>
                <Input
                  id="leaseTerms"
                  placeholder="e.g., 12 months minimum"
                  value={formData.leaseTerms}
                  onChange={(e) => handleInputChange("leaseTerms", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="petPolicy">Pet Policy</Label>
                <Input
                  id="petPolicy"
                  placeholder="e.g., Cats and dogs allowed with deposit"
                  value={formData.petPolicy}
                  onChange={(e) => handleInputChange("petPolicy", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  placeholder="1"
                  value={formData.parkingSpaces}
                  onChange={(e) => handleInputChange("parkingSpaces", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="utilities">Utilities</Label>
                <Input
                  id="utilities"
                  placeholder="e.g., Heat and hot water included"
                  value={formData.utilities}
                  onChange={(e) => handleInputChange("utilities", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Property Images
            </CardTitle>
            <CardDescription>Upload up to 6 high-quality images of your property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">Drop images here or click to upload</p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB each (max 6 images)</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                Choose Files
              </Button>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Uploaded Images</h4>
                  <Badge variant="secondary">{formData.images.length}/6 images</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? "Publishing..." : "Publish Listing"}
          </Button>
        </div>
      </form>
    </div>
  )
}

function ProfileContent({ user, setUser }: { user: User; setUser: (user: User) => void }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    bio: user.bio || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user profile
      const updatedUser = updateUserProfile(formData)
      if (updatedUser) {
        setUser(updatedUser)
        alert("Profile updated successfully!")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user.role === "landlord" ? "Profile & Contact Information" : "Profile"}
        </h1>
        <p className="text-gray-600 mt-2">
          {user.role === "landlord"
            ? "Manage your profile and contact information that tenants will see"
            : "Manage your profile information"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            {user.role === "landlord"
              ? "This information will be displayed to potential tenants when they view your properties"
              : "Keep your profile information up to date"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" type="button">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number {user.role === "landlord" && "*"}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required={user.role === "landlord"}
                />
              </div>
              {user.role === "landlord" && (
                <p className="text-sm text-gray-500">Tenants will use this number to contact you about properties</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{user.role === "landlord" ? "About Me (Bio)" : "Bio"}</Label>
              <Textarea
                id="bio"
                placeholder={
                  user.role === "landlord"
                    ? "Tell potential tenants about yourself, your experience as a landlord, and what makes you a great property owner..."
                    : "Tell us a bit about yourself..."
                }
                className="min-h-[100px]"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
              />
              {user.role === "landlord" && (
                <p className="text-sm text-gray-500">
                  This will be displayed on your property listings to help build trust with potential tenants
                </p>
              )}
            </div>

            {user.role === "landlord" && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Landlord Visibility</h4>
                <p className="text-sm text-blue-800">
                  Your contact information (name, phone, email) will be visible to tenants when they view your property
                  listings. Make sure all information is accurate and professional.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {user.role === "landlord" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contact Preferences</CardTitle>
            <CardDescription>How tenants can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Phone Calls</div>
                <div className="text-sm text-gray-500">Allow tenants to call you directly</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Messages</div>
                <div className="text-sm text-gray-500">Receive inquiries via email</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Platform Messages</div>
                <div className="text-sm text-gray-500">Receive messages through the platform</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SearchContent() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Properties</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Property Search</h3>
          <p className="text-gray-600">Search functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function FavoritesContent() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Properties</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Saved Properties</h3>
          <p className="text-gray-600">Your favorite properties will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function ApplicationsContent() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Applications</h3>
          <p className="text-gray-600">Your rental applications will be tracked here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function MessagesContent() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
          <p className="text-gray-600">Communication with landlords/tenants will appear here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsContent({ user }: { user: User }) {
  return <AnalyticsDashboard landlordEmail={user.email} />
}

function SettingsContent({ user }: { user: User }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <Badge variant={user.role === "landlord" ? "default" : "secondary"} className="mt-1">
                {user.role === "landlord" ? "Landlord" : "Tenant"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Account Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Eye className="mr-2 h-4 w-4" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Notification Preferences
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

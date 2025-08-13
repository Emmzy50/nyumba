"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  Settings,
  LogOut,
  Plus,
  Eye,
  MessageSquare,
  TrendingUp,
  Building,
  Menu,
  X,
  Star,
  User,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getPropertiesByLandlord } from "./lib/property-store"
import { LogoutDialog } from "./components/logout-dialog"
import { getCurrentUser, initializeMockUser } from "./lib/auth-utils"
import { clearCurrentUser } from "./lib/auth-utils"
import AddPropertyForm from "./add-property-form"
import ProfileManagement from "./profile-management"
import { useAppStore } from "@/lib/store"
import VerificationPrompt from "./verification-prompt"
import { api } from "@/lib/api"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user: storeUser } = useAppStore()

  // Initialize user on component mount
  useEffect(() => {
    if (storeUser) {
      setUser(storeUser)
      setIsLoading(false)
    } else {
      const currentUser = getCurrentUser() || initializeMockUser()
      setUser(currentUser)
      setIsLoading(false)
    }
  }, [storeUser])

  useEffect(() => {
    if (!isLoading && user && user.role !== "landlord") {
      console.log("Non-landlord user detected, redirecting to home")
      window.location.href = "/home"
    }
  }, [user, isLoading])

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleLogout = () => {
    clearCurrentUser()
    window.location.href = "/signin"
  }

  // Don't render until user is loaded
  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (user.role !== "landlord") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600 mb-4">This dashboard is only available for landlords.</p>
            <Button onClick={() => (window.location.href = "/home")}>Go to Tenant Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "properties", label: "My Properties", icon: Building },
    { id: "add-property", label: "Add Property", icon: Plus },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "profile", label: "Profile & Contact", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent user={user} setActiveTab={setActiveTab} />
      case "properties":
        return <PropertiesContent user={user} setActiveTab={setActiveTab} />
      case "add-property":
        return <AddPropertyContent user={user} setActiveTab={setActiveTab} />
      case "messages":
        return <MessagesContent />
      case "analytics":
        return <AnalyticsContent user={user} />
      case "profile":
        return <ProfileContent user={user} setUser={setUser} />
      case "settings":
        return <SettingsContent user={user} />
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
            <h1 className="text-xl font-bold text-gray-900">Nyumba</h1>
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
                <Badge variant="default" className="text-xs">
                  Landlord
                </Badge>
              </div>
            </div>
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
            <h1 className="text-xl font-bold text-gray-900">Nyumba</h1>
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
                <Badge variant="default" className="text-xs">
                  Landlord
                </Badge>
              </div>
            </div>
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
            <h1 className="text-lg font-semibold text-gray-900">Nyumba</h1>
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
      <LogoutDialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} onConfirm={handleLogout} />
    </>
  )
}

// Component implementations
function OverviewContent({ user, setActiveTab }) {
  const [landlordProperties, setLandlordProperties] = useState([])

  useEffect(() => {
    if (user.role === "landlord") {
      const properties = getPropertiesByLandlord(user.email)
      setLandlordProperties(properties)
    }
  }, [user.email, user.role])

  const stats = [
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Manage your properties and track your rental business.</p>
      </div>

      <div className="mb-8">
        <VerificationPrompt user={user} />
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PropertiesContent({ user, setActiveTab }) {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProperty, setEditingProperty] = useState(null)

  useEffect(() => {
    const loadLandlordProperties = async () => {
      try {
        setIsLoading(true)
        const allProperties = await api.getProperties()
        const landlordProperties = allProperties.filter((property) => property.landlord.email === user.email)
        setProperties(landlordProperties)
      } catch (error) {
        console.error("Error loading landlord properties:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.email) {
      loadLandlordProperties()
    }
  }, [user?.email])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZM", {
      style: "currency",
      currency: "ZMW",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleEditProperty = (property) => {
    setEditingProperty(property)
  }

  const handleDeleteProperty = async (propertyId) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await api.deleteProperty(propertyId)
        // Refresh properties list
        const allProperties = await api.getProperties()
        const landlordProperties = allProperties.filter((property) => property.landlord.email === user.email)
        setProperties(landlordProperties)
      } catch (error) {
        console.error("Error deleting property:", error)
        alert("Failed to delete property. Please try again.")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (editingProperty) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
            <p className="text-gray-600">Update your property listing details</p>
          </div>
          <Button variant="outline" onClick={() => setEditingProperty(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
        <AddPropertyForm property={editingProperty} onComplete={() => setEditingProperty(null)} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600">Manage and track your property listings</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {properties.length} {properties.length === 1 ? "Property" : "Properties"}
        </Badge>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first property listing.</p>
            <Button onClick={() => setActiveTab("add-property")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={property.images?.[0] || "/placeholder.svg?height=200&width=300"}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className="absolute top-2 right-2"
                  variant={property.status === "available" ? "default" : "secondary"}
                >
                  {property.status || "Available"}
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{property.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                  <div className="flex items-center text-green-600 font-semibold">
                    {formatPrice(property.price)}/month
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {property.analytics?.views || 0} views
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {property.analytics?.inquiries || 0} inquiries
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Listed {new Date(property.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    {property.analytics?.performanceScore || 0}/100
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEditProperty(property)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => window.open(`/property/${property.id}`, "_blank")}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function AddPropertyContent({ user, setActiveTab }) {
  return <AddPropertyForm />
}

function MessagesContent() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
          <p className="text-gray-600 mb-4">Communication with tenants will appear here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsContent({ user }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
          <p className="text-gray-600">Property analytics will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileContent({ user, setUser }) {
  return <ProfileManagement />
}

function SettingsContent({ user }) {
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
              <Badge variant="default" className="mt-1">
                Landlord
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

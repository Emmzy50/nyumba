"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building2, Search, Heart, Filter, LogOut, Menu, X, TrendingUp, User, Mail, Phone } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import type { Property } from "@/lib/types"
import PropertyCard from "./property-card"
import { LogoutDialog } from "./logout-dialog"

export default function TenantHome() {
  const {
    user,
    clearUser,
    properties,
    setProperties,
    savedProperties,
    toggleSavedProperty,
    searchResults,
    setSearchResults,
    loading,
    setLoading,
  } = useAppStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState("any")
  const [propertyType, setPropertyType] = useState("any")
  const [bedrooms, setBedrooms] = useState("any")
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading("properties", true)
    try {
      const [allProps, featured] = await Promise.all([api.getProperties(), api.getFeaturedProperties()])
      setProperties(allProps)
      setFeaturedProperties(featured)
      setSearchResults(allProps)
    } catch (error) {
      console.error("Error loading properties:", error)
    } finally {
      setLoading("properties", false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(properties)
      return
    }

    setLoading("search", true)
    try {
      const results = await api.searchProperties(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching properties:", error)
    } finally {
      setLoading("search", false)
    }
  }

  const handleFilter = async () => {
    setLoading("search", true)
    try {
      const criteria: any = {}

      if (priceRange !== "any") {
        if (priceRange.includes("-")) {
          criteria.priceRange = priceRange.split("-").map(Number)
        } else {
          // Handle "Above" price ranges like "1000000"
          criteria.priceRange = [Number(priceRange), null]
        }
      }

      if (propertyType !== "any") {
        criteria.propertyType = propertyType
      }

      if (bedrooms !== "any") {
        criteria.bedrooms = bedrooms
      }

      const results = await api.filterProperties(criteria)
      setSearchResults(results)
    } catch (error) {
      console.error("Error filtering properties:", error)
      setSearchResults(properties)
    } finally {
      setLoading("search", false)
    }
  }

  const handleLogout = () => {
    clearUser()
    window.location.href = "/signin"
  }

  const handleViewProperty = (propertyId: string) => {
    window.location.href = `/property/${propertyId}`
  }

  if (loading.properties) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nyumba</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Find Your Perfect Home</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Welcome, {user.name}</span>
                    <span className="text-xs text-gray-500">{savedProperties.length} saved properties</span>
                  </div>
                </div>
              )}
              <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Profile Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="text-lg">
                          {user?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                      {user?.phone && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Phone</p>
                            <p className="text-sm text-gray-600">{user.phone}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Heart className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Saved Properties</p>
                          <p className="text-sm text-gray-600">{savedProperties.length} properties saved</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutDialog(true)}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-4">
              {user && (
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Welcome, {user.name}</span>
                    <span className="text-xs text-gray-500">{savedProperties.length} saved properties</span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowProfileDialog(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Profile Details</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowLogoutDialog(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {user ? `Welcome back, ${user.name.split(" ")[0]}!` : "Discover Your Next Home"}
          </h2>
          <p className="text-gray-600">Browse through our collection of verified properties in Zambia</p>
          {user && savedProperties.length > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              You have {savedProperties.length} saved propert{savedProperties.length === 1 ? "y" : "ies"}
            </p>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by location, title, or neighborhood..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Price</SelectItem>
                  <SelectItem value="0-200000">Under ZMW 200,000</SelectItem>
                  <SelectItem value="200000-400000">ZMW 200,000 - 400,000</SelectItem>
                  <SelectItem value="400000-600000">ZMW 400,000 - 600,000</SelectItem>
                  <SelectItem value="600000-1000000">ZMW 600,000 - 1,000,000</SelectItem>
                  <SelectItem value="1000000">Above ZMW 1,000,000</SelectItem>
                </SelectContent>
              </Select>

              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="boarding-house">Boarding House</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button onClick={handleSearch} className="flex items-center space-x-2" disabled={loading.search}>
                <Search className="h-4 w-4" />
                <span>{loading.search ? "Searching..." : "Search"}</span>
              </Button>
              <Button
                onClick={handleFilter}
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
                disabled={loading.search}
              >
                <Filter className="h-4 w-4" />
                <span>Apply Filters</span>
              </Button>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setPriceRange("any")
                  setPropertyType("any")
                  setBedrooms("any")
                  setSearchResults(properties)
                }}
                variant="ghost"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Featured Properties */}
        {featuredProperties.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Featured Properties</h3>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>Trending</span>
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} onView={() => handleViewProperty(property.id)} />
              ))}
            </div>
          </div>
        )}

        {/* All Properties */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">All Properties ({searchResults.length})</h3>
            {savedProperties.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const saved = searchResults.filter((p) => savedProperties.includes(p.id))
                  setSearchResults(saved)
                }}
              >
                <Heart className="h-4 w-4 mr-2" />
                Show Saved ({savedProperties.length})
              </Button>
            )}
          </div>

          {loading.search ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or browse all available properties.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setPriceRange("any")
                    setPropertyType("any")
                    setBedrooms("any")
                    setSearchResults(properties)
                  }}
                >
                  View All Properties
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((property) => (
                <PropertyCard key={property.id} property={property} onView={() => handleViewProperty(property.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logout Dialog */}
      <LogoutDialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} onConfirm={handleLogout} />
    </div>
  )
}

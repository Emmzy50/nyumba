"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Heart,
  Eye,
  Grid3X3,
  List,
  SlidersHorizontal,
  Star,
  Home,
  ArrowLeft,
} from "lucide-react"
import { getAllProperties, searchProperties, trackPropertySave, type Property } from "./lib/property-store"

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=40&width=40&text=JD",
}

// Helper function to format numbers as Zambian Kwacha
const formatKwacha = (amount: number) => {
  return new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency: "ZMW",
  }).format(amount)
}

export default function PropertyBrowse() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState("all")
  const [bedroomFilter, setBedroomFilter] = useState("all")
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [savedProperties, setSavedProperties] = useState<string[]>([])
  const [allProperties, setAllProperties] = useState<Property[]>([])

  // Load properties from store
  useEffect(() => {
    const properties = getAllProperties()
    setAllProperties(properties)
  }, [])

  // Get search parameter from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchParam = urlParams.get("search")
    if (searchParam) {
      setSearchTerm(searchParam)
      setShowFilters(true) // Show filters when there's a search
    }
  }, [])

  const toggleSaveProperty = (propertyId: string) => {
    setSavedProperties((prev) => {
      const isCurrentlySaved = prev.includes(propertyId)

      if (!isCurrentlySaved) {
        // Track the save
        trackPropertySave(propertyId, {
          timestamp: new Date().toISOString(),
          userId: "current_user_id", // In real app, get from auth
          userName: mockUser.name,
          userEmail: mockUser.email,
        })
      }

      return isCurrentlySaved ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    })
  }

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = allProperties

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = searchProperties(searchTerm)
    }

    // Apply other filters
    filtered = filtered.filter((property) => {
      // Price filter
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-2000" && property.price < 2000) ||
        (priceRange === "2000-3000" && property.price >= 2000 && property.price <= 3000) ||
        (priceRange === "3000-4000" && property.price >= 3000 && property.price <= 4000) ||
        (priceRange === "over-4000" && property.price > 4000)

      // Bedroom filter
      const matchesBedrooms =
        bedroomFilter === "all" ||
        (bedroomFilter === "studio" && property.bedrooms === 0) ||
        (bedroomFilter === "1" && property.bedrooms === 1) ||
        (bedroomFilter === "2" && property.bedrooms === 2) ||
        (bedroomFilter === "3" && property.bedrooms === 3) ||
        (bedroomFilter === "4+" && property.bedrooms >= 4)

      // Property type filter
      const matchesType = propertyTypeFilter === "all" || property.propertyType === propertyTypeFilter

      return matchesPrice && matchesBedrooms && matchesType
    })

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
        default:
          return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
      }
    })

    return filtered
  }, [allProperties, searchTerm, priceRange, bedroomFilter, propertyTypeFilter, sortBy])

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex" : ""}`}>
      <div className={`relative ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}>
        <img
          src={property.images[0] || "/placeholder.svg"}
          alt={property.title}
          className={`object-cover ${viewMode === "list" ? "w-full h-full" : "w-full h-48"}`}
        />
        <button
          onClick={() => toggleSaveProperty(property.id)}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${
              savedProperties.includes(property.id) ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
        {!property.available && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Unavailable
            </Badge>
          </div>
        )}
      </div>

      <div className="flex-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold line-clamp-1">{property.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="line-clamp-1">{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{formatKwacha(property.price)}</div>
              <div className="text-sm text-gray-500">per month</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
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
              {property.rating} ({property.reviews})
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{property.description}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={!property.available}
              onClick={() => (window.location.href = `/property/${property.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {property.available ? "View Details" : "Unavailable"}
            </Button>
            <Button variant="outline" size="sm" disabled={!property.available}>
              Contact
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Back Button */}
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-2" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Home className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Nyumba</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                <AvatarFallback>
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {searchTerm ? `Search Results for "${searchTerm}"` : "Browse Properties"}
              </h1>
              <p className="text-gray-600">
                {searchTerm
                  ? `Found ${filteredAndSortedProperties.length} properties matching your search`
                  : `Find your perfect home from ${allProperties.length} available listings`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by location, property name, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Toggle */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-transparent"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <div className="text-sm text-gray-600">
                    Showing {filteredAndSortedProperties.length} of {allProperties.length} properties
                  </div>
                </div>

                {/* Filters */}
                {showFilters && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Price Range</Label>
                        <Select value={priceRange} onValueChange={setPriceRange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-2000">Under ZMW 2,000</SelectItem>
                            <SelectItem value="2000-3000">ZMW 2,000 - 3,000</SelectItem>
                            <SelectItem value="3000-4000">ZMW 3,000 - 4,000</SelectItem>
                            <SelectItem value="over-4000">Over ZMW 4,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Bedrooms</Label>
                        <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="1">1 Bedroom</SelectItem>
                            <SelectItem value="2">2 Bedrooms</SelectItem>
                            <SelectItem value="3">3 Bedrooms</SelectItem>
                            <SelectItem value="4+">4+ Bedrooms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Property Type</Label>
                        <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="boarding-house">Boarding House</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Sort By</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                            <SelectItem value="rating">Highest Rated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {filteredAndSortedProperties.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? `No properties match "${searchTerm}". Try adjusting your search or filters.`
                    : "No properties are currently available. Check back soon!"}
                </p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm("")} variant="outline">
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredAndSortedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

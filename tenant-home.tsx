"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Search,
  MapPin,
  Bed,
  Bath,
  Car,
  Star,
  Heart,
  Filter,
  LogOut,
  Menu,
  X,
  Phone,
  Mail,
  TrendingUp,
} from "lucide-react"
import {
  getAllProperties,
  getFeaturedProperties,
  searchProperties,
  formatKwacha,
  type Property,
} from "./lib/property-store"
import { getCurrentUser, clearCurrentUser } from "./lib/auth-utils"
import { LogoutDialog } from "./components/logout-dialog"

export default function TenantHome() {
  const [properties, setProperties] = useState<Property[]>([])
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState("any")
  const [propertyType, setPropertyType] = useState("any")
  const [bedrooms, setBedrooms] = useState("any")
  const [isLoading, setIsLoading] = useState(true)
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set())
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(getCurrentUser())

  useEffect(() => {
    // Load properties
    const loadProperties = () => {
      setIsLoading(true)
      try {
        const allProps = getAllProperties()
        const featured = getFeaturedProperties()
        setProperties(allProps)
        setFeaturedProperties(featured)
      } catch (error) {
        console.error("Error loading properties:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProperties()

    // Load saved properties from localStorage
    const saved = localStorage.getItem("savedProperties")
    if (saved) {
      setSavedProperties(new Set(JSON.parse(saved)))
    }
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setProperties(getAllProperties())
      return
    }

    const results = searchProperties(searchQuery)
    setProperties(results)
  }

  const handleFilter = () => {
    let filtered = getAllProperties()

    // Filter by price range
    if (priceRange !== "any") {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((property) => {
        if (max) {
          return property.price >= min && property.price <= max
        } else {
          return property.price >= min
        }
      })
    }

    // Filter by property type
    if (propertyType !== "any") {
      filtered = filtered.filter((property) => property.propertyType === propertyType)
    }

    // Filter by bedrooms
    if (bedrooms !== "any") {
      const bedroomCount = Number.parseInt(bedrooms)
      filtered = filtered.filter((property) => property.bedrooms === bedroomCount)
    }

    setProperties(filtered)
  }

  const toggleSaveProperty = (propertyId: string) => {
    const newSaved = new Set(savedProperties)
    if (newSaved.has(propertyId)) {
      newSaved.delete(propertyId)
    } else {
      newSaved.add(propertyId)
    }
    setSavedProperties(newSaved)
    localStorage.setItem("savedProperties", JSON.stringify([...newSaved]))
  }

  const handleLogout = () => {
    clearCurrentUser()
    window.location.href = "/"
  }

  const handleViewProperty = (propertyId: string) => {
    window.location.href = `/property/${propertyId}`
  }

  const PropertyCard = ({ property, featured = false }: { property: Property; featured?: boolean }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${featured ? "ring-2 ring-blue-500" : ""}`}>
      <div className="relative">
        <img
          src={property.images[0] || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {featured && (
          <Badge className="absolute top-2 left-2 bg-blue-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => toggleSaveProperty(property.id)}
        >
          <Heart
            className={`h-4 w-4 ${savedProperties.has(property.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{property.title}</h3>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">{formatKwacha(property.price)}</div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
          </div>
          {property.parkingSpaces > 0 && (
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-1" />
              {property.parkingSpaces} parking
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium">{property.rating}</span>
            <span className="text-sm text-gray-500 ml-1">({property.reviews} reviews)</span>
          </div>
          <Badge variant={property.available ? "default" : "secondary"}>
            {property.available ? "Available" : "Rented"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {property.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => handleViewProperty(property.id)} className="flex-1" size="sm">
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(`tel:${property.landlord.phone}`, "_self")}>
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(`mailto:${property.landlord.email}`, "_self")}>
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
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
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">Welcome, {user.name}</span>
                </div>
              )}
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
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">Welcome, {user.name}</span>
                </div>
              )}
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
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {user ? `Welcome back, ${user.name.split(" ")[0]}!` : "Discover Your Next Home"}
          </h2>
          <p className="text-gray-600">Browse through our collection of verified properties in Malawi</p>
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
                  <SelectItem value="0-200000">Under MK 200,000</SelectItem>
                  <SelectItem value="200000-400000">MK 200,000 - 400,000</SelectItem>
                  <SelectItem value="400000-600000">MK 400,000 - 600,000</SelectItem>
                  <SelectItem value="600000-1000000">MK 600,000 - 1,000,000</SelectItem>
                  <SelectItem value="1000000">Above MK 1,000,000</SelectItem>
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
              <Button onClick={handleSearch} className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
              <Button onClick={handleFilter} variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Filter className="h-4 w-4" />
                <span>Apply Filters</span>
              </Button>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setPriceRange("any")
                  setPropertyType("any")
                  setBedrooms("any")
                  setProperties(getAllProperties())
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
                <PropertyCard key={property.id} property={property} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Properties */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">All Properties ({properties.length})</h3>
          </div>

          {properties.length === 0 ? (
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
                    setProperties(getAllProperties())
                  }}
                >
                  View All Properties
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
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

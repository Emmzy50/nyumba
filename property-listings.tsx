"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, MapPin, Bed, Bath, Heart, Eye, Grid3X3, List, SlidersHorizontal, Star } from "lucide-react"

// Mock property data - in a real app, this would come from your database
const mockProperties = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    location: "123 Main St, New York, NY 10001",
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "apartment",
    description: "Beautiful modern apartment in the heart of downtown with stunning city views.",
    images: ["/placeholder.svg?height=300&width=400&text=Modern+Apartment"],
    amenities: ["Gym", "Pool", "Parking", "Pet Friendly"],
    rating: 4.8,
    reviews: 24,
    available: true,
    landlord: "Sarah Johnson",
    datePosted: "2024-01-15",
  },
  {
    id: "2",
    title: "Cozy Studio Near University",
    location: "456 College Ave, Boston, MA 02115",
    price: 1800,
    bedrooms: 0,
    bathrooms: 1,
    propertyType: "studio",
    description: "Perfect studio apartment for students, walking distance to campus.",
    images: ["/placeholder.svg?height=300&width=400&text=Cozy+Studio"],
    amenities: ["WiFi", "Laundry", "Study Area"],
    rating: 4.5,
    reviews: 18,
    available: true,
    landlord: "Mike Chen",
    datePosted: "2024-01-12",
  },
  {
    id: "3",
    title: "Spacious Family House",
    location: "789 Oak Street, Austin, TX 78701",
    price: 3200,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "house",
    description: "Large family home with backyard, perfect for families with children.",
    images: ["/placeholder.svg?height=300&width=400&text=Family+House"],
    amenities: ["Backyard", "Garage", "Dishwasher", "AC"],
    rating: 4.9,
    reviews: 31,
    available: true,
    landlord: "Jennifer Davis",
    datePosted: "2024-01-10",
  },
  {
    id: "4",
    title: "Luxury Condo with Pool",
    location: "321 Beach Blvd, Miami, FL 33139",
    price: 4500,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "condo",
    description: "Luxury beachfront condo with ocean views and resort-style amenities.",
    images: ["/placeholder.svg?height=300&width=400&text=Luxury+Condo"],
    amenities: ["Pool", "Beach Access", "Concierge", "Gym"],
    rating: 4.7,
    reviews: 42,
    available: true,
    landlord: "Robert Martinez",
    datePosted: "2024-01-08",
  },
  {
    id: "5",
    title: "Charming Townhouse",
    location: "654 Elm Street, Portland, OR 97201",
    price: 2800,
    bedrooms: 3,
    bathrooms: 2.5,
    propertyType: "townhouse",
    description: "Beautiful townhouse in a quiet neighborhood with modern updates.",
    images: ["/placeholder.svg?height=300&width=400&text=Charming+Townhouse"],
    amenities: ["Patio", "Fireplace", "Updated Kitchen", "Parking"],
    rating: 4.6,
    reviews: 19,
    available: false,
    landlord: "Lisa Thompson",
    datePosted: "2024-01-05",
  },
  {
    id: "6",
    title: "Urban Loft Space",
    location: "987 Industrial Way, Seattle, WA 98101",
    price: 2200,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "apartment",
    description: "Trendy loft in converted warehouse with high ceilings and exposed brick.",
    images: ["/placeholder.svg?height=300&width=400&text=Urban+Loft"],
    amenities: ["High Ceilings", "Exposed Brick", "Modern Appliances"],
    rating: 4.4,
    reviews: 15,
    available: true,
    landlord: "David Kim",
    datePosted: "2024-01-03",
  },
]

interface Property {
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
  rating: number
  reviews: number
  available: boolean
  landlord: string
  datePosted: string
}

export default function PropertyListings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState("all")
  const [bedroomFilter, setBedroomFilter] = useState("all")
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [savedProperties, setSavedProperties] = useState<string[]>([])

  const toggleSaveProperty = (propertyId: string) => {
    setSavedProperties((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId],
    )
  }

  const filteredAndSortedProperties = useMemo(() => {
    const filtered = mockProperties.filter((property) => {
      // Search filter
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())

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

      return matchesSearch && matchesPrice && matchesBedrooms && matchesType
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
  }, [searchTerm, priceRange, bedroomFilter, propertyTypeFilter, sortBy])

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
              <div className="text-2xl font-bold text-green-600">${property.price.toLocaleString()}</div>
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
            <Button className="flex-1" disabled={!property.available}>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
          <p className="text-gray-600">Find your perfect home from {mockProperties.length} available listings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
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
                Showing {filteredAndSortedProperties.length} of {mockProperties.length} properties
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
                        <SelectItem value="under-2000">Under $2,000</SelectItem>
                        <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                        <SelectItem value="3000-4000">$3,000 - $4,000</SelectItem>
                        <SelectItem value="over-4000">Over $4,000</SelectItem>
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
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
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
  )
}

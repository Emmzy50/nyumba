"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Home,
  Wifi,
  Car,
  Trees,
  Utensils,
  Dumbbell,
  Shield,
  Zap,
  Snowflake,
  Sun,
  Droplets,
  ArrowUp,
  GraduationCap,
  Hospital,
  ShoppingBag,
  Bus,
  Plane,
  Banknote,
  X,
  RotateCcw,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import type { SearchCriteria } from "@/lib/types"

interface AdvancedSearchProps {
  onSearch?: (results: any[]) => void
  className?: string
}

export default function AdvancedSearch({ onSearch, className }: AdvancedSearchProps) {
  const { searchCriteria, setSearchCriteria, setSearchResults, setLoading } = useAppStore()

  const [localCriteria, setLocalCriteria] = useState<SearchCriteria>({
    location: "",
    priceRange: [1000, 10000],
    propertyTypes: [],
    bedrooms: [],
    bathrooms: [],
    amenities: [],
    furnished: undefined,
    petFriendly: undefined,
    availableFrom: "",
    keywords: "",
    ...searchCriteria,
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const amenityOptions = [
    { id: "wifi", label: "High-Speed WiFi", icon: Wifi },
    { id: "parking", label: "Parking Space", icon: Car },
    { id: "gym", label: "Gym/Fitness Center", icon: Dumbbell },
    { id: "pool", label: "Swimming Pool", icon: Droplets },
    { id: "garden", label: "Garden/Balcony", icon: Trees },
    { id: "kitchen", label: "Fully Equipped Kitchen", icon: Utensils },
    { id: "laundry", label: "Laundry Facilities", icon: Home },
    { id: "security", label: "24/7 Security", icon: Shield },
    { id: "generator", label: "Backup Generator", icon: Zap },
    { id: "aircon", label: "Air Conditioning", icon: Snowflake },
    { id: "heating", label: "Central Heating", icon: Sun },
    { id: "elevator", label: "Elevator Access", icon: ArrowUp },
  ]

  const nearbyFacilities = [
    { id: "schools", label: "Schools", icon: GraduationCap },
    { id: "hospitals", label: "Hospitals", icon: Hospital },
    { id: "shopping", label: "Shopping Centers", icon: ShoppingBag },
    { id: "restaurants", label: "Restaurants", icon: Utensils },
    { id: "banks", label: "Banks/ATMs", icon: Banknote },
    { id: "transport", label: "Public Transport", icon: Bus },
    { id: "airport", label: "Airport", icon: Plane },
    { id: "parks", label: "Parks/Recreation", icon: Trees },
  ]

  const handleSearch = async () => {
    setIsSearching(true)
    setLoading("search", true)

    try {
      const results = await api.searchProperties(localCriteria.keywords || "", localCriteria)
      setSearchResults(results)
      setSearchCriteria(localCriteria)

      if (onSearch) {
        onSearch(results)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
      setLoading("search", false)
    }
  }

  const handleClearFilters = () => {
    const clearedCriteria: SearchCriteria = {
      location: "",
      priceRange: [1000, 10000],
      propertyTypes: [],
      bedrooms: [],
      bathrooms: [],
      amenities: [],
      furnished: undefined,
      petFriendly: undefined,
      availableFrom: "",
      keywords: "",
    }
    setLocalCriteria(clearedCriteria)
  }

  const toggleAmenity = (amenityId: string) => {
    setLocalCriteria((prev) => ({
      ...prev,
      amenities: prev.amenities?.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...(prev.amenities || []), amenityId],
    }))
  }

  const togglePropertyType = (type: string) => {
    setLocalCriteria((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes?.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...(prev.propertyTypes || []), type],
    }))
  }

  const toggleBedrooms = (bedrooms: number) => {
    setLocalCriteria((prev) => ({
      ...prev,
      bedrooms: prev.bedrooms?.includes(bedrooms)
        ? prev.bedrooms.filter((b) => b !== bedrooms)
        : [...(prev.bedrooms || []), bedrooms],
    }))
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Property Search
        </CardTitle>
        <CardDescription>Find your perfect property with advanced filtering options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Search */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Search Keywords</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="keywords"
                  placeholder="Property name, description, or features..."
                  value={localCriteria.keywords || ""}
                  onChange={(e) => setLocalCriteria((prev) => ({ ...prev, keywords: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  placeholder="City, neighborhood, or address..."
                  value={localCriteria.location || ""}
                  onChange={(e) => setLocalCriteria((prev) => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range (ZMW)</Label>
            <div className="px-3">
              <Slider
                value={localCriteria.priceRange || [1000, 10000]}
                onValueChange={(value) =>
                  setLocalCriteria((prev) => ({ ...prev, priceRange: value as [number, number] }))
                }
                max={20000}
                min={500}
                step={100}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>ZMW {(localCriteria.priceRange?.[0] || 1000).toLocaleString()}</span>
              <span>ZMW {(localCriteria.priceRange?.[1] || 10000).toLocaleString()}</span>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="bg-transparent"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {showAdvanced ? "Hide" : "Show"} Advanced Filters
            </Button>

            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={handleClearFilters}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <>
            <Separator />
            <div className="space-y-6">
              {/* Property Types */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Property Types</Label>
                <div className="flex flex-wrap gap-2">
                  {["apartment", "house", "condo", "townhouse", "studio", "boarding-house"].map((type) => (
                    <Badge
                      key={type}
                      variant={localCriteria.propertyTypes?.includes(type) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => togglePropertyType(type)}
                    >
                      {type === "boarding-house" ? "Boarding House" : type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Bedrooms</Label>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5].map((bedrooms) => (
                    <Badge
                      key={bedrooms}
                      variant={localCriteria.bedrooms?.includes(bedrooms) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleBedrooms(bedrooms)}
                    >
                      {bedrooms === 0 ? "Studio" : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenityOptions.map((amenity) => {
                    const Icon = amenity.icon
                    const isSelected = localCriteria.amenities?.includes(amenity.id)
                    return (
                      <div
                        key={amenity.id}
                        className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                        }`}
                        onClick={() => toggleAmenity(amenity.id)}
                      >
                        <Icon className={`h-4 w-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                        <span className={`text-sm ${isSelected ? "text-blue-900 font-medium" : "text-gray-700"}`}>
                          {amenity.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Filters</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pet Friendly</span>
                    <Switch
                      checked={localCriteria.petFriendly === true}
                      onCheckedChange={(checked) =>
                        setLocalCriteria((prev) => ({ ...prev, petFriendly: checked ? true : undefined }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Furnished</span>
                    <Switch
                      checked={localCriteria.furnished === true}
                      onCheckedChange={(checked) =>
                        setLocalCriteria((prev) => ({ ...prev, furnished: checked ? true : undefined }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Available From */}
              <div className="space-y-2">
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={localCriteria.availableFrom || ""}
                  onChange={(e) => setLocalCriteria((prev) => ({ ...prev, availableFrom: e.target.value }))}
                />
              </div>
            </div>
          </>
        )}

        {/* Active Filters Summary */}
        {(localCriteria.propertyTypes?.length || localCriteria.amenities?.length || localCriteria.bedrooms?.length) && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {localCriteria.propertyTypes?.map((type) => (
                  <Badge key={type} variant="secondary" className="capitalize">
                    {type === "boarding-house" ? "Boarding House" : type}
                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => togglePropertyType(type)} />
                  </Badge>
                ))}
                {localCriteria.bedrooms?.map((bedrooms) => (
                  <Badge key={bedrooms} variant="secondary">
                    {bedrooms === 0 ? "Studio" : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleBedrooms(bedrooms)} />
                  </Badge>
                ))}
                {localCriteria.amenities?.map((amenityId) => {
                  const amenity = amenityOptions.find((a) => a.id === amenityId)
                  return amenity ? (
                    <Badge key={amenityId} variant="secondary">
                      {amenity.label}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleAmenity(amenityId)} />
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

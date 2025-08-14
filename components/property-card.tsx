"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Star,
  Heart,
  Eye,
  Phone,
  MessageSquare,
  Share2,
  TrendingUp,
  Wifi,
  Dumbbell,
  Shield,
  Trees,
  Video,
  Ruler,
  Clock,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import type { Property } from "@/lib/types"

interface PropertyCardProps {
  property: Property
  variant?: "grid" | "list"
  showAnalytics?: boolean
  onView?: (property: Property) => void
  onContact?: (property: Property) => void
  onApply?: (property: Property) => void
}

export default function PropertyCard({
  property,
  variant = "grid",
  showAnalytics = false,
  onView,
  onContact,
  onApply,
}: PropertyCardProps) {
  const { savedProperties, toggleSavedProperty, user } = useAppStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const isSaved = savedProperties.includes(property.id)
  const isOwner = user?.id === property.landlord.id

  const handleSave = async () => {
    toggleSavedProperty(property.id)
    if (!isSaved) {
      await api.trackPropertySave(property.id, user?.id)
    }
  }

  const handleView = async () => {
    if (onView) {
      onView(property)
    } else {
      window.location.href = `/property/${property.id}`
    }
    await api.trackPropertyView(property.id, user?.id)
  }

  const handleContact = async () => {
    if (onContact) {
      onContact(property)
    }
    await api.trackPropertyInquiry(property.id, user?.id)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: `${window.location.origin}/property/${property.id}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZM", {
      style: "currency",
      currency: "ZMW",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      "High-Speed WiFi": Wifi,
      "Gym/Fitness Center": Dumbbell,
      "24/7 Security": Shield,
      "Garden/Balcony": Trees,
      "Swimming Pool": "🏊",
      "Parking Space": Car,
    }
    return iconMap[amenity] || null
  }

  if (variant === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="flex">
          {/* Image Section */}
          <div className="relative w-80 flex-shrink-0">
            <img
              src={property.images[currentImageIndex] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {/* Image Navigation */}
            {property.images && property.images.length > 1 && (
              <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {property.featured && (
                <Badge className="bg-blue-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {property.verified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✓ Verified
                </Badge>
              )}
              {property.virtualTour?.enabled && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Video className="h-3 w-3 mr-1" />
                  360° Tour
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white" onClick={handleSave}>
                <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{formatPrice(property.price)}</div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>
                  {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bed${property.bedrooms > 1 ? "s" : ""}`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>
                  {property.bathrooms} bath{property.bathrooms > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span>{property.squareFootage} sq ft</span>
              </div>
              {property.parkingSpaces > 0 && (
                <div className="flex items-center gap-1">
                  <Car className="h-4 w-4" />
                  <span>{property.parkingSpaces} parking</span>
                </div>
              )}
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{property.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({property.reviews?.length || 0} reviews)</span>
                </div>
                <Badge variant={property.available ? "default" : "secondary"}>
                  {property.available ? "Available" : "Rented"}
                </Badge>
              </div>

              {showAnalytics && property.analytics && (
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {property.analytics.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {property.analytics.saves}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {property.analytics.inquiries}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{property.description}</p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(property.amenities || []).slice(0, 4).map((amenity, index) => {
                const Icon = getAmenityIcon(amenity)
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                  >
                    {Icon && typeof Icon === "function" && <Icon className="h-3 w-3" />}
                    {typeof Icon === "string" && <span>{Icon}</span>}
                    <span>{amenity}</span>
                  </div>
                )
              })}
              {(property.amenities?.length || 0) > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{(property.amenities?.length || 0) - 4} more
                </Badge>
              )}
            </div>

            {/* Landlord Info */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={property.landlord.avatar || "/placeholder.svg"} alt={property.landlord.name} />
                  <AvatarFallback>
                    {property.landlord.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{property.landlord.name}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    {property.landlord.rating} • {property.landlord.totalProperties} properties
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {property.landlord.responseTime}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleView} className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              {!isOwner && (
                <>
                  <Button variant="outline" onClick={handleContact}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  {onApply && (
                    <Button variant="outline" onClick={() => onApply(property)}>
                      Apply
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Grid variant
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative">
        <img
          src={property.images[currentImageIndex] || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-48 object-cover"
        />

        {/* Image Navigation */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.featured && (
            <Badge className="bg-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {property.verified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ✓ Verified
            </Badge>
          )}
          {property.virtualTour?.enabled && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Video className="h-3 w-3 mr-1" />
              360°
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white" onClick={handleSave}>
            <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Badge */}
        {!property.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Not Available
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm line-clamp-1">{property.location}</span>
            </div>
          </div>
          <div className="text-right ml-3">
            <div className="text-xl font-bold text-green-600">{formatPrice(property.price)}</div>
            <div className="text-xs text-gray-500">per month</div>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>
              {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bed${property.bedrooms > 1 ? "s" : ""}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>
              {property.bathrooms} bath{property.bathrooms > 1 ? "s" : ""}
            </span>
          </div>
          {property.parkingSpaces > 0 && (
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{property.parkingSpaces}</span>
            </div>
          )}
        </div>

        {/* Rating and Analytics */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{property.rating}</span>
              <span className="text-sm text-gray-500 ml-1">({property.reviews?.length || 0})</span>
            </div>
            <Badge variant={property.available ? "default" : "secondary"}>
              {property.available ? "Available" : "Rented"}
            </Badge>
          </div>

          {showAnalytics && property.analytics && (
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {property.analytics.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {property.analytics.saves}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{property.description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(property.amenities || []).slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {(property.amenities?.length || 0) > 3 && (
            <Badge variant="outline" className="text-xs">
              +{(property.amenities?.length || 0) - 3} more
            </Badge>
          )}
        </div>

        {/* Landlord Info */}
        <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={property.landlord.avatar || "/placeholder.svg"} alt={property.landlord.name} />
              <AvatarFallback className="text-xs">
                {property.landlord.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-xs">{property.landlord.name}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="h-2 w-2 text-yellow-400 fill-current" />
                {property.landlord.rating}
              </div>
            </div>
          </div>
          {property.landlord.verified && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              ✓ Verified
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleView} className="flex-1" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {!isOwner && (
            <Button variant="outline" size="sm" onClick={handleContact}>
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Bed,
  Bath,
  Car,
  MapPin,
  Star,
  Heart,
  Share2,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Home,
  Wifi,
  Dumbbell,
  CarIcon,
  PawPrint,
  Shield,
  Building,
  Ruler,
  Clock,
  TrendingUp,
  Eye,
  Bookmark,
  Users,
} from "lucide-react"
import { getPropertyById, trackPropertyView, type Property } from "./lib/property-store"

interface PropertyDetailProps {
  propertyId: string
}

export default function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const foundProperty = getPropertyById(propertyId)

        if (!foundProperty) {
          setError("Property not found")
          return
        }

        setProperty(foundProperty)

        // Track property view
        trackPropertyView(propertyId, {
          timestamp: new Date().toISOString(),
          userId: "current_user_id", // In real app, get from auth
          userType: "tenant",
          source: "direct",
          timeSpent: 0,
          deviceType: "desktop",
        })
      } catch (err) {
        console.error("Error loading property:", err)
        setError("Failed to load property")
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      loadProperty()
    }
  }, [propertyId])

  const handleSave = () => {
    setIsSaved(!isSaved)
    // In a real app, you'd save this to the backend
  }

  const handleContact = (type: "phone" | "email" | "message") => {
    if (!property) return

    switch (type) {
      case "phone":
        window.open(`tel:${property.landlord.phone}`)
        break
      case "email":
        window.open(`mailto:${property.landlord.email}`)
        break
      case "message":
        // In a real app, open messaging interface
        alert("Messaging feature coming soon!")
        break
    }
  }

  const handleScheduleTour = () => {
    alert("Tour scheduling feature coming soon!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The property you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const amenityIcons: { [key: string]: any } = {
    Gym: Dumbbell,
    Pool: Building,
    Parking: CarIcon,
    "Pet Friendly": PawPrint,
    Concierge: Shield,
    "Rooftop Terrace": Building,
    "In-unit Laundry": Home,
    WiFi: Wifi,
    "Study Area": Building,
    "Bike Storage": Building,
    Backyard: Building,
    Garage: CarIcon,
    Dishwasher: Home,
    AC: Building,
    Fireplace: Home,
    "High Ceilings": Building,
    "Exposed Brick": Building,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => window.history.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={property.images[currentImageIndex] || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
                {property.images.length > 1 && (
                  <>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
                {property.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600">Featured</Badge>
                  </div>
                )}
              </div>
              {property.images.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">${property.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bed`}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{property.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ruler className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{property.squareFootage} sq ft</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{property.parkingSpaces} parking</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">
                      {property.rating} ({property.reviews} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity) => {
                        const IconComponent = amenityIcons[amenity] || Building
                        return (
                          <div key={amenity} className="flex items-center gap-2 text-sm">
                            <IconComponent className="h-4 w-4 text-gray-400" />
                            {amenity}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Property Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Property Type:</span>
                          <span className="capitalize">{property.propertyType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lease Terms:</span>
                          <span>{property.leaseTerms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pet Policy:</span>
                          <span>{property.petPolicy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Utilities:</span>
                          <span>{property.utilities}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Neighborhood</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Area:</span>
                          <span>{property.neighborhood}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Walk Score:</span>
                          <span>{property.walkScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">School District:</span>
                          <span>{property.schoolDistrict}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-600 text-sm">Transportation:</span>
                        <div className="mt-1">
                          {property.nearbyTransport.map((transport, index) => (
                            <div key={index} className="text-sm text-gray-800">
                              {transport}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics (if available) */}
            {property.analytics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Property Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-blue-600">
                        <Eye className="h-5 w-5" />
                        {property.analytics.views}
                      </div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
                        <MessageSquare className="h-5 w-5" />
                        {property.analytics.inquiries}
                      </div>
                      <div className="text-sm text-gray-600">Inquiries</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-purple-600">
                        <Bookmark className="h-5 w-5" />
                        {property.analytics.saves}
                      </div>
                      <div className="text-sm text-gray-600">Saves</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-600">
                        <Users className="h-5 w-5" />
                        {property.analytics.applications}
                      </div>
                      <div className="text-sm text-gray-600">Applications</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={property.landlord.avatar || "/placeholder.svg"} alt={property.landlord.name} />
                      <AvatarFallback>
                        {property.landlord.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{property.landlord.name}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        {property.landlord.rating} • {property.landlord.properties} properties
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {property.landlord.responseTime}
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => handleContact("message")}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => handleContact("phone")}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" onClick={() => handleContact("email")}>
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleScheduleTour}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Tour
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <Badge variant={property.available ? "default" : "secondary"}>
                      {property.available ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted:</span>
                    <span>{new Date(property.datePosted).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID:</span>
                    <span className="font-mono">#{property.id}</span>
                  </div>
                  {property.analytics?.trending && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        🔥 Trending
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

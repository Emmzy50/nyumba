"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
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
  Shield,
  Building,
  Ruler,
  Clock,
  TrendingUp,
  Eye,
  Bookmark,
  Users,
  Trees,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import type { Property } from "@/lib/types"

interface PropertyDetailProps {
  propertyId: string
}

export default function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const { savedProperties, toggleSavedProperty, user } = useAppStore()
  const [property, setProperty] = useState<Property | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showContactDetails, setShowContactDetails] = useState(false)
  const router = useRouter()

  const isSaved = savedProperties.includes(propertyId)

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true)
        setError(null)

        const foundProperty = await api.getProperty(propertyId)

        if (!foundProperty) {
          setError("Property not found")
          return
        }

        setProperty(foundProperty)

        // Track property view
        await api.trackPropertyView(propertyId, user?.id)
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
  }, [propertyId, user?.id])

  const handleSave = async () => {
    toggleSavedProperty(propertyId)
  }

  const handleContact = (type: "phone" | "email" | "message") => {
    if (!property) return

    setShowContactDetails(true)
  }

  const handleScheduleTour = () => {
    alert("Tour scheduling feature coming soon!")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: `${window.location.origin}/property/${propertyId}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/property/${propertyId}`)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZM", {
      style: "currency",
      currency: "ZMW",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
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
          <Button onClick={() => router.back()} variant="outline">
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
    Parking: Car,
    "Pet Friendly": Shield,
    Concierge: Shield,
    "Rooftop Terrace": Building,
    "In-unit Laundry": Home,
    WiFi: Wifi,
    "Study Area": Building,
    "Bike Storage": Building,
    Backyard: Trees,
    Garage: Car,
    Dishwasher: Home,
    AC: Building,
    Fireplace: Home,
    "High Ceilings": Building,
    "Exposed Brick": Building,
    Garden: Trees,
    Security: Shield,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
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
                  src={property.images?.[currentImageIndex] || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />

                {property.images && property.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
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
              </div>

              {property.images && property.images.length > 1 && (
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
                    <div className="text-3xl font-bold text-green-600">{formatPrice(property.price)}</div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
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
                    <span className="text-sm">{property.squareFootage || property.area} sq ft</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{property.parkingSpaces} parking</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">
                      {property.rating} ({property.reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="neighborhood">Area</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About this property</h3>
                      <p className="text-gray-600 leading-relaxed">{property.description}</p>
                    </div>

                    {property.features && (
                      <div>
                        <h3 className="font-semibold mb-2">Key Features</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {property.features.appliances?.map((appliance, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Home className="h-4 w-4 text-gray-400" />
                              {appliance}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="amenities" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities?.map((amenity) => {
                        const IconComponent = amenityIcons[amenity] || Building
                        return (
                          <div key={amenity} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-lg">
                            <IconComponent className="h-4 w-4 text-gray-400" />
                            {amenity}
                          </div>
                        )
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="font-semibold">Property Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Property Type:</span>
                            <span className="capitalize">{property.propertyType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Lease Terms:</span>
                            <span>{property.leaseTerms || "12 months"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pet Policy:</span>
                            <span>{property.petPolicy || "No pets"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Furnished:</span>
                            <span>{property.furnished ? "Yes" : "No"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Available From:</span>
                            <span>{property.availableFrom || "Immediately"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold">Building Details</h3>
                        <div className="space-y-2 text-sm">
                          {property.features && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Heating:</span>
                                <span>{property.features.heating || "Central"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Cooling:</span>
                                <span>{property.features.cooling || "AC"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Building Age:</span>
                                <span>{property.features.buildingAge || "Modern"} years</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Floor Level:</span>
                                <span>{property.features.floorLevel || "Ground"}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="neighborhood" className="space-y-4">
                    {property.neighborhood && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Neighborhood: {property.neighborhood.name}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="font-semibold text-lg">{property.neighborhood.walkScore}/100</div>
                              <div className="text-gray-600">Walk Score</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="font-semibold text-lg">{property.neighborhood.transitScore}/100</div>
                              <div className="text-gray-600">Transit Score</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="font-semibold text-lg capitalize">{property.neighborhood.crimeRate}</div>
                              <div className="text-gray-600">Crime Rate</div>
                            </div>
                          </div>
                        </div>

                        {property.neighborhood.transportation && (
                          <div>
                            <h4 className="font-semibold mb-2">Transportation</h4>
                            <div className="space-y-2">
                              {property.neighborhood.transportation.map((transport, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {transport.name} ({transport.type})
                                  </span>
                                  <span className="text-gray-600">
                                    {transport.distance} • {transport.walkTime} min walk
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Analytics */}
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
                        {property.landlord.rating} • {property.landlord.totalProperties} properties
                        {property.landlord.verified && (
                          <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Responds in {property.landlord.responseTime}
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => handleContact("message")}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Landlord
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

                  {showContactDetails && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-blue-900">Contact Details</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowContactDetails(false)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✕
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 bg-white rounded border">
                          <Phone className="h-4 w-4 text-blue-600" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-600">Phone</div>
                            <div className="font-medium">{property.landlord.phone}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`tel:${property.landlord.phone}`)}
                          >
                            Call
                          </Button>
                        </div>

                        <div className="flex items-center gap-3 p-2 bg-white rounded border">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-600">Email</div>
                            <div className="font-medium">{property.landlord.email}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`mailto:${property.landlord.email}`)}
                          >
                            Email
                          </Button>
                        </div>

                        {property.landlord.whatsapp && (
                          <div className="flex items-center gap-3 p-2 bg-white rounded border">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                            <div className="flex-1">
                              <div className="text-sm text-gray-600">WhatsApp</div>
                              <div className="font-medium">{property.landlord.whatsapp}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(`https://wa.me/${property.landlord.whatsapp?.replace(/\D/g, "")}`)
                              }
                            >
                              Message
                            </Button>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 mt-2">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Best time to contact: {property.landlord.contactHours || "9 AM - 6 PM"}
                        </div>
                      </div>
                    </div>
                  )}
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

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  TrendingUp,
  Users,
  GraduationCap,
  Hospital,
  ShoppingBag,
  Utensils,
  Trees,
  Bus,
  Plane,
  Banknote,
  Shield,
  Car,
  Home,
  BarChart3,
  Info,
  ExternalLink,
  Navigation,
  Clock,
  Star,
} from "lucide-react"
import type { NeighborhoodInfo, MarketInsight } from "@/lib/types"

interface NeighborhoodInsightsProps {
  location: string
  neighborhood?: NeighborhoodInfo
  className?: string
}

export default function NeighborhoodInsights({ location, neighborhood, className }: NeighborhoodInsightsProps) {
  const [marketData, setMarketData] = useState<MarketInsight | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<"overview" | "amenities" | "transport" | "market">(
    "overview",
  )

  // Mock neighborhood data if not provided
  const defaultNeighborhood: NeighborhoodInfo = {
    name: location,
    walkScore: 78,
    transitScore: 65,
    bikeScore: 42,
    crimeRate: "low",
    averageRent: 4200,
    priceChange: "+5.2%",
    demographics: {
      averageAge: 32,
      families: 45,
      professionals: 55,
    },
    amenities: {
      restaurants: 24,
      schools: 8,
      hospitals: 3,
      shopping: 12,
      parks: 6,
    },
    transportation: [
      { type: "Bus Stop", name: "Main Street Stop", distance: "2 min walk", walkTime: 2 },
      { type: "Taxi Rank", name: "Central Taxi Rank", distance: "5 min walk", walkTime: 5 },
      { type: "Airport", name: "Kenneth Kaunda International", distance: "25 min drive", walkTime: 0 },
    ],
  }

  const neighborhoodData = neighborhood || defaultNeighborhood

  useEffect(() => {
    // Simulate loading market data
    const loadMarketData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMarketData({
        location,
        averagePrice: neighborhoodData.averageRent,
        priceChange: Number.parseFloat(neighborhoodData.priceChange.replace("%", "").replace("+", "")),
        totalListings: 145,
        averageDaysOnMarket: 28,
        mostPopularType: "apartment",
        trends: [
          { month: "Jan 2024", averagePrice: 4000, listings: 120 },
          { month: "Feb 2024", averagePrice: 4100, listings: 135 },
          { month: "Mar 2024", averagePrice: 4200, listings: 145 },
        ],
      })
      setIsLoading(false)
    }

    loadMarketData()
  }, [location, neighborhoodData])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-blue-600 bg-blue-50"
    if (score >= 40) return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  const getScoreLabel = (score: number, type: "walk" | "transit" | "bike") => {
    if (type === "walk") {
      if (score >= 90) return "Walker's Paradise"
      if (score >= 70) return "Very Walkable"
      if (score >= 50) return "Somewhat Walkable"
      if (score >= 25) return "Car-Dependent"
      return "Car-Dependent"
    }
    if (type === "transit") {
      if (score >= 90) return "Excellent Transit"
      if (score >= 70) return "Good Transit"
      if (score >= 50) return "Some Transit"
      if (score >= 25) return "Minimal Transit"
      return "Minimal Transit"
    }
    if (type === "bike") {
      if (score >= 90) return "Biker's Paradise"
      if (score >= 70) return "Very Bikeable"
      if (score >= 50) return "Bikeable"
      if (score >= 25) return "Somewhat Bikeable"
      return "Not Bikeable"
    }
    return ""
  }

  const getCrimeRateColor = (rate: string) => {
    switch (rate.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-orange-600 bg-orange-50"
      case "high":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", {
      style: "currency",
      currency: "ZMW",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading neighborhood insights...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Neighborhood Insights
        </CardTitle>
        <CardDescription>Discover what makes {neighborhoodData.name} special</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: "overview", label: "Overview", icon: Home },
            { id: "amenities", label: "Amenities", icon: ShoppingBag },
            { id: "transport", label: "Transport", icon: Bus },
            { id: "market", label: "Market", icon: BarChart3 },
          ].map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {selectedCategory === "overview" && (
          <div className="space-y-6">
            {/* Walkability Scores */}
            <div className="grid grid-cols-3 gap-4">
              <div className={`text-center p-4 rounded-lg ${getScoreColor(neighborhoodData.walkScore)}`}>
                <div className="text-2xl font-bold">{neighborhoodData.walkScore}</div>
                <div className="text-sm font-medium">Walk Score</div>
                <div className="text-xs mt-1">{getScoreLabel(neighborhoodData.walkScore, "walk")}</div>
              </div>
              <div className={`text-center p-4 rounded-lg ${getScoreColor(neighborhoodData.transitScore)}`}>
                <div className="text-2xl font-bold">{neighborhoodData.transitScore}</div>
                <div className="text-sm font-medium">Transit Score</div>
                <div className="text-xs mt-1">{getScoreLabel(neighborhoodData.transitScore, "transit")}</div>
              </div>
              <div className={`text-center p-4 rounded-lg ${getScoreColor(neighborhoodData.bikeScore)}`}>
                <div className="text-2xl font-bold">{neighborhoodData.bikeScore}</div>
                <div className="text-sm font-medium">Bike Score</div>
                <div className="text-xs mt-1">{getScoreLabel(neighborhoodData.bikeScore, "bike")}</div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Average Rent</h4>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(neighborhoodData.averageRent)}</div>
                <div className="text-sm text-green-600">{neighborhoodData.priceChange} vs last year</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Safety Rating</h4>
                  <Shield className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`capitalize ${getCrimeRateColor(neighborhoodData.crimeRate)}`}>
                    {neighborhoodData.crimeRate} Crime
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mt-1">Crime Rate</div>
              </div>
            </div>

            {/* Demographics */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Demographics
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900">{neighborhoodData.demographics.averageAge}</div>
                  <div className="text-sm text-gray-600">Average Age</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{neighborhoodData.demographics.families}%</div>
                  <div className="text-sm text-gray-600">Families</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{neighborhoodData.demographics.professionals}%</div>
                  <div className="text-sm text-gray-600">Professionals</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Amenities Tab */}
        {selectedCategory === "amenities" && (
          <div className="space-y-4">
            <h4 className="font-medium">Nearby Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  key: "restaurants",
                  label: "Restaurants",
                  icon: Utensils,
                  count: neighborhoodData.amenities.restaurants,
                },
                { key: "schools", label: "Schools", icon: GraduationCap, count: neighborhoodData.amenities.schools },
                { key: "hospitals", label: "Hospitals", icon: Hospital, count: neighborhoodData.amenities.hospitals },
                { key: "shopping", label: "Shopping", icon: ShoppingBag, count: neighborhoodData.amenities.shopping },
                { key: "parks", label: "Parks", icon: Trees, count: neighborhoodData.amenities.parks },
                { key: "banks", label: "Banks/ATMs", icon: Banknote, count: 8 },
              ].map((amenity) => {
                const Icon = amenity.icon
                return (
                  <div
                    key={amenity.key}
                    className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-medium text-lg">{amenity.count}</div>
                    <div className="text-sm text-gray-600">{amenity.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Amenity Details */}
            <div className="space-y-3">
              <h5 className="font-medium">Popular Spots</h5>
              <div className="space-y-2">
                {[
                  { name: "Manda Hill Shopping Centre", type: "Shopping", distance: "5 min drive", rating: 4.2 },
                  { name: "University of Zambia", type: "Education", distance: "10 min drive", rating: 4.0 },
                  { name: "Lusaka Central Hospital", type: "Healthcare", distance: "8 min drive", rating: 3.8 },
                  { name: "Independence Stadium", type: "Recreation", distance: "12 min drive", rating: 4.1 },
                ].map((spot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-sm">{spot.name}</div>
                        <div className="text-xs text-gray-600">{spot.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        {spot.rating}
                      </div>
                      <div className="text-xs text-gray-600">{spot.distance}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transportation Tab */}
        {selectedCategory === "transport" && (
          <div className="space-y-4">
            <h4 className="font-medium">Transportation Options</h4>
            <div className="space-y-3">
              {neighborhoodData.transportation.map((transport, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      {transport.type === "Bus Stop" && <Bus className="h-4 w-4 text-blue-600" />}
                      {transport.type === "Taxi Rank" && <Car className="h-4 w-4 text-green-600" />}
                      {transport.type === "Airport" && <Plane className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{transport.name}</div>
                      <div className="text-xs text-gray-600">{transport.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{transport.distance}</div>
                    {transport.walkTime > 0 && (
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {transport.walkTime} min walk
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Commute Times */}
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-3">Average Commute Times</h5>
              <div className="space-y-3">
                {[
                  { destination: "City Centre", time: "15 min", method: "Car" },
                  { destination: "Airport", time: "25 min", method: "Car" },
                  { destination: "University", time: "20 min", method: "Bus" },
                  { destination: "Industrial Area", time: "30 min", method: "Car" },
                ].map((commute, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{commute.destination}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{commute.time}</div>
                      <div className="text-xs text-gray-600">by {commute.method}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Market Tab */}
        {selectedCategory === "market" && marketData && (
          <div className="space-y-6">
            {/* Market Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Market Activity</h4>
                <div className="text-2xl font-bold text-gray-900">{marketData.totalListings}</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Time on Market</h4>
                <div className="text-2xl font-bold text-gray-900">{marketData.averageDaysOnMarket}</div>
                <div className="text-sm text-gray-600">Days Average</div>
              </div>
            </div>

            {/* Price Trends */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Price Trends</h4>
              <div className="space-y-3">
                {marketData.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{trend.month}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatCurrency(trend.averagePrice)}</div>
                      <div className="text-xs text-gray-500">{trend.listings} listings</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Prices increased by {marketData.priceChange}% this year
                  </span>
                </div>
              </div>
            </div>

            {/* Property Types */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Popular Property Types</h4>
              <div className="space-y-2">
                {[
                  { type: "Apartment", percentage: 45, count: 65 },
                  { type: "House", percentage: 30, count: 44 },
                  { type: "Condo", percentage: 15, count: 22 },
                  { type: "Townhouse", percentage: 10, count: 14 },
                ].map((propertyType, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{propertyType.type}</span>
                      <span>
                        {propertyType.count} listings ({propertyType.percentage}%)
                      </span>
                    </div>
                    <Progress value={propertyType.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Insights */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Investment Insights
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div>• High demand area with consistent price growth</div>
                <div>• Good rental yield potential for investors</div>
                <div>• Strong infrastructure development planned</div>
                <div>• Popular with young professionals and families</div>
              </div>
            </div>
          </div>
        )}

        {/* External Links */}
        <div className="pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Map
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <BarChart3 className="h-4 w-4 mr-2" />
              Market Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

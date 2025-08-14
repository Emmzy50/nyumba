"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Calculator,
  Bell,
  MapPin,
  Video,
  BarChart3,
  TrendingUp,
  Home,
  Sparkles,
  Zap,
  Shield,
  Users,
  MessageSquare,
  Star,
} from "lucide-react"

import AdvancedSearch from "./advanced-search"
import PropertyCard from "./property-card"
import VirtualTour from "./virtual-tour"
import MortgageCalculator from "./mortgage-calculator"
import PropertyAlerts from "./property-alerts"
import NeighborhoodInsights from "./neighborhood-insights"
import { useAppStore } from "@/lib/store"
import { mockProperties } from "@/lib/api"

export default function EnhancedFeatures() {
  const { searchResults, setSearchResults } = useAppStore()
  const [selectedProperty, setSelectedProperty] = useState(mockProperties[0])

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results)
  }

  const features = [
    {
      id: "search",
      title: "Advanced Search & Filtering",
      description: "Smart filters with price sliders, amenity selection, and location-based search",
      icon: Search,
      color: "bg-blue-50 text-blue-600",
      benefits: ["Save time with precise filtering", "Find exactly what you need", "Smart recommendations"],
    },
    {
      id: "virtual-tours",
      title: "Virtual Tours & 360° Views",
      description: "Immersive property viewing experience from anywhere",
      icon: Video,
      color: "bg-purple-50 text-purple-600",
      benefits: ["View properties remotely", "Interactive exploration", "Save travel time"],
    },
    {
      id: "calculator",
      title: "Financial Tools & Calculators",
      description: "Mortgage calculator, affordability analysis, and payment breakdowns",
      icon: Calculator,
      color: "bg-green-50 text-green-600",
      benefits: ["Plan your budget", "Compare financing options", "Make informed decisions"],
    },
    {
      id: "alerts",
      title: "Smart Property Alerts",
      description: "Get notified instantly when properties match your criteria",
      icon: Bell,
      color: "bg-orange-50 text-orange-600",
      benefits: ["Never miss opportunities", "Customizable notifications", "Real-time updates"],
    },
    {
      id: "insights",
      title: "Neighborhood Intelligence",
      description: "Detailed area insights including walkability, amenities, and market trends",
      icon: MapPin,
      color: "bg-indigo-50 text-indigo-600",
      benefits: ["Know your area", "Market intelligence", "Lifestyle compatibility"],
    },
    {
      id: "analytics",
      title: "Market Analytics",
      description: "Real-time market data, price trends, and investment insights",
      icon: BarChart3,
      color: "bg-teal-50 text-teal-600",
      benefits: ["Market intelligence", "Investment guidance", "Price predictions"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Enhanced Real Estate Experience</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover advanced features designed to make your property search smarter, faster, and more efficient. From
              AI-powered recommendations to virtual tours, we've got everything you need.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure & Verified
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                15K+ Users
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Interactive Demo */}
        <Tabs defaultValue="search" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-6">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </TabsTrigger>
              <TabsTrigger value="tours" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Tours</span>
              </TabsTrigger>
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Calculator</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Results</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="search" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Advanced Property Search</h3>
              <p className="text-gray-600">Use our intelligent search system to find your perfect property</p>
            </div>
            <AdvancedSearch onSearch={handleSearchResults} />
          </TabsContent>

          <TabsContent value="tours" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Virtual Property Tours</h3>
              <p className="text-gray-600">Experience properties with immersive 360° virtual tours</p>
            </div>
            {selectedProperty.virtualTour && (
              <VirtualTour tour={selectedProperty.virtualTour} propertyTitle={selectedProperty.title} />
            )}
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mortgage Calculator</h3>
              <p className="text-gray-600">Calculate your monthly payments and explore financing options</p>
            </div>
            <MortgageCalculator />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Property Alerts</h3>
              <p className="text-gray-600">Get notified when properties matching your criteria become available</p>
            </div>
            <PropertyAlerts />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Neighborhood Insights</h3>
              <p className="text-gray-600">Discover detailed information about areas and communities</p>
            </div>
            <NeighborhoodInsights location="Lusaka Central" neighborhood={selectedProperty.neighborhood} />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h3>
              <p className="text-gray-600">
                {searchResults.length > 0
                  ? `Found ${searchResults.length} properties matching your criteria`
                  : "Use the search feature to see results here"}
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {searchResults.slice(0, 4).map((property) => (
                  <PropertyCard key={property.id} property={property} variant="list" showAnalytics={true} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockProperties.slice(0, 2).map((property) => (
                  <PropertyCard key={property.id} property={property} variant="list" showAnalytics={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Platform Statistics</h3>
            <p className="text-gray-600">See how our enhanced features are helping users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-sm text-gray-600">Properties Listed</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+15% this month</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15,000+</div>
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+22% this month</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">850+</div>
              <div className="text-sm text-gray-600">Virtual Tours</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+45% this month</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
              <div className="text-sm text-gray-600">User Rating</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">Based on 1,200+ reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Experience the Future of Real Estate?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who are already using our advanced features to find their perfect properties
              faster and smarter.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" variant="secondary">
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Searching
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Video className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Eye, MessageSquare, Bookmark, Users, ArrowUp, ArrowDown } from "lucide-react"
import { getPropertiesByLandlord, type Property } from "./lib/property-store"

interface AnalyticsDashboardProps {
  landlordEmail: string
}

export default function AnalyticsDashboard({ landlordEmail }: AnalyticsDashboardProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedProperty, setSelectedProperty] = useState("all")

  useEffect(() => {
    const landlordProperties = getPropertiesByLandlord(landlordEmail)
    setProperties(landlordProperties)
  }, [landlordEmail])

  // Calculate aggregate metrics
  const totalViews = properties.reduce((sum, p) => sum + (p.analytics?.views || 0), 0)
  const totalInquiries = properties.reduce((sum, p) => sum + (p.analytics?.inquiries || 0), 0)
  const totalSaves = properties.reduce((sum, p) => sum + (p.analytics?.saves || 0), 0)
  const totalApplications = properties.reduce((sum, p) => sum + (p.analytics?.applications || 0), 0)

  const metrics = [
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Inquiries",
      value: totalInquiries.toLocaleString(),
      change: "+8%",
      trend: "up",
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      title: "Saves",
      value: totalSaves.toLocaleString(),
      change: "+15%",
      trend: "up",
      icon: Bookmark,
      color: "text-purple-600",
    },
    {
      title: "Applications",
      value: totalApplications.toLocaleString(),
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  if (properties.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-600">Add some properties to start tracking analytics.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your property performance and tenant engagement</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <div className="flex items-center mt-1">
                      {metric.trend === "up" ? (
                        <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-xs font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {metric.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">vs last period</span>
                    </div>
                  </div>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Property Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Property Performance</CardTitle>
          <CardDescription>Individual property metrics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.location}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant={property.available ? "default" : "secondary"}>
                        {property.available ? "Available" : "Rented"}
                      </Badge>
                      {property.analytics?.trending && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          🔥 Trending
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">${property.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{property.analytics?.views || 0}</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{property.analytics?.inquiries || 0}</div>
                    <div className="text-sm text-gray-600">Inquiries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{property.analytics?.saves || 0}</div>
                    <div className="text-sm text-gray-600">Saves</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{property.analytics?.applications || 0}</div>
                    <div className="text-sm text-gray-600">Applications</div>
                  </div>
                </div>

                {property.analytics?.performanceScore && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Performance Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${property.analytics.performanceScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{property.analytics.performanceScore}/100</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
          <CardDescription>AI-powered suggestions to improve your property performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">High Performing Properties</h4>
                <p className="text-sm text-blue-800">
                  Your properties with modern amenities are getting 40% more views. Consider highlighting these features
                  in other listings.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Response Time Impact</h4>
                <p className="text-sm text-green-800">
                  Properties where you respond within 2 hours get 60% more applications. Keep up the quick responses!
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <Eye className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900">Photo Optimization</h4>
                <p className="text-sm text-orange-800">
                  Properties with 5+ high-quality photos get 25% more inquiries. Consider adding more photos to
                  underperforming listings.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

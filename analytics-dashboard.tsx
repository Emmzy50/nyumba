"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Eye,
  MessageSquare,
  Bookmark,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Building,
  Star,
} from "lucide-react"
import { getLandlordAnalyticsSummary, type Property } from "./lib/property-store"

interface AnalyticsDashboardProps {
  landlordEmail: string
}

export default function AnalyticsDashboard({ landlordEmail }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("30")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const data = getLandlordAnalyticsSummary(landlordEmail)
        setAnalyticsData(data)
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [landlordEmail, timeRange])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analyticsData || analyticsData.totalProperties === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-600 mb-4">You need to have active property listings to view analytics data.</p>
            <Button onClick={() => (window.location.href = "#add-property")}>Add Your First Property</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const overviewStats = [
    {
      label: "Total Views",
      value: analyticsData.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-600",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Total Inquiries",
      value: analyticsData.totalInquiries.toString(),
      icon: MessageSquare,
      color: "text-green-600",
      change: "+8%",
      trend: "up",
    },
    {
      label: "Properties Saved",
      value: analyticsData.totalSaves.toString(),
      icon: Bookmark,
      color: "text-purple-600",
      change: "+15%",
      trend: "up",
    },
    {
      label: "Applications",
      value: analyticsData.totalApplications.toString(),
      icon: Users,
      color: "text-orange-600",
      change: "+5%",
      trend: "up",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your property performance and tenant engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>Individual property analytics and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.properties.map((property: Property) => (
                <div key={property.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">${property.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">per month</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-blue-600">
                        <Eye className="h-4 w-4" />
                        {property.analytics?.views || 0}
                      </div>
                      <div className="text-xs text-gray-600">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-green-600">
                        <MessageSquare className="h-4 w-4" />
                        {property.analytics?.inquiries || 0}
                      </div>
                      <div className="text-xs text-gray-600">Inquiries</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-purple-600">
                        <Bookmark className="h-4 w-4" />
                        {property.analytics?.saves || 0}
                      </div>
                      <div className="text-xs text-gray-600">Saves</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-orange-600">
                        <Users className="h-4 w-4" />
                        {property.analytics?.applications || 0}
                      </div>
                      <div className="text-xs text-gray-600">Applications</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant={property.available ? "default" : "secondary"}>
                        {property.available ? "Available" : "Unavailable"}
                      </Badge>
                      {property.analytics?.trending && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          🔥 Trending
                        </Badge>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                        {property.analytics?.performanceScore || 0}/100
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = `/property/${property.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Performance Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${analyticsData.avgPerformanceScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{analyticsData.avgPerformanceScore}/100</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-semibold">{(analyticsData.avgConversionRate * 100).toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trending Properties</span>
                <span className="text-sm font-semibold">{analyticsData.trendingProperties}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Properties</span>
                <span className="text-sm font-semibold">{analyticsData.totalProperties}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>New inquiry received</span>
                  <span className="text-gray-500 ml-auto">2h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Property viewed 15 times</span>
                  <span className="text-gray-500 ml-auto">4h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Property saved by user</span>
                  <span className="text-gray-500 ml-auto">6h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>New application submitted</span>
                  <span className="text-gray-500 ml-auto">1d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Building className="mr-2 h-4 w-4" />
                Add New Property
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Messages
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Tours
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

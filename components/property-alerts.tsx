"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Mail,
  Smartphone,
  Settings,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { PropertyAlert, SearchCriteria } from "@/lib/types"

interface NewAlertForm {
  name: string
  location: string
  priceRange: [number, number]
  propertyTypes: string[]
  bedrooms: number[]
  amenities: string[]
  furnished?: boolean
  petFriendly?: boolean
  frequency: "instant" | "daily" | "weekly"
  keywords: string
}

export default function PropertyAlerts() {
  const { propertyAlerts, addPropertyAlert, updatePropertyAlert, deletePropertyAlert, user } = useAppStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAlert, setEditingAlert] = useState<string | null>(null)
  const [newAlert, setNewAlert] = useState<NewAlertForm>({
    name: "",
    location: "",
    priceRange: [2000, 8000],
    propertyTypes: [],
    bedrooms: [],
    amenities: [],
    furnished: undefined,
    petFriendly: undefined,
    frequency: "daily",
    keywords: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    quietHours: { start: "22:00", end: "08:00" },
    maxPerDay: 5,
  })

  // Mock recent matches for demonstration
  const recentMatches = [
    {
      alertId: "1",
      alertName: "2BR Apartment in Lusaka",
      matches: [
        { id: "1", title: "Modern Downtown Apartment", price: 4500, location: "Lusaka Central" },
        { id: "2", title: "Cozy City Apartment", price: 3800, location: "Lusaka Central" },
      ],
      timestamp: "2024-01-20T10:30:00Z",
    },
  ]

  const amenityOptions = [
    "High-Speed WiFi",
    "Parking Space",
    "Gym/Fitness Center",
    "Swimming Pool",
    "Garden/Balcony",
    "24/7 Security",
    "Air Conditioning",
    "Elevator Access",
  ]

  const handleCreateAlert = () => {
    if (!newAlert.name.trim()) return

    const alert: PropertyAlert = {
      id: Date.now().toString(),
      userId: user?.id || "",
      name: newAlert.name,
      criteria: {
        location: newAlert.location || undefined,
        priceRange: newAlert.priceRange,
        propertyTypes: newAlert.propertyTypes.length > 0 ? newAlert.propertyTypes : undefined,
        bedrooms: newAlert.bedrooms.length > 0 ? newAlert.bedrooms : undefined,
        amenities: newAlert.amenities.length > 0 ? newAlert.amenities : undefined,
        furnished: newAlert.furnished,
        petFriendly: newAlert.petFriendly,
        keywords: newAlert.keywords || undefined,
      },
      frequency: newAlert.frequency,
      active: true,
      createdAt: new Date().toISOString(),
      matchCount: 0,
    }

    addPropertyAlert(alert)
    setNewAlert({
      name: "",
      location: "",
      priceRange: [2000, 8000],
      propertyTypes: [],
      bedrooms: [],
      amenities: [],
      furnished: undefined,
      petFriendly: undefined,
      frequency: "daily",
      keywords: "",
    })
    setShowCreateForm(false)
  }

  const handleToggleAlert = (alertId: string, active: boolean) => {
    updatePropertyAlert(alertId, { active })
  }

  const handleDeleteAlert = (alertId: string) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      deletePropertyAlert(alertId)
    }
  }

  const togglePropertyType = (type: string) => {
    setNewAlert((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }))
  }

  const toggleBedrooms = (bedrooms: number) => {
    setNewAlert((prev) => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(bedrooms)
        ? prev.bedrooms.filter((b) => b !== bedrooms)
        : [...prev.bedrooms, bedrooms],
    }))
  }

  const toggleAmenity = (amenity: string) => {
    setNewAlert((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const formatCriteria = (criteria: SearchCriteria) => {
    const parts = []

    if (criteria.location) parts.push(criteria.location)
    if (criteria.priceRange)
      parts.push(`ZMW ${criteria.priceRange[0].toLocaleString()} - ${criteria.priceRange[1].toLocaleString()}`)
    if (criteria.propertyTypes?.length) parts.push(criteria.propertyTypes.join(", "))
    if (criteria.bedrooms?.length) parts.push(`${criteria.bedrooms.join(", ")} bedrooms`)
    if (criteria.amenities?.length) parts.push(`${criteria.amenities.length} amenities`)

    return parts.join(" • ") || "All properties"
  }

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "instant":
        return <Bell className="h-3 w-3" />
      case "daily":
        return <Calendar className="h-3 w-3" />
      case "weekly":
        return <Clock className="h-3 w-3" />
      default:
        return <Bell className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Alerts</h2>
          <p className="text-gray-600">Get notified when properties matching your criteria become available</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Matches
            </CardTitle>
            <CardDescription>New properties that match your alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <div key={match.alertId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{match.alertName}</h4>
                    <Badge variant="secondary">
                      {match.matches.length} new match{match.matches.length > 1 ? "es" : ""}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {match.matches.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-sm">{property.title}</div>
                          <div className="text-xs text-gray-600">{property.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">ZMW {property.price.toLocaleString()}</div>
                          <Button variant="outline" size="sm" className="mt-1 bg-transparent">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(match.timestamp).toLocaleDateString()} at {new Date(match.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Alert Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>Set up criteria to get notified about matching properties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alertName">Alert Name *</Label>
                <Input
                  id="alertName"
                  placeholder="e.g., 2BR Apartment in Lusaka"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertLocation">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="alertLocation"
                    placeholder="City, neighborhood, or area"
                    value={newAlert.location}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, location: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (Optional)</Label>
              <Input
                id="keywords"
                placeholder="Specific features, amenities, or descriptions"
                value={newAlert.keywords}
                onChange={(e) => setNewAlert((prev) => ({ ...prev, keywords: e.target.value }))}
              />
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label>Price Range (ZMW)</Label>
              <div className="px-3">
                <Slider
                  value={newAlert.priceRange}
                  onValueChange={(value) => setNewAlert((prev) => ({ ...prev, priceRange: value as [number, number] }))}
                  max={20000}
                  min={500}
                  step={100}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>ZMW {newAlert.priceRange[0].toLocaleString()}</span>
                <span>ZMW {newAlert.priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Property Types */}
            <div className="space-y-3">
              <Label>Property Types</Label>
              <div className="flex flex-wrap gap-2">
                {["apartment", "house", "condo", "townhouse", "studio", "boarding-house"].map((type) => (
                  <Badge
                    key={type}
                    variant={newAlert.propertyTypes.includes(type) ? "default" : "outline"}
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
              <Label>Bedrooms</Label>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5].map((bedrooms) => (
                  <Badge
                    key={bedrooms}
                    variant={newAlert.bedrooms.includes(bedrooms) ? "default" : "outline"}
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
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenityOptions.map((amenity) => (
                  <div
                    key={amenity}
                    className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                      newAlert.amenities.includes(amenity) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                    }`}
                    onClick={() => toggleAmenity(amenity)}
                  >
                    <span
                      className={`text-sm ${newAlert.amenities.includes(amenity) ? "text-blue-900 font-medium" : "text-gray-700"}`}
                    >
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="space-y-3">
              <Label>Additional Preferences</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pet Friendly</span>
                  <Switch
                    checked={newAlert.petFriendly === true}
                    onCheckedChange={(checked) =>
                      setNewAlert((prev) => ({ ...prev, petFriendly: checked ? true : undefined }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Furnished</span>
                  <Switch
                    checked={newAlert.furnished === true}
                    onCheckedChange={(checked) =>
                      setNewAlert((prev) => ({ ...prev, furnished: checked ? true : undefined }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Alert Frequency</Label>
              <Select
                value={newAlert.frequency}
                onValueChange={(value: "instant" | "daily" | "weekly") =>
                  setNewAlert((prev) => ({ ...prev, frequency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant (as soon as available)</SelectItem>
                  <SelectItem value="daily">Daily digest</SelectItem>
                  <SelectItem value="weekly">Weekly summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleCreateAlert} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Your Alerts ({propertyAlerts.length})</CardTitle>
          <CardDescription>Manage your property search alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {propertyAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts yet</h3>
              <p className="text-gray-600 mb-4">Create your first alert to get notified about matching properties</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Alert
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {propertyAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-lg">{alert.name}</h4>
                        <Badge variant={alert.active ? "default" : "secondary"}>
                          {alert.active ? "Active" : "Paused"}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          {getFrequencyIcon(alert.frequency)}
                          <span className="capitalize">{alert.frequency}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{formatCriteria(alert.criteria)}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Created {new Date(alert.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {alert.matchCount} matches found
                        </span>
                        {alert.lastTriggered && (
                          <>
                            <span>•</span>
                            <span>Last triggered {new Date(alert.lastTriggered).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.active}
                        onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => setEditingAlert(alert.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAlert(alert.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure how and when you receive alert notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Methods */}
          <div className="space-y-4">
            <h4 className="font-medium">Notification Methods</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive alerts via email</div>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, email: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-gray-600">Receive alerts via text message</div>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.sms}
                  onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, sms: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-600">Receive alerts in your browser</div>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.push}
                  onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, push: checked }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Quiet Hours */}
          <div className="space-y-4">
            <h4 className="font-medium">Quiet Hours</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quietStart">Start Time</Label>
                <Input
                  id="quietStart"
                  type="time"
                  value={notificationSettings.quietHours.start}
                  onChange={(e) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quietEnd">End Time</Label>
                <Input
                  id="quietEnd"
                  type="time"
                  value={notificationSettings.quietHours.end}
                  onChange={(e) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              No notifications will be sent during these hours (except for instant alerts)
            </p>
          </div>

          <Separator />

          {/* Rate Limiting */}
          <div className="space-y-4">
            <h4 className="font-medium">Rate Limiting</h4>
            <div className="space-y-2">
              <Label htmlFor="maxPerDay">Maximum notifications per day</Label>
              <Select
                value={notificationSettings.maxPerDay.toString()}
                onValueChange={(value) => setNotificationSettings((prev) => ({ ...prev, maxPerDay: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 notification</SelectItem>
                  <SelectItem value="3">3 notifications</SelectItem>
                  <SelectItem value="5">5 notifications</SelectItem>
                  <SelectItem value="10">10 notifications</SelectItem>
                  <SelectItem value="999">Unlimited</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">Prevent notification overload by limiting daily alerts</p>
            </div>
          </div>

          {/* Save Settings */}
          <div className="pt-4 border-t">
            <Button className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Save Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

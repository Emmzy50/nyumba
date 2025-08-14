"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { User, Phone, Mail, MessageCircle, Camera, Save, Shield, Bell, Eye, MapPin, CheckCircle } from "lucide-react"
import { getCurrentUser, updateUserProfile, type User as UserType } from "./lib/auth-utils"

// Import the verification components at the top
import VerificationStatus from "./verification-status"

interface ContactInfo {
  phone: string
  whatsapp: string
  email: string
  showPhone: boolean
  showWhatsapp: boolean
  showEmail: boolean
}

interface ProfileFormData {
  name: string
  bio: string
  location: string
  contactInfo: ContactInfo
}

export function ProfileManagement() {
  const [user, setUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    bio: "",
    location: "",
    contactInfo: {
      phone: "",
      whatsapp: "",
      email: "",
      showPhone: true,
      showWhatsapp: true,
      showEmail: true,
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setFormData({
        name: currentUser.name || "",
        bio: currentUser.bio || "",
        location: "", // Add location to user type if needed
        contactInfo: {
          phone: currentUser.phone || "",
          whatsapp: "", // Add whatsapp to user type if needed
          email: currentUser.email || "",
          showPhone: true,
          showWhatsapp: true,
          showEmail: true,
        },
      })
    }
  }, [])

  const handleInputChange = (field: string, value: string | boolean, section?: string) => {
    setHasChanges(true)
    setSuccessMessage("")

    if (section === "contactInfo") {
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.contactInfo.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.contactInfo.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.contactInfo.phone && !/^\+?[\d\s\-$$$$]+$/.test(formData.contactInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (formData.contactInfo.whatsapp && !/^\+?[\d\s\-$$$$]+$/.test(formData.contactInfo.whatsapp)) {
      newErrors.whatsapp = "Please enter a valid WhatsApp number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update user profile
      const updatedUser = updateUserProfile({
        name: formData.name,
        bio: formData.bio,
        phone: formData.contactInfo.phone,
        email: formData.contactInfo.email,
      })

      if (updatedUser) {
        setUser(updatedUser)
        setHasChanges(false)
        setSuccessMessage("Profile updated successfully!")

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrors({ submit: "Failed to update profile. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAvatarUpload = () => {
    // In a real app, this would handle avatar upload
    alert("Avatar upload functionality would be implemented here")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and contact details</p>
        </div>
        {user.verified && (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        )}
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Your public profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                  onClick={handleAvatarUpload}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === "landlord" ? "default" : "secondary"}>
                        {user.role === "landlord" ? "Landlord" : "Tenant"}
                      </Badge>
                      <span className="text-sm text-gray-500">Member since {user.joinDate}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell others about yourself..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="min-h-[80px]"
                  />
                  <p className="text-sm text-gray-500">{formData.bio.length}/200 characters</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>How others can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    value={formData.contactInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value, "contactInfo")}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Show in public profile</span>
                  <Switch
                    checked={formData.contactInfo.showEmail}
                    onCheckedChange={(checked) => handleInputChange("showEmail", checked, "contactInfo")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+265 991 234 567"
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value, "contactInfo")}
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Show in public profile</span>
                  <Switch
                    checked={formData.contactInfo.showPhone}
                    onCheckedChange={(checked) => handleInputChange("showPhone", checked, "contactInfo")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+265 991 234 567"
                    className={`pl-10 ${errors.whatsapp ? "border-red-500" : ""}`}
                    value={formData.contactInfo.whatsapp}
                    onChange={(e) => handleInputChange("whatsapp", e.target.value, "contactInfo")}
                  />
                </div>
                {errors.whatsapp && <p className="text-sm text-red-600">{errors.whatsapp}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Show in public profile</span>
                  <Switch
                    checked={formData.contactInfo.showWhatsapp}
                    onCheckedChange={(checked) => handleInputChange("showWhatsapp", checked, "contactInfo")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="City, Country"
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500">General location (city/region only)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Control who can see your information and verify your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Verification Status */}
            <VerificationStatus
              user={user}
              onVerificationUpdate={() => {
                // Refresh user data after verification
                const updatedUser = getCurrentUser()
                if (updatedUser) {
                  setUser(updatedUser)
                }
              }}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">Profile Visibility</h4>
                    <p className="text-sm text-gray-600">Allow others to find your profile</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates about your account</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">Direct Messages</h4>
                    <p className="text-sm text-gray-600">Allow others to message you directly</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">{hasChanges && "You have unsaved changes"}</div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Reset form to original values
                if (user) {
                  setFormData({
                    name: user.name || "",
                    bio: user.bio || "",
                    location: "",
                    contactInfo: {
                      phone: user.phone || "",
                      whatsapp: "",
                      email: user.email || "",
                      showPhone: true,
                      showWhatsapp: true,
                      showEmail: true,
                    },
                  })
                  setHasChanges(false)
                  setErrors({})
                }
              }}
              disabled={!hasChanges}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !hasChanges} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProfileManagement

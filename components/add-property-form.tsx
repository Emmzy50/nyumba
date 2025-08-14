"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, MapPin, Home, FileText, Camera, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"
import { addProperty } from "@/lib/firebase/firestore"
import { uploadPropertyImages } from "@/lib/firebase/storage"
import { useAppStore } from "@/lib/store"
import type { Property } from "@/lib/types"

interface PropertyFormData {
  title: string
  location: string
  houseNumber: string
  price: string
  propertyType: string
  bedrooms: string
  bathrooms: string
  description: string
  images: File[]
}

export function AddPropertyForm() {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    location: "",
    houseNumber: "",
    price: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    images: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  const { user } = useAppStore()

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (error) setError(null)
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      errors.title = "Property title is required"
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required"
    }

    if (!formData.price.trim()) {
      errors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = "Please enter a valid price"
    }

    if (!formData.propertyType) {
      errors.propertyType = "Property type is required"
    }

    if (!formData.bedrooms) {
      errors.bedrooms = "Number of bedrooms is required"
    }

    if (!formData.bathrooms) {
      errors.bathrooms = "Number of bathrooms is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Property description is required"
    } else if (formData.description.length < 20) {
      errors.description = "Description must be at least 20 characters"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const newImages = Array.from(files).filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isUnder5MB = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isImage && isUnder5MB
    })

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 6), // Max 6 images
    }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateForm()) {
      setError("Please fix the errors above before submitting")
      return
    }

    if (!user) {
      setError("You must be logged in to add a property. Please sign in and try again.")
      return
    }

    console.log("Starting property submission...", { user: user.email, formData })
    setIsSubmitting(true)

    try {
      let imageUrls: string[] = []
      if (formData.images.length > 0) {
        console.log(`Uploading ${formData.images.length} images...`)
        try {
          imageUrls = await uploadPropertyImages(formData.images)
          console.log("Images uploaded successfully:", imageUrls)
        } catch (imageError) {
          console.error("Error uploading images:", imageError)
          setError("Failed to upload images. Please try again or contact support if the problem persists.")
          return
        }
      }

      const propertyData: Omit<Property, "id"> = {
        title: formData.title,
        location: formData.location,
        price: Number(formData.price),
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms === "studio" ? 0 : Number(formData.bedrooms.replace("+", "")),
        bathrooms: Number(formData.bathrooms.replace("+", "")),
        description: formData.description,
        images: imageUrls,
        area: 1000,
        amenities: [],
        landlord: {
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          avatar: user.avatar || "",
        },
        availableFrom: new Date().toISOString().split("T")[0],
        coordinates: { lat: 0, lng: 0 },
        virtualTour: "",
      }

      console.log("Saving property to database...", propertyData)
      const propertyId = await addProperty(propertyData)
      console.log("Property saved successfully with ID:", propertyId)

      setFormData({
        title: "",
        location: "",
        houseNumber: "",
        price: "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        description: "",
        images: [],
      })

      setSuccess("Property listed successfully! Your listing is now live and visible to potential tenants.")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error: any) {
      console.error("Error submitting property:", error)
      let errorMessage = "Failed to list property. Please try again."
      if (error.code === "permission-denied") {
        errorMessage = "You don't have permission to add properties. Please contact support."
      } else if (error.code === "unavailable") {
        errorMessage = "Service is temporarily unavailable. Please try again later."
      } else if (error.message?.includes("offline")) {
        errorMessage = "You appear to be offline. Please check your internet connection and try again."
      }
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600 mt-2">Create a new property listing for potential tenants</p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Essential details about your property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Modern 2BR Apartment Downtown"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={validationErrors.title ? "border-red-500" : ""}
                  required
                />
                {validationErrors.title && <p className="text-sm text-red-600">{validationErrors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                  required
                >
                  <SelectTrigger className={validationErrors.propertyType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="boarding-house">Boarding House</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.propertyType && (
                  <p className="text-sm text-red-600">{validationErrors.propertyType}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Select
                  value={formData.bedrooms}
                  onValueChange={(value) => handleInputChange("bedrooms", value)}
                  required
                >
                  <SelectTrigger className={validationErrors.bedrooms ? "border-red-500" : ""}>
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4">4 Bedrooms</SelectItem>
                    <SelectItem value="5+">5+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.bedrooms && <p className="text-sm text-red-600">{validationErrors.bedrooms}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Select
                  value={formData.bathrooms}
                  onValueChange={(value) => handleInputChange("bathrooms", value)}
                  required
                >
                  <SelectTrigger className={validationErrors.bathrooms ? "border-red-500" : ""}>
                    <SelectValue placeholder="Bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bathroom</SelectItem>
                    <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                    <SelectItem value="2">2 Bathrooms</SelectItem>
                    <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                    <SelectItem value="3">3 Bathrooms</SelectItem>
                    <SelectItem value="3+">3+ Bathrooms</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.bathrooms && <p className="text-sm text-red-600">{validationErrors.bathrooms}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Monthly Rent (ZMW) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">ZMW</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="4500"
                    className={`pl-12 ${validationErrors.price ? "border-red-500" : ""}`}
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>
                {validationErrors.price && <p className="text-sm text-red-600">{validationErrors.price}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </CardTitle>
            <CardDescription>Where is your property located?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Full Address *</Label>
                <Input
                  id="location"
                  placeholder="e.g., 123 Main St, Lusaka, Zambia"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className={validationErrors.location ? "border-red-500" : ""}
                  required
                />
                {validationErrors.location && <p className="text-sm text-red-600">{validationErrors.location}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="houseNumber">Unit/House Number</Label>
                <Input
                  id="houseNumber"
                  placeholder="e.g., Apt 4B, Unit 12, House #5"
                  value={formData.houseNumber}
                  onChange={(e) => handleInputChange("houseNumber", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Property Description
            </CardTitle>
            <CardDescription>Describe your property to attract potential tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your property, amenities, nearby attractions, and what makes it special..."
                className={`min-h-[120px] ${validationErrors.description ? "border-red-500" : ""}`}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{formData.description.length}/500 characters</p>
                {validationErrors.description && <p className="text-sm text-red-600">{validationErrors.description}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Property Images
            </CardTitle>
            <CardDescription>Upload up to 6 high-quality images of your property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">Drop images here or click to upload</p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB each (max 6 images)</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                Choose Files
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Uploaded Images</h4>
                  <Badge variant="secondary">{formData.images.length}/6 images</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Publishing...
              </>
            ) : (
              "Publish Listing"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddPropertyForm

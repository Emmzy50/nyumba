"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Home, Building2, Shield } from "lucide-react"
import { setCurrentUser, type User } from "./lib/auth-utils"

// Mock user database for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "tenant@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    role: "tenant",
    joinDate: "January 2024",
    phone: "+265 991 234 567",
    bio: "Looking for a comfortable place to call home in Malawi.",
    verified: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "landlord@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    role: "landlord",
    joinDate: "December 2023",
    phone: "+265 999 876 543",
    bio: "Experienced property owner with multiple listings in Lilongwe and Blantyre.",
    verified: true,
  },
]

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
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

      // Find user in mock database
      const user = mockUsers.find((u) => u.email === formData.email)

      if (!user) {
        setErrors({ submit: "Invalid email or password" })
        return
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password for existing users
      if (formData.password.length < 1) {
        setErrors({ submit: "Invalid email or password" })
        return
      }

      // Save user to localStorage
      setCurrentUser(user)

      // Redirect based on role
      if (user.role === "tenant") {
        window.location.href = "/home"
      } else {
        window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setErrors({ submit: "Failed to sign in. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignIn = (provider: "google" | "facebook") => {
    // In a real app, this would redirect to OAuth provider
    console.log(`OAuth sign in with ${provider}`)
    alert(`${provider} sign-in would be implemented here`)
  }

  const handleDemoLogin = (userType: "tenant" | "landlord") => {
    const demoUser = mockUsers.find((u) => u.role === userType)
    if (demoUser) {
      setFormData({
        email: demoUser.email,
        password: "demo123",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">Nyumba</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="#features" className="text-sm lg:text-base text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm lg:text-base text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-sm lg:text-base text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
              <Button
                variant="outline"
                size="sm"
                className="text-sm bg-transparent"
                onClick={() => (window.location.href = "/signup")}
              >
                Sign Up
              </Button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                className="text-sm bg-transparent"
                onClick={() => (window.location.href = "/signup")}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)]">
        {/* Left Side - Welcome Back Content */}
        <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 order-2 lg:order-1">
          <div className="max-w-md w-full">
            <div className="text-center mb-6 lg:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
                <Home className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
              <p className="text-sm sm:text-base text-gray-600">Sign in to continue your property journey</p>
            </div>

            {/* Demo Accounts */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Try Demo Accounts:</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs bg-white/80"
                  onClick={() => handleDemoLogin("tenant")}
                >
                  <Home className="h-3 w-3 mr-2" />
                  Demo Tenant (tenant@example.com)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs bg-white/80"
                  onClick={() => handleDemoLogin("landlord")}
                >
                  <Building2 className="h-3 w-3 mr-2" />
                  Demo Landlord (landlord@example.com)
                </Button>
              </div>
              <p className="text-xs text-blue-700 mt-2">Click to auto-fill credentials, then sign in</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">2K+</div>
                <div className="text-xs sm:text-sm text-gray-600">Properties</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">15K+</div>
                <div className="text-xs sm:text-sm text-gray-600">Users</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">4.8</div>
                <div className="text-xs sm:text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-white/50 order-1 lg:order-2">
          <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-xl sm:text-2xl font-bold">Sign In</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`h-10 sm:h-11 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-xs sm:text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`h-10 sm:h-11 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs sm:text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => alert("Password reset functionality would be implemented here")}
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-xs sm:text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* OAuth Options */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn("google")}
                    disabled={isSubmitting}
                    className="bg-transparent h-10 sm:h-11 text-xs sm:text-sm"
                  >
                    <svg className="mr-1 sm:mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn("facebook")}
                    disabled={isSubmitting}
                    className="bg-transparent h-10 sm:h-11 text-xs sm:text-sm"
                  >
                    <svg className="mr-1 sm:mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/signup")}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              {/* Security Notice */}
              <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 pt-2">
                <Shield className="h-3 w-3 flex-shrink-0" />
                <span>Your data is secure and encrypted</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

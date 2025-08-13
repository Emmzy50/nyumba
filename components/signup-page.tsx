"use client"
import { useRouter } from "next/navigation"
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Home, Users, Building2, Search, CheckCircle, Star, Shield, Loader2 } from "lucide-react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { useAppStore } from "@/lib/store"

export default function SignupPage() {
  const router = useRouter()
  const setUser = useAppStore((state) => state.setUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phone: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (error) {
      setError(null)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.role) {
      newErrors.role = "Please select your role"
    }

    if (formData.role === "landlord" && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required for landlords"
    } else if (formData.phone && !/^\+?[\d\s\-$$$$]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)
    setSuccess(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

      const user = userCredential.user
      console.log("User created successfully:", user.uid)

      const newUser = {
        id: user.uid,
        name: formData.name,
        email: user.email || formData.email,
        avatar: user.photoURL || undefined,
        role: formData.role as "landlord" | "tenant",
        joinDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        phone: formData.phone,
        bio: "",
        verified: user.emailVerified,
        emailVerified: user.emailVerified,
        phoneVerified: false,
      }

      setUser(newUser)

      setSuccess("Account created successfully! Redirecting...")

      setTimeout(() => {
        if (formData.role === "landlord") {
          console.log("Redirecting landlord to dashboard")
          router.push("/dashboard")
        } else {
          console.log("Redirecting tenant to home")
          router.push("/home")
        }
      }, 1500)
    } catch (error: any) {
      console.error("Signup error:", error)

      let errorMessage = "Failed to create account. Please try again."

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please choose a stronger password."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address."
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password accounts are not enabled. Please contact support."
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignup = (provider: "google" | "facebook") => {
    console.log(`${provider} OAuth signup will be available soon`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
                onClick={() => (window.location.href = "/signin")}
              >
                Sign In
              </Button>
            </div>
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                className="text-sm bg-transparent"
                onClick={() => (window.location.href = "/signin")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)]">
        <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 order-2 lg:order-1">
          <div className="max-w-md w-full">
            <div className="text-center mb-6 lg:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
                <Home className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Home</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Browse through our collection of verified properties in Kenya
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 lg:mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">Verified property listings</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">Direct landlord communication</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">Advanced search filters</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">Secure application process</span>
              </div>
            </div>

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
                <div className="text-xs sm:text-sm text-gray-500 flex items-center justify-center">
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  Rating
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-white/50 order-1 lg:order-2">
          <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-xl sm:text-2xl font-bold">Create Account</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Choose your account type and get started today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userType" className="text-sm font-medium">
                    I am a *
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger className={`h-10 sm:h-11 ${errors.role ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant">
                        <div className="flex items-center py-1">
                          <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Tenant</div>
                            <div className="text-xs text-gray-500">Looking for a place to rent</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="landlord">
                        <div className="flex items-center py-1">
                          <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Landlord</div>
                            <div className="text-xs text-gray-500">Have properties to rent</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-xs sm:text-sm text-red-600">{errors.role}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`h-10 sm:h-11 ${errors.name ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.name && <p className="text-xs sm:text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`h-10 sm:h-11 ${errors.email ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.email && <p className="text-xs sm:text-sm text-red-600">{errors.email}</p>}
                </div>

                {formData.role === "landlord" && (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`h-10 sm:h-11 ${errors.phone ? "border-red-500" : ""}`}
                      required
                    />
                    {errors.phone && <p className="text-xs sm:text-sm text-red-600">{errors.phone}</p>}
                    <p className="text-xs text-gray-500">This will be shown to tenants for contact</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`h-10 sm:h-11 pr-10 ${errors.password ? "border-red-500" : ""}`}
                      required
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`h-10 sm:h-11 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-10 sm:h-11 text-sm sm:text-base">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

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
                    onClick={() => handleOAuthSignup("google")}
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
                    onClick={() => handleOAuthSignup("facebook")}
                    className="bg-transparent h-10 sm:h-11 text-xs sm:text-sm"
                  >
                    <svg className="mr-1 sm:mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/signin")}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </button>
                </p>
              </div>

              <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 pt-2">
                <Shield className="h-3 w-3 flex-shrink-0" />
                <span>Your data is secure and encrypted</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="lg:hidden bg-gray-50 p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Why Choose Nyumba?</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Trusted Community</span>
              <span className="text-xs text-gray-500">15K+ Users</span>
            </div>
            <div className="flex flex-col items-center">
              <Building2 className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Quality Properties</span>
              <span className="text-xs text-gray-500">2K+ Listings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

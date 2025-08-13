"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import TenantHome from "@/components/tenant-home"
import Dashboard from "@/components/dashboard"

export default function HomePage() {
  const { user, setUser } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize user from localStorage or redirect to signin
    const initializeUser = async () => {
      try {
        // Check if user exists in localStorage (handled by zustand persist)
        if (!user) {
          // Redirect to signin if no user found
          window.location.href = "/signin"
          return
        }

        // User exists, continue with the app
        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing user:", error)
        window.location.href = "/signin"
      }
    }

    initializeUser()
  }, [user, setUser])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  // Show different interfaces based on user role
  if (user.role === "tenant") {
    return <TenantHome />
  } else {
    return <Dashboard />
  }
}

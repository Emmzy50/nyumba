"use client"

import { useEffect } from "react"
import { Building2 } from "lucide-react"

export default function HomePage() {
  useEffect(() => {
    // Redirect to signin page on client side
    window.location.href = "/signin"
  }, [])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Building2 className="h-12 w-12 text-blue-600 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nyumba</h1>
        <p className="text-gray-600">Redirecting to sign in...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

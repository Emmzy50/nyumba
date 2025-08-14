"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Shield, CheckCircle, AlertTriangle } from "lucide-react"
import VerificationSystem from "./verification-system"

interface VerificationPromptProps {
  user: any
  onDismiss?: () => void
}

export default function VerificationPrompt({ user, onDismiss }: VerificationPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
  })

  useEffect(() => {
    // Check if user needs verification
    const savedVerification = localStorage.getItem("nyumba_verification_status")
    const dismissedPrompt = localStorage.getItem("nyumba_verification_prompt_dismissed")

    let emailVerified = false
    let phoneVerified = false

    if (savedVerification) {
      try {
        const parsed = JSON.parse(savedVerification)
        emailVerified = parsed.email?.verified || false
        phoneVerified = parsed.phone?.verified || false
      } catch (error) {
        console.error("Error parsing verification status:", error)
      }
    }

    setVerificationStatus({
      email: emailVerified,
      phone: phoneVerified,
    })

    // Show prompt if user is not fully verified and hasn't dismissed it
    const isFullyVerified = emailVerified && phoneVerified
    const shouldShowPrompt = !isFullyVerified && !dismissedPrompt && user && (user.email || user.phone)

    setShowPrompt(shouldShowPrompt)
  }, [user])

  const handleDismiss = () => {
    localStorage.setItem("nyumba_verification_prompt_dismissed", "true")
    setShowPrompt(false)
    if (onDismiss) {
      onDismiss()
    }
  }

  const handleStartVerification = () => {
    setShowVerification(true)
    setShowPrompt(false)
  }

  const handleVerificationComplete = (type: "email" | "phone") => {
    setVerificationStatus((prev) => ({
      ...prev,
      [type]: true,
    }))

    // Check if fully verified now
    const newStatus = {
      ...verificationStatus,
      [type]: true,
    }

    if (newStatus.email && newStatus.phone) {
      setShowPrompt(false)
    }
  }

  if (!showPrompt) {
    return (
      <>
        <VerificationSystem
          isOpen={showVerification}
          onClose={() => setShowVerification(false)}
          onVerificationComplete={handleVerificationComplete}
        />
      </>
    )
  }

  const unverifiedCount = (verificationStatus.email ? 0 : 1) + (verificationStatus.phone ? 0 : 1)
  const hasPartialVerification = verificationStatus.email || verificationStatus.phone

  return (
    <>
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {hasPartialVerification ? (
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                ) : (
                  <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-orange-900">
                  {hasPartialVerification ? "Complete Your Verification" : "Verify Your Account"}
                </h3>
                <p className="text-sm text-orange-800 mt-1">
                  {hasPartialVerification
                    ? `You have ${unverifiedCount} contact method${unverifiedCount > 1 ? "s" : ""} left to verify.`
                    : "Verify your email and phone number to increase trust with other users."}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={verificationStatus.email ? "default" : "secondary"} className="text-xs">
                    {verificationStatus.email && <CheckCircle className="h-3 w-3 mr-1" />}
                    Email {verificationStatus.email ? "Verified" : "Pending"}
                  </Badge>
                  <Badge variant={verificationStatus.phone ? "default" : "secondary"} className="text-xs">
                    {verificationStatus.phone && <CheckCircle className="h-3 w-3 mr-1" />}
                    Phone {verificationStatus.phone ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={handleStartVerification} className="bg-orange-600 hover:bg-orange-700">
                    {hasPartialVerification ? "Complete Verification" : "Start Verification"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDismiss}
                    className="bg-transparent border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    Later
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1 h-auto text-orange-600 hover:text-orange-700 hover:bg-orange-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <VerificationSystem
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        onVerificationComplete={handleVerificationComplete}
      />
    </>
  )
}

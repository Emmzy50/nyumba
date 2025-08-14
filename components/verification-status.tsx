"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Shield } from "lucide-react"
import VerificationSystem from "./verification-system"

interface VerificationStatusProps {
  user: any
  onVerificationUpdate?: () => void
}

export default function VerificationStatus({ user, onVerificationUpdate }: VerificationStatusProps) {
  const [showVerification, setShowVerification] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
  })

  useEffect(() => {
    // Load verification status from localStorage
    const savedVerification = localStorage.getItem("nyumba_verification_status")
    if (savedVerification) {
      try {
        const parsed = JSON.parse(savedVerification)
        setVerificationStatus({
          email: parsed.email?.verified || false,
          phone: parsed.phone?.verified || false,
        })
      } catch (error) {
        console.error("Error parsing verification status:", error)
      }
    }
  }, [])

  const handleVerificationComplete = (type: "email" | "phone") => {
    setVerificationStatus((prev) => ({
      ...prev,
      [type]: true,
    }))

    if (onVerificationUpdate) {
      onVerificationUpdate()
    }
  }

  const isFullyVerified = verificationStatus.email && verificationStatus.phone
  const hasPartialVerification = verificationStatus.email || verificationStatus.phone

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className={`h-5 w-5 ${isFullyVerified ? "text-green-500" : "text-gray-400"}`} />
          <div>
            <h4 className="font-medium">Account Verification</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={verificationStatus.email ? "default" : "secondary"} className="text-xs">
                {verificationStatus.email ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                Email
              </Badge>
              <Badge variant={verificationStatus.phone ? "default" : "secondary"} className="text-xs">
                {verificationStatus.phone ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                Phone
              </Badge>
            </div>
          </div>
        </div>
        <Button
          variant={isFullyVerified ? "outline" : "default"}
          size="sm"
          onClick={() => setShowVerification(true)}
          className={isFullyVerified ? "bg-transparent" : ""}
        >
          {isFullyVerified ? "Verified" : hasPartialVerification ? "Complete Verification" : "Verify Account"}
        </Button>
      </div>

      <VerificationSystem
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        onVerificationComplete={handleVerificationComplete}
      />
    </>
  )
}

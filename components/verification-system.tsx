"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, Phone, Shield, CheckCircle, AlertCircle, Clock, Send, RefreshCw } from "lucide-react"
import { getCurrentUser, updateUserProfile } from "./lib/auth-utils"

interface VerificationState {
  email: {
    verified: boolean
    pending: boolean
    code: string
    expiresAt: number | null
    attempts: number
  }
  phone: {
    verified: boolean
    pending: boolean
    code: string
    expiresAt: number | null
    attempts: number
  }
}

interface VerificationSystemProps {
  isOpen: boolean
  onClose: () => void
  onVerificationComplete?: (type: "email" | "phone") => void
}

export default function VerificationSystem({ isOpen, onClose, onVerificationComplete }: VerificationSystemProps) {
  const [user, setUser] = useState(getCurrentUser())
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email")
  const [verificationState, setVerificationState] = useState<VerificationState>({
    email: {
      verified: false,
      pending: false,
      code: "",
      expiresAt: null,
      attempts: 0,
    },
    phone: {
      verified: false,
      pending: false,
      code: "",
      expiresAt: null,
      attempts: 0,
    },
  })
  const [otpInput, setOtpInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Timer for OTP expiration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // OTP expired
            setVerificationState((prev) => ({
              ...prev,
              [activeTab]: {
                ...prev[activeTab],
                pending: false,
                expiresAt: null,
              },
            }))
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timeRemaining, activeTab])

  // Load verification status from localStorage
  useEffect(() => {
    const savedVerification = localStorage.getItem("nyumba_verification_status")
    if (savedVerification) {
      try {
        const parsed = JSON.parse(savedVerification)
        setVerificationState(parsed)
      } catch (error) {
        console.error("Error parsing verification status:", error)
      }
    }
  }, [])

  // Save verification status to localStorage
  const saveVerificationState = (newState: VerificationState) => {
    localStorage.setItem("nyumba_verification_status", JSON.stringify(newState))
    setVerificationState(newState)
  }

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const sendVerificationCode = async (type: "email" | "phone") => {
    if (!user) return

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      // Generate OTP
      const otp = generateOTP()
      const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would send the OTP via email/SMS service
      console.log(`${type.toUpperCase()} OTP for ${type === "email" ? user.email : user.phone}: ${otp}`)

      // Update verification state
      const newState = {
        ...verificationState,
        [type]: {
          ...verificationState[type],
          pending: true,
          code: otp,
          expiresAt,
          attempts: 0,
        },
      }
      saveVerificationState(newState)

      // Start countdown timer
      setTimeRemaining(300) // 5 minutes in seconds

      setSuccess(`Verification code sent to your ${type === "email" ? "email address" : "phone number"}`)

      // Show the OTP in development (remove in production)
      if (process.env.NODE_ENV === "development") {
        alert(`Development Mode - OTP: ${otp}`)
      }
    } catch (error) {
      console.error(`Error sending ${type} verification:`, error)
      setError(`Failed to send verification code. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const verifyCode = async (type: "email" | "phone") => {
    if (!user || !otpInput.trim()) {
      setError("Please enter the verification code")
      return
    }

    const currentVerification = verificationState[type]

    if (!currentVerification.pending || !currentVerification.expiresAt) {
      setError("No pending verification. Please request a new code.")
      return
    }

    if (Date.now() > currentVerification.expiresAt) {
      setError("Verification code has expired. Please request a new code.")
      return
    }

    if (currentVerification.attempts >= 3) {
      setError("Too many failed attempts. Please request a new code.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (otpInput === currentVerification.code) {
        // Verification successful
        const newState = {
          ...verificationState,
          [type]: {
            ...verificationState[type],
            verified: true,
            pending: false,
            code: "",
            expiresAt: null,
            attempts: 0,
          },
        }
        saveVerificationState(newState)

        // Update user profile
        const updatedUser = updateUserProfile({ verified: true })
        if (updatedUser) {
          setUser(updatedUser)
        }

        setSuccess(`${type === "email" ? "Email" : "Phone number"} verified successfully!`)
        setOtpInput("")
        setTimeRemaining(0)

        // Call completion callback
        if (onVerificationComplete) {
          onVerificationComplete(type)
        }

        // Close dialog after success
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        // Verification failed
        const newState = {
          ...verificationState,
          [type]: {
            ...verificationState[type],
            attempts: currentVerification.attempts + 1,
          },
        }
        saveVerificationState(newState)

        const remainingAttempts = 3 - (currentVerification.attempts + 1)
        if (remainingAttempts > 0) {
          setError(`Invalid code. ${remainingAttempts} attempts remaining.`)
        } else {
          setError("Too many failed attempts. Please request a new code.")
        }
      }
    } catch (error) {
      console.error("Error verifying code:", error)
      setError("Verification failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendCode = () => {
    setOtpInput("")
    setError("")
    setSuccess("")
    sendVerificationCode(activeTab)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!user) return null

  const currentVerification = verificationState[activeTab]
  const contactInfo = activeTab === "email" ? user.email : user.phone

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verify Your Account
          </DialogTitle>
          <DialogDescription>
            Verify your contact information to increase trust and unlock additional features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Selection */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "email" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
              {verificationState.email.verified && <CheckCircle className="h-3 w-3 text-green-500" />}
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "phone" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone
              {verificationState.phone.verified && <CheckCircle className="h-3 w-3 text-green-500" />}
            </button>
          </div>

          {/* Verification Content */}
          <div className="space-y-4">
            {/* Contact Info Display */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {activeTab === "email" ? (
                  <Mail className="h-5 w-5 text-gray-400" />
                ) : (
                  <Phone className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{contactInfo || "Not provided"}</p>
                  <p className="text-sm text-gray-500">{activeTab === "email" ? "Email Address" : "Phone Number"}</p>
                </div>
              </div>
              {currentVerification.verified ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="secondary">Unverified</Badge>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Verification Steps */}
            {!currentVerification.verified && (
              <div className="space-y-4">
                {!currentVerification.pending ? (
                  // Step 1: Send Code
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Click the button below to receive a verification code via{" "}
                      {activeTab === "email" ? "email" : "SMS"}.
                    </p>
                    <Button
                      onClick={() => sendVerificationCode(activeTab)}
                      disabled={isSubmitting || !contactInfo}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Sending Code...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Verification Code
                        </>
                      )}
                    </Button>
                    {!contactInfo && (
                      <p className="text-sm text-red-600">
                        Please add your {activeTab === "email" ? "email address" : "phone number"} in your profile
                        first.
                      </p>
                    )}
                  </div>
                ) : (
                  // Step 2: Enter Code
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otpInput}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                          setOtpInput(value)
                          setError("")
                        }}
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                    </div>

                    {/* Timer */}
                    {timeRemaining > 0 && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        Code expires in {formatTime(timeRemaining)}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => verifyCode(activeTab)}
                        disabled={isSubmitting || otpInput.length !== 6}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify Code"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resendCode}
                        disabled={isSubmitting || timeRemaining > 240} // Allow resend after 1 minute
                        className="bg-transparent"
                      >
                        Resend
                      </Button>
                    </div>

                    {/* Attempts Warning */}
                    {currentVerification.attempts > 0 && (
                      <p className="text-sm text-orange-600 text-center">
                        {3 - currentVerification.attempts} attempts remaining
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Already Verified */}
            {currentVerification.verified && (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">
                  {activeTab === "email" ? "Email" : "Phone"} Verified!
                </h3>
                <p className="text-sm text-gray-600">
                  Your {activeTab === "email" ? "email address" : "phone number"} has been successfully verified.
                </p>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Verification Benefits</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Increased trust with other users</li>
              <li>• Priority in search results</li>
              <li>• Access to premium features</li>
              <li>• Better security for your account</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./config"
import type { User } from "../types"

export interface AuthResult {
  success?: boolean
  error?: string
  user?: User
  redirectPath?: string
}

// Convert Firebase user to our User type
export async function convertFirebaseUser(firebaseUser: FirebaseUser): Promise<User | null> {
  try {
    const userDoc = await withTimeout(getDoc(doc(db, "users", firebaseUser.uid)), 5000)
    const userData = userDoc.data()

    if (!userData) {
      return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        avatar: firebaseUser.photoURL || undefined,
        role: "tenant", // Default role
        joinDate: "Recently",
        phone: "",
        bio: "",
        verified: firebaseUser.emailVerified,
        emailVerified: firebaseUser.emailVerified,
        phoneVerified: false,
      }
    }

    return {
      id: firebaseUser.uid,
      name: userData.fullName || firebaseUser.displayName || "",
      email: firebaseUser.email || "",
      avatar: firebaseUser.photoURL || undefined,
      role: userData.userType || "tenant",
      joinDate:
        userData.createdAt?.toDate?.()?.toLocaleDateString("en-US", { month: "long", year: "numeric" }) || "Recently",
      phone: userData.phone || "",
      bio: userData.bio || "",
      verified: firebaseUser.emailVerified,
      emailVerified: firebaseUser.emailVerified,
      phoneVerified: userData.phoneVerified || false,
    }
  } catch (error: any) {
    console.error("Error converting Firebase user:", error)

    if (error.message?.includes("offline") || error.message?.includes("client is offline")) {
      return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        avatar: firebaseUser.photoURL || undefined,
        role: "tenant", // Default role when offline
        joinDate: "Recently",
        phone: "",
        bio: "",
        verified: firebaseUser.emailVerified,
        emailVerified: firebaseUser.emailVerified,
        phoneVerified: false,
      }
    }

    return null
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)),
  ])
}

// Sign up with email and password
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  userType: "tenant" | "landlord",
): Promise<AuthResult> {
  try {
    const userCredential = await withTimeout(createUserWithEmailAndPassword(auth, email, password), 15000)
    const user = userCredential.user

    // Update the user's display name
    await withTimeout(updateProfile(user, { displayName: fullName }), 10000)

    // Create user document in Firestore
    await withTimeout(
      setDoc(doc(db, "users", user.uid), {
        email: user.email,
        fullName,
        userType,
        phone: "",
        bio: "",
        phoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      10000,
    )

    const convertedUser = await convertFirebaseUser(user)

    return {
      success: true,
      user: convertedUser || undefined,
      redirectPath: userType === "landlord" ? "/dashboard" : "/home",
    }
  } catch (error: any) {
    console.error("Sign up error:", error)

    let errorMessage = "Failed to create account"

    if (error.message === "Operation timed out") {
      errorMessage = "Request timed out. Please check your internet connection and try again."
    } else if (error.code === "auth/operation-not-allowed") {
      errorMessage = "Email/password authentication is not enabled. Please contact support."
    } else if (error.code === "auth/email-already-in-use") {
      errorMessage = "An account with this email already exists"
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password should be at least 6 characters"
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address"
    }

    return {
      error: errorMessage,
    }
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    const convertedUser = await convertFirebaseUser(user)

    if (!convertedUser) {
      return { error: "User profile not found" }
    }

    return {
      success: true,
      user: convertedUser,
      redirectPath: convertedUser.role === "landlord" ? "/dashboard" : "/home",
    }
  } catch (error: any) {
    console.error("Sign in error:", error)
    let errorMessage = "Failed to sign in"

    if (error.message?.includes("offline") || error.message?.includes("client is offline")) {
      errorMessage = "Unable to connect to the database. Please check your internet connection and try again."
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email"
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password"
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address"
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed attempts. Please try again later"
    }

    return {
      error: errorMessage,
    }
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error("Sign out error:", error)
    throw error
  }
}

// Auth state listener
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await convertFirebaseUser(firebaseUser)
      callback(user)
    } else {
      callback(null)
    }
  })
}

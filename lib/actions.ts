import { signIn as firebaseSignIn, signUp as firebaseSignUp, signOut as firebaseSignOut } from "./firebase/auth"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const result = await firebaseSignIn(email.toString(), password.toString())

    if (result.error) {
      return { error: result.error }
    }

    return {
      success: true,
      redirectPath: result.redirectPath,
      user: result.user,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")
  const userType = formData.get("userType")
  const fullName = formData.get("fullName")

  if (!email || !password || !userType) {
    return { error: "Email, password, and user type are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (password.toString().length < 6) {
    return { error: "Password must be at least 6 characters long" }
  }

  try {
    const result = await firebaseSignUp(
      email.toString(),
      password.toString(),
      fullName?.toString() || "",
      userType.toString() as "tenant" | "landlord",
    )

    if (result.error) {
      return { error: result.error }
    }

    return {
      success: "Account created successfully! Please check your email to verify your account.",
      redirectPath: result.redirectPath,
      user: result.user,
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  try {
    await firebaseSignOut()
    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: "Failed to sign out" }
  }
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "landlord" | "tenant"
  joinDate: string
  phone: string
  bio: string
  verified: boolean
  emailVerified?: boolean
  phoneVerified?: boolean
}

const STORAGE_KEY = "nyumba_current_user"

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function setCurrentUser(user: User): void {
  if (typeof window === "undefined") return

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearCurrentUser(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(STORAGE_KEY)
}

export function updateUserProfile(updates: Partial<User>): User | null {
  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const updatedUser = { ...currentUser, ...updates }
  setCurrentUser(updatedUser)
  return updatedUser
}

export function initializeMockUser(): User {
  const mockUser: User = {
    id: "mock_user_1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    role: "tenant",
    joinDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    phone: "+265 991 234 567",
    bio: "Looking for a comfortable place to call home in Malawi.",
    verified: true,
    emailVerified: true,
    phoneVerified: true,
  }

  setCurrentUser(mockUser)
  return mockUser
}

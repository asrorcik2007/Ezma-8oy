"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define the user type
type User = {
  id: string
  name: string
  email: string
  role: string
}

// Define the auth context type
type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData?: User) => void
  logout: () => void
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only run in browser environment
        if (typeof window === "undefined") {
          setIsLoading(false)
          return
        }

        const token = localStorage.getItem("token")

        if (token) {
          // Try to get user data from localStorage
          const userDataString = localStorage.getItem("user")
          if (userDataString) {
            try {
              const userData = JSON.parse(userDataString)
              setUser(userData)
            } catch (parseError) {
              console.error("Failed to parse user data:", parseError)
              // If parsing fails, clear the invalid data
              localStorage.removeItem("token")
              localStorage.removeItem("user")
            }
          } else {
            // If no user data in localStorage, clear token
            localStorage.removeItem("token")
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = (token: string, userData?: User) => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return
    }

    if (!userData) {
      console.error("No user data provided for login")
      return
    }

    try {
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Failed to save auth data:", error)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser, getCurrentUser, logoutUser, updateUser, type User } from "@/lib/mock-api"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error loading current user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCurrentUser()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const loggedInUser = await loginUser(email, password)
      if (loggedInUser) {
        setUser(loggedInUser)
        setIsLoading(false)
        return true
      }
    } catch (error) {
      console.error("Login error:", error)
    }

    setIsLoading(false)
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const newUser = await registerUser(name, email, password)
      if (newUser) {
        setUser(newUser)
        setIsLoading(false)
        return true
      }
    } catch (error) {
      console.error("Registration error:", error)
    }

    setIsLoading(false)
    return false
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false

    try {
      const updatedUser = await updateUser(user.id, updates)
      if (updatedUser) {
        setUser(updatedUser)
        return true
      }
    } catch (error) {
      console.error("Profile update error:", error)
    }

    return false
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

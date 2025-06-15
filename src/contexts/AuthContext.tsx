'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  createdAt?: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>
  signUpWithEmail: (email: string, password: string, userData: Partial<User>) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session from Supabase
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setSupabaseUser(session.user)
        setToken(session.access_token)
        await fetchUserProfile(session.user.id)
      }
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      if (session?.user) {
        setSupabaseUser(session.user)
        setToken(session.access_token)
        await fetchUserProfile(session.user.id)
      } else {
        setSupabaseUser(null)
        setToken(null)
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (supabaseUserId: string) => {
    try {
      // Try to get user profile from our Prisma database
      const response = await fetch(`/api/auth/profile/${supabaseUserId}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // If user doesn't exist in our database, we might need to create it
        console.log('User profile not found in database')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Legacy login method (for backward compatibility)
  const login = (newToken: string, userData: User) => {
    console.warn('Legacy login method called - use signInWithEmail instead')
    setToken(newToken)
    setUser(userData)
  }

  // Legacy logout method (for backward compatibility)
  const logout = () => {
    signOut()
  }
  // Supabase sign in
  const signInWithEmail = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      // User profile will be fetched automatically via onAuthStateChange
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  // Supabase sign up
  const signUpWithEmail = async (
    email: string, 
    password: string, 
    userData: Partial<User>
  ): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
          }
        }
      })

      if (error) {
        return { error: error.message }
      }

      // Create user profile in our database
      if (data.user) {
        try {
          await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              supabaseUserId: data.user.id,
              email: data.user.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
            }),
          })
        } catch (syncError) {
          console.error('Error syncing user to database:', syncError)
        }
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  // Supabase sign out
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser,
      token, 
      login, 
      logout, 
      isLoading,
      signInWithEmail,
      signUpWithEmail,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

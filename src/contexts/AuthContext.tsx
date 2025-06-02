'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  supabaseUser: SupabaseUser | null
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
  const [token, setToken] = useState<string | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setSupabaseUser(session.user)
        setToken(session.access_token)
        // Try to fetch user data from your existing API or create from Supabase user
        await fetchOrCreateUser(session.access_token, session.user)
      } else {
        // Fallback to localStorage token for existing authentication
        if (typeof window !== 'undefined') {
          const savedToken = localStorage.getItem('token')
          if (savedToken) {
            await fetchUser(savedToken)
          }
        }
      }
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user)
          setToken(session.access_token)
          await fetchOrCreateUser(session.access_token, session.user)
        } else {
          setSupabaseUser(null)
          setToken(null)
          setUser(null)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
          }
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])
  const fetchOrCreateUser = async (authToken: string, supabaseUser: SupabaseUser) => {
    try {
      // First try to fetch existing user
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      if (response.ok) {
        const { user } = await response.json()
        setUser(user)
      } else if (response.status === 404) {
        // User doesn't exist in database, sync them using our API
        console.log('User not found in database, syncing...')
        
        try {
          const syncResponse = await fetch('/api/auth/sync-users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: supabaseUser.id })
          })

          if (syncResponse.ok) {
            // After successful sync, try fetching the user again
            const retryResponse = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            })

            if (retryResponse.ok) {
              const { user } = await retryResponse.json()
              setUser(user)
            } else {
              // Fallback: create user object from Supabase data
              const newUser: User = {
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                firstName: supabaseUser.user_metadata?.firstName || supabaseUser.user_metadata?.full_name?.split(' ')[0] || '',
                lastName: supabaseUser.user_metadata?.lastName || supabaseUser.user_metadata?.full_name?.split(' ')[1] || '',
                avatar: supabaseUser.user_metadata?.avatar_url,
                bio: supabaseUser.user_metadata?.bio
              }
              setUser(newUser)
            }
          } else {
            console.error('Failed to sync user')
            // Fallback: create user object from Supabase data
            const newUser: User = {
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              firstName: supabaseUser.user_metadata?.firstName || supabaseUser.user_metadata?.full_name?.split(' ')[0] || '',
              lastName: supabaseUser.user_metadata?.lastName || supabaseUser.user_metadata?.full_name?.split(' ')[1] || '',
              avatar: supabaseUser.user_metadata?.avatar_url,
              bio: supabaseUser.user_metadata?.bio
            }
            setUser(newUser)
          }
        } catch (syncError) {
          console.error('Error syncing user:', syncError)
          // Fallback: create user object from Supabase data
          const newUser: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            firstName: supabaseUser.user_metadata?.firstName || supabaseUser.user_metadata?.full_name?.split(' ')[0] || '',
            lastName: supabaseUser.user_metadata?.lastName || supabaseUser.user_metadata?.full_name?.split(' ')[1] || '',
            avatar: supabaseUser.user_metadata?.avatar_url,
            bio: supabaseUser.user_metadata?.bio
          }
          setUser(newUser)
        }
      } else {
        console.error('Unexpected response from /api/auth/me:', response.status)
      }
    } catch (error) {
      console.error('Error fetching/creating user:', error)
    }
  }

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      if (response.ok) {
        const { user } = await response.json()
        setUser(user)
        setToken(authToken)
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    }
  }

  const login = (newToken: string, userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', newToken)
    }
    setToken(newToken)
    setUser(userData)
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
    setToken(null)
    setUser(null)
    setSupabaseUser(null)
  }
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signUpWithEmail = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            full_name: `${userData.firstName} ${userData.lastName}`,
          }
        }
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    logout()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      supabaseUser,
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

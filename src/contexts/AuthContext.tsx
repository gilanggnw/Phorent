'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial token from localStorage
    const getInitialSession = async () => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
          await fetchUser(savedToken)
        }
      }
      setIsLoading(false)
    }

    getInitialSession()
  }, [])

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
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      setToken(null)
      setUser(null)
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
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Login failed' }
      }

      login(data.token, data.user)
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signUpWithEmail = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName: userData.firstName,
          lastName: userData.lastName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Registration failed' }
      }

      login(data.token, data.user)
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    logout()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
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

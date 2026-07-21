'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type User = { id: number; email: string; name: string }

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

function loadSaved(): { token: string | null; user: User | null } {
  if (typeof window === 'undefined') return { token: null, user: null }
  const token = localStorage.getItem('prelegal_token')
  const userStr = localStorage.getItem('prelegal_user')
  return { token, user: userStr ? JSON.parse(userStr) : null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [saved] = useState(loadSaved)
  const [user, setUser] = useState<User | null>(saved.user)
  const [token, setToken] = useState<string | null>(saved.token)
  const [loading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login failed' }))
      throw new Error(err.message)
    }
    const data = await res.json()
    localStorage.setItem('prelegal_token', data.token)
    localStorage.setItem('prelegal_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Signup failed' }))
      throw new Error(err.message)
    }
    const data = await res.json()
    localStorage.setItem('prelegal_token', data.token)
    localStorage.setItem('prelegal_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('prelegal_token')
    localStorage.removeItem('prelegal_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function authHeaders(token: string | null): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

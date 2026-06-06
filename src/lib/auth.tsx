'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface AuthUser {
  access_token: string
  user_id: string
  company_id: string
  email: string
  full_name: string
  role: string
  email_verified: boolean
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string, companyName: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  acceptInvite: (token: string, password: string, fullName: string) => Promise<void>
  sendVerification: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>(null!)

function storeUser(u: AuthUser) {
  localStorage.setItem('ecofleet_token', u.access_token)
  localStorage.setItem('ecofleet_user', JSON.stringify(u))
}

function loadUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('ecofleet_user')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function authRequest(path: string, body: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ecofleet_token')
    setUser(token ? loadUser() : null)
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await authRequest('/api/v1/auth/login', { email, password })
    storeUser(data)
    setUser(data)
  }, [])

  const register = useCallback(async (email: string, password: string, fullName: string, companyName: string) => {
    const data = await authRequest('/api/v1/auth/register', {
      email, password, full_name: fullName, company_name: companyName,
    })
    storeUser(data)
    setUser(data)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ecofleet_token')
    localStorage.removeItem('ecofleet_user')
    setUser(null)
    window.location.href = '/login'
  }, [])

  const forgotPassword = useCallback(async (email: string) => {
    await authRequest('/api/v1/auth/forgot-password', { email })
  }, [])

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    await authRequest('/api/v1/auth/reset-password', { token, new_password: newPassword })
  }, [])

  const acceptInvite = useCallback(async (token: string, password: string, fullName: string) => {
    const data = await authRequest('/api/v1/auth/accept-invite', { token, password, full_name: fullName })
    storeUser(data)
    setUser(data)
  }, [])

  const sendVerification = useCallback(async () => {
    const token = localStorage.getItem('ecofleet_token')
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${BASE}/api/v1/verification/send`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    if (!res.ok) { const t = await res.text(); throw new Error(t) }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword, acceptInvite, sendVerification }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { useAuth } from '@/lib/auth'
import Sidebar from './Sidebar'
import { Loader2 } from 'lucide-react'

const PUBLIC_PATHS = ['/login']

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const path = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user && !PUBLIC_PATHS.includes(path)) {
      router.replace('/login')
    }
    if (user && path === '/login') {
      router.replace('/')
    }
  }, [user, loading, path, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!user && path !== '/login') {
    return null
  }

  if (path === '/login') {
    return <>{children}</>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-6xl">{children}</main>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Upload, FileText, Building2, Truck, LogOut, User, CreditCard, Moon, Sun, Shield, Settings, Bell, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { api, SubscriptionInfo } from '@/lib/api'

const links = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/upload', label: 'Upload Data', icon: Upload },
  { href: '/vehicles', label: 'Vehicles', icon: Truck },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/company', label: 'Company', icon: Building2 },
  { href: '/billing', label: 'Billing', icon: CreditCard },
]

export default function Sidebar() {
  const path = usePathname()
  const { user, logout } = useAuth()
  const [sub, setSub] = useState<SubscriptionInfo | null>(null)
  const [dark, setDark] = useState(false)
  const [notifCount, setNotifCount] = useState(0)

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    api.subscription.current().then(setSub).catch(() => {})
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/notifications/count`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('ecofleet_token')}` }
    }).then(r => r.json()).then(d => setNotifCount(d.count)).catch(() => {})
    const interval = setInterval(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/notifications/count`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ecofleet_token')}` }
      }).then(r => r.json()).then(d => setNotifCount(d.count)).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  const usagePct = sub ? Math.min(100, (sub.vehicles_used / sub.max_vehicles) * 100) : 0

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen p-6 flex flex-col shrink-0">
      <Link href="/" className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-primary-700 text-sm leading-tight">EcoFleet</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">UK</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              path === href
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
        {user?.role === 'admin' && (
          <Link href="/admin"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-2',
              path === '/admin'
                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Shield className="w-5 h-5" />
            Admin
          </Link>
        )}
        <Link href="/2fa"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            path === '/2fa'
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <Smartphone className="w-5 h-5" />
          2FA
        </Link>
      </nav>

      {sub && (
        <Link
          href="/billing"
          className="mt-6 mx-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition block"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-gray-600 dark:text-gray-300">{sub.plan_name}</span>
            <span className="text-gray-400 dark:text-gray-500">{sub.vehicles_used}/{sub.max_vehicles}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-amber-500' : 'bg-primary-600'}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </Link>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <button onClick={toggleDark} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full">
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full relative">
          <Bell className="w-5 h-5" />
          Notifications
          {notifCount > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {notifCount > 99 ? '99+' : notifCount}
            </span>
          )}
        </button>

        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600 dark:text-primary-300" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{user.full_name}</div>
              <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{user.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
        <div className="px-3 pt-1 flex gap-3 text-[11px] text-gray-400 dark:text-gray-600">
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/privacy" className="hover:underline">Privacy</a>
        </div>
        <div className="px-3 pt-1">
          <div className="text-[11px] text-gray-400 dark:text-gray-600 leading-tight">
            EcoFleet UK<br />
            by <strong>Dvbxtreme Sp.z o.o.</strong><br />
            DEFRA 2025 · FORS Silver/Gold
          </div>
        </div>
      </div>
    </aside>
  )
}

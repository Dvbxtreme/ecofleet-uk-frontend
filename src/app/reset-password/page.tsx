'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Truck, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const { forgotPassword, resetPassword } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'request' | 'reset'>('request')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await forgotPassword(email)
      setSuccess('Check your email — reset link sent.')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    setBusy(true)
    try {
      await resetPassword(token, password)
      setSuccess('Password reset successful! Redirecting...')
      setTimeout(() => router.push('/login'), 2000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const checkUrl = () => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (t) { setToken(t); setMode('reset') }
  }

  useState(() => checkUrl())

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">EcoFleet UK</h1>
          <p className="text-sm text-gray-400 mt-1">Password Reset</p>
        </div>

        <div className="card p-8">
          {success ? (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg px-4 py-3">
              <CheckCircle className="w-4 h-4 shrink-0" /> {success}
            </div>
          ) : mode === 'request' ? (
            <form onSubmit={handleRequest} className="space-y-4">
              <p className="text-sm text-gray-500">Enter your email and we'll send a reset link.</p>
              <div>
                <label className="label">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input w-full" />
              </div>
              {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
              <button type="submit" disabled={busy} className="btn-primary w-full flex items-center justify-center gap-2">
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Reset Link
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-sm text-gray-500">Enter your new password.</p>
              <div>
                <label className="label">New Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input w-full" />
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} className="input w-full" />
              </div>
              {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
              <button type="submit" disabled={busy} className="btn-primary w-full flex items-center justify-center gap-2">
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

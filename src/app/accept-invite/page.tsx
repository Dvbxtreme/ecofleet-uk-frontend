'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Truck, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function AcceptInvitePage() {
  const { acceptInvite } = useAuth()
  const router = useRouter()
  const [token, setToken] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (t) setToken(t)
    else setError('Invalid invitation link')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    setBusy(true)
    try {
      await acceptInvite(token, password, fullName)
      router.push('/')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (!token) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Accept Invitation</h1>
          <p className="text-sm text-gray-400 mt-1">Join your team on EcoFleet UK</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="input w-full" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input w-full" />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} className="input w-full" />
            </div>
            {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
            <button type="submit" disabled={busy} className="btn-primary w-full flex items-center justify-center gap-2">
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              Accept & Join
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Truck, Loader2, AlertCircle, MailWarning, X } from 'lucide-react'

export default function LoginPage() {
  const { login, register, user, sendVerification } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [verifyBanner, setVerifyBanner] = useState(false)
  const [verifySent, setVerifySent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, fullName, companyName)
      }
      const u = localStorage.getItem('ecofleet_user')
      const parsed = u ? JSON.parse(u) : null
      if (parsed && !parsed.email_verified) {
        setVerifyBanner(true)
      } else {
        router.push('/dashboard')
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const handleResendVerification = async () => {
    try {
      await sendVerification()
      setVerifySent(true)
    } catch {
      setError('Failed to send verification email')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-7 h-7 text-white" />
          </Link>
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary-700 transition">EcoFleet UK</Link>
          <p className="text-sm text-gray-400 mt-1">FORS-compliant carbon reporting</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${mode === 'login' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${mode === 'register' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="input w-full" />
                </div>
                <div>
                  <label className="label">Company Name</label>
                  <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="input w-full" />
                </div>
              </>
            )}
            <div>
              <label className="label">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="input w-full" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="input w-full" />
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <a href="/reset-password" className="text-xs text-primary-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={busy}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {verifyBanner && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <MailWarning className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Email not verified</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Please check your inbox and verify your email to access all features.</p>
                  {!verifySent ? (
                    <button onClick={handleResendVerification} className="text-xs text-primary-600 hover:underline mt-2">
                      Resend verification email
                    </button>
                  ) : (
                    <p className="text-xs text-green-600 mt-2">Verification email sent. Check your inbox.</p>
                  )}
                </div>
                <button onClick={() => setVerifyBanner(false)} className="text-amber-400 hover:text-amber-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-4">
            <a href="/terms" className="hover:underline">Terms</a> &middot;
            <a href="/privacy" className="hover:underline ml-1">Privacy</a>
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            Powered by <strong>Dvbxtreme Sp.z o.o.</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

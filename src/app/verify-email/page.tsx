'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setStatus('error'); setMessage('No verification token provided'); return }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/verification/verify?token=${token}`)
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok) { setStatus('success'); setMessage(d.message || 'Email verified!') }
        else { setStatus('error'); setMessage(d.detail || 'Verification failed') }
      })
      .catch(() => { setStatus('error'); setMessage('Network error') })
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-10 max-w-md text-center">
        {status === 'loading' && <><Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" /><p>Verifying your email...</p></>}
        {status === 'success' && <><CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" /><h2 className="text-xl font-bold mb-2">Email Verified!</h2><p className="text-sm text-gray-500 mb-6">{message}</p><button onClick={() => router.push('/')} className="btn-primary">Go to Dashboard</button></>}
        {status === 'error' && <><XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold mb-2">Verification Failed</h2><p className="text-sm text-gray-500 mb-6">{message}</p><button onClick={() => router.push('/')} className="btn-secondary">Back to Dashboard</button></>}
      </div>
    </div>
  )
}

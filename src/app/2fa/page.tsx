'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import { Loader2, Shield, Smartphone, CheckCircle } from 'lucide-react'

export default function TwoFAPage() {
  const [step, setStep] = useState<'intro' | 'setup' | 'verify' | 'done'>('intro')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSetup = async () => {
    setBusy(true)
    try {
      const res = await api.twofa.setup()
      setQrCode(res.qr_code)
      setSecret(res.secret)
      setStep('setup')
    } catch (e: any) { setError(e.message) }
    finally { setBusy(false) }
  }

  const handleVerify = async () => {
    setBusy(true)
    try {
      await api.twofa.enable(secret, code)
      setStep('done')
    } catch (e: any) { setError(e.message) }
    finally { setBusy(false) }
  }

  return (
    <div className="max-w-lg mx-auto py-10 space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6"><Shield className="w-8 h-8 text-primary-600" /><div><h1 className="text-xl font-bold">Two-Factor Authentication</h1><p className="text-sm text-gray-400">Add an extra layer of security</p></div></div>

        {step === 'intro' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Use an authenticator app like Google Authenticator or Authy to scan a QR code and generate one-time codes.</p>
            <button onClick={handleSetup} disabled={busy} className="btn-primary w-full flex items-center justify-center gap-2">{busy && <Loader2 className="w-4 h-4 animate-spin" />}<Smartphone className="w-4 h-4" /> Set Up 2FA</button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}

        {step === 'setup' && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-500">Scan this QR code with your authenticator app:</p>
            {qrCode && <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className="mx-auto w-48 h-48" />}
            <div><p className="text-xs text-gray-400 mb-1">Or enter this key manually:</p><code className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded select-all">{secret}</code><button onClick={() => { navigator.clipboard.writeText(secret); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="text-xs text-primary-600 ml-2">{copied ? 'Copied!' : 'Copy'}</button></div>
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} className="input w-full text-center text-2xl tracking-widest" />
            <button onClick={handleVerify} disabled={busy || code.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2">{busy && <Loader2 className="w-4 h-4 animate-spin" />}Verify & Enable</button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}

        {step === 'done' && (
          <div className="text-center space-y-4"><CheckCircle className="w-12 h-12 text-green-500 mx-auto" /><h2 className="text-lg font-bold">2FA Enabled</h2><p className="text-sm text-gray-500">You'll now need a code from your authenticator app each time you sign in.</p></div>
        )}
      </div>
    </div>
  )
}

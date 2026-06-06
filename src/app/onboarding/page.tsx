'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Truck, Upload, Building2, CheckCircle, Loader2, ArrowRight } from 'lucide-react'

export default function OnboardingPage() {
  const [step, setStep] = useState(0); const [companyNum, setCompanyNum] = useState(''); const [busy, setBusy] = useState(false)
  const router = useRouter()
  const steps = [{title:'Welcome',icon:Truck},{title:'Company',icon:Building2},{title:'Upload Data',icon:Upload},{title:'Ready',icon:CheckCircle}]
  const handleSearch = async () => { if(!companyNum.trim()) return; setBusy(true); try { await api.company.lookup(companyNum); setStep(2) } catch { setStep(2) } finally { setBusy(false) } }
  const handleSkip = () => setStep(prev => Math.min(prev + 1, steps.length - 1))
  return (<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><div className="w-full max-w-lg">
    <div className="mb-8"><div className="flex justify-center gap-2">{steps.map((s,i)=>(<div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${i<step?'bg-green-500 text-white':i===step?'bg-primary-700 text-white':'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>{i<step?<CheckCircle className="w-4 h-4"/>:i+1}</div>))}</div></div>
    <div className="card p-10">
      {step===0&&<div className="text-center space-y-4"><Truck className="w-16 h-16 text-primary-600 mx-auto"/><h2 className="text-2xl font-bold">Welcome to EcoFleet UK</h2><p className="text-sm text-gray-500">Let's get you set up in 3 quick steps.</p><button onClick={handleSkip} className="btn-primary w-full">Get Started <ArrowRight className="w-4 h-4 inline"/></button></div>}
      {step===1&&<div className="space-y-4"><h2 className="text-xl font-bold">Find Your Company</h2><p className="text-sm text-gray-500">Enter your Companies House number.</p><div><label className="label">Companies House Number</label><input value={companyNum} onChange={e=>setCompanyNum(e.target.value)} placeholder="e.g. 12345678" className="input w-full"/></div><div className="flex gap-3"><button onClick={handleSearch} disabled={busy} className="btn-primary flex-1 flex items-center justify-center gap-2">{busy&&<Loader2 className="w-4 h-4 animate-spin"/>}Search & Continue</button><button onClick={handleSkip} className="btn-secondary">Skip</button></div></div>}
      {step===2&&<div className="space-y-4 text-center"><Upload className="w-16 h-16 text-primary-600 mx-auto"/><h2 className="text-xl font-bold">Upload Your First Fuel Card</h2><p className="text-sm text-gray-500">Upload a CSV to generate your first report.</p><button onClick={()=>router.push('/upload')} className="btn-primary w-full">Go to Upload</button><button onClick={handleSkip} className="btn-secondary w-full">I'll do this later</button></div>}
      {step===3&&<div className="text-center space-y-4"><CheckCircle className="w-16 h-16 text-green-500 mx-auto"/><h2 className="text-xl font-bold">You're All Set!</h2><p className="text-sm text-gray-500">Your account is ready.</p><button onClick={()=>router.push('/')} className="btn-primary w-full">Go to Dashboard</button></div>}
    </div>
  </div></div>)
}

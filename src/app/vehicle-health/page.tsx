'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, VehicleOut } from '@/lib/api'
import { Loader2, Wrench } from 'lucide-react'

export default function VehicleHealthPage() {
  const [vehicles, setVehicles] = useState<VehicleOut[]>([]); const [loading, setLoading] = useState(true); const router = useRouter()
  useEffect(() => { api.vehicles.list().then(setVehicles).catch(() => {}).finally(() => setLoading(false)) }, [])
  return (<div className="space-y-8 max-w-5xl"><div><h1 className="text-2xl font-bold">Vehicle Health</h1><p className="text-sm text-gray-400 mt-1">MOT, service records, and maintenance tracking</p></div>
    {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div> : <div className="grid grid-cols-2 gap-4">{vehicles.map(v => (<div key={v.id} className="card cursor-pointer hover:shadow-md transition" onClick={() => router.push(`/vehicle-health/${v.id}`)}><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center"><Wrench className="w-5 h-5 text-amber-600" /></div><div><div className="font-bold">{v.registration}</div><div className="text-xs text-gray-400 capitalize">{v.vehicle_type.replace(/_/g, ' ')}</div></div></div><div className="text-xs text-gray-400">Click to view health records</div></div>))}</div>}</div>)
}

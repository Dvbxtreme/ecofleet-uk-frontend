'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => { api.drivers.scorecard().then(setDrivers).catch(() => {}).finally(() => setLoading(false)) }, [])
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
  return (<div className="space-y-8 max-w-5xl"><div><h1 className="text-2xl font-bold">Driver Scorecard</h1><p className="text-sm text-gray-400 mt-1">Efficiency ratings by vehicle</p></div>
    <div className="card p-0 overflow-hidden"><table className="w-full"><thead><tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-800"><th className="px-5 py-4">Vehicle</th><th className="px-5 py-4">Type</th><th className="px-5 py-4 text-right">Txns</th><th className="px-5 py-4 text-right">Fuel (L)</th><th className="px-5 py-4 text-right">CO₂e (kg)</th><th className="px-5 py-4 text-right">Cost (£)</th><th className="px-5 py-4 text-right">Efficiency</th></tr></thead>
    <tbody>{drivers.map(d => (<tr key={d.registration} className="border-b border-gray-50 dark:border-gray-800/50 text-sm"><td className="px-5 py-4 font-mono font-medium">{d.registration}</td><td className="px-5 py-4 text-gray-500 capitalize">{d.vehicle_type.replace(/_/g, ' ')}</td><td className="px-5 py-4 text-right">{d.transactions}</td><td className="px-5 py-4 text-right font-mono">{d.total_fuel_litres.toFixed(0)}</td><td className="px-5 py-4 text-right font-mono">{d.total_co2e_kg.toFixed(0)}</td><td className="px-5 py-4 text-right font-mono">£{d.total_cost_gbp.toFixed(0)}</td><td className="px-5 py-4 text-right"><div className="flex items-center justify-end gap-2"><div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={`h-full rounded-full ${d.efficiency_score >= 70 ? 'bg-green-500' : d.efficiency_score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width:`${d.efficiency_score}%`}}/></div><span className="text-xs font-medium">{Math.round(d.efficiency_score)}%</span></div></td></tr>))}</tbody></table></div></div>)
}

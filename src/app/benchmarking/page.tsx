'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Loader2, TrendingUp, BarChart3, Leaf } from 'lucide-react'

export default function BenchmarkingPage() {
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true)
  useEffect(() => { api.benchmarking.industry().then(setData).catch(() => {}).finally(() => setLoading(false)) }, [])
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
  if (!data) return <div className="text-center py-20 text-gray-400">Not enough data</div>
  const { company, industry_average, comparison } = data
  return (<div className="space-y-8 max-w-5xl"><div><h1 className="text-2xl font-bold">Benchmarking</h1><p className="text-sm text-gray-400 mt-1">Compare your fleet against industry averages</p></div>
    <div className="grid grid-cols-3 gap-6">
      <div className="card"><div className="flex items-center gap-3 mb-4"><BarChart3 className="w-5 h-5 text-primary-600" /><h3 className="font-semibold text-sm">CO₂e vs Industry</h3></div><div className="flex items-end gap-4"><div><div className="text-xs text-gray-400">Your Fleet</div><div className="text-2xl font-bold">{company.total_co2e_kg.toLocaleString()} kg</div></div><div className="text-sm text-gray-400 pb-1">vs</div><div><div className="text-xs text-gray-400">Industry Avg</div><div className="text-2xl font-bold">{industry_average.total_co2e_kg.toLocaleString()} kg</div></div></div><div className="mt-3 text-sm"><span className={comparison.co2_vs_industry_pct <= 100 ? 'text-green-600' : 'text-amber-600'}>{comparison.co2_vs_industry_pct}% of industry average</span></div></div>
      <div className="card"><div className="flex items-center gap-3 mb-4"><Leaf className="w-5 h-5 text-green-600" /><h3 className="font-semibold text-sm">HVO Adoption</h3></div><div className="text-2xl font-bold">{company.hvo_percentage}%</div><div className="text-xs text-gray-400 mt-1">of your fuel is HVO</div></div>
      <div className="card"><div className="flex items-center gap-3 mb-4"><TrendingUp className="w-5 h-5 text-primary-600" /><h3 className="font-semibold text-sm">CO₂ per Vehicle</h3></div><div className="text-2xl font-bold">{company.co2e_per_vehicle.toLocaleString()} kg</div><div className="text-xs text-gray-400 mt-1">per vehicle this month</div></div>
    </div>
  </div>)
}

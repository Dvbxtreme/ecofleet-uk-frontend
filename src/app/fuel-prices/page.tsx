'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function FuelPricesPage() {
  const [trend, setTrend] = useState<any[]>([]); const [latest, setLatest] = useState<any[]>([]); const [fuelType, setFuelType] = useState('diesel'); const [loading, setLoading] = useState(true)
  useEffect(() => { Promise.all([api.fuelPrices.trends(fuelType, 90).catch(() => []), api.fuelPrices.latest().catch(() => [])]).then(([t, l]) => { setTrend(t); setLatest(l) }).finally(() => setLoading(false)) }, [fuelType])
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
  return (<div className="space-y-8 max-w-5xl">
    <div><h1 className="text-2xl font-bold">Fuel Prices</h1><p className="text-sm text-gray-400 mt-1">Track UK fuel price trends from your transaction data</p></div>
    <div className="grid grid-cols-4 gap-4">{latest.map(l => (<div key={l.fuel_type} className="card"><div className="label capitalize">{l.fuel_type}</div><div className="text-2xl font-bold">{l.avg_price_pence}p</div><div className="text-xs text-gray-400">{l.samples} samples</div></div>))}</div>
    <div className="card"><div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">Price Trend (90 days)</h3><select value={fuelType} onChange={e => setFuelType(e.target.value)} className="input text-sm py-1.5"><option value="diesel">Diesel</option><option value="hvo">HVO</option><option value="petrol">Petrol</option><option value="lng">LNG</option></select></div>
    {trend.length > 0 ? (<ResponsiveContainer width="100%" height={300}><LineChart data={trend}><XAxis dataKey="date" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} domain={['auto','auto']}/><Tooltip/><Line type="monotone" dataKey="avg_price_pence" stroke="#1a365d" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer>) : <p className="text-sm text-gray-400">No price data yet</p>}</div>
  </div>)
}

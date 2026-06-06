'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api, VehicleDetailStats, VehicleTransaction, VehicleTrend } from '@/lib/api'
import { formatNumber, formatDate } from '@/lib/utils'
import { ArrowLeft, Loader2, Fuel, TrendingDown, PoundSterling, Truck } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [stats, setStats] = useState<VehicleDetailStats | null>(null)
  const [txs, setTxs] = useState<VehicleTransaction[]>([])
  const [trend, setTrend] = useState<VehicleTrend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.vehicles.detail(id),
      api.vehicles.transactions(id, 50),
      api.vehicles.trend(id, 6),
    ]).then(([s, t, tr]) => {
      setStats(s)
      setTxs(t)
      setTrend(tr)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
  if (!stats) return <div className="text-center py-20 text-gray-400">Vehicle not found</div>

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/vehicles" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.registration}</h1>
          <p className="text-sm text-gray-400 capitalize">{stats.vehicle_type.replace(/_/g, ' ')} · {stats.fuel_type.toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card"><div className="label">Total CO₂e</div><div className="text-2xl font-bold">{formatNumber(stats.total_co2e_kg)} kg</div></div>
        <div className="card"><div className="label">Total Fuel</div><div className="text-2xl font-bold">{formatNumber(stats.total_fuel_litres)} L</div></div>
        <div className="card"><div className="label">Total Cost</div><div className="text-2xl font-bold">£{formatNumber(stats.total_cost_gbp)}</div></div>
        <div className="card"><div className="label">This Month CO₂e</div><div className="text-2xl font-bold">{formatNumber(stats.this_month_co2e_kg)} kg</div></div>
      </div>

      {trend.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Trend (CO₂e)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trend}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="co2e_kg" fill="#1a365d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Transactions</h3>
        {txs.length === 0 ? (
          <p className="text-sm text-gray-400">No transactions recorded.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Fuel Type</th>
                <th className="pb-3 pr-4 text-right">Quantity</th>
                <th className="pb-3 pr-4 text-right">Cost (£)</th>
                <th className="pb-3 text-right">CO₂e (kg)</th>
              </tr>
            </thead>
            <tbody>
              {txs.map(tx => (
                <tr key={tx.id} className="border-t border-gray-100 dark:border-gray-800 text-sm">
                  <td className="py-3 pr-4 text-gray-500">{formatDate(tx.date)}</td>
                  <td className="py-3 pr-4 capitalize">{tx.fuel_type}</td>
                  <td className="py-3 pr-4 text-right font-mono">{tx.quantity?.toFixed(1)}</td>
                  <td className="py-3 pr-4 text-right font-mono">{tx.cost_gbp?.toFixed(2) || '—'}</td>
                  <td className="py-3 text-right font-mono">{tx.co2e_kg?.toFixed(1) || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

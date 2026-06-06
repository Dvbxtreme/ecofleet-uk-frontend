'use client'

import { useEffect, useState } from 'react'
import { api, DashboardStats } from '@/lib/api'
import { formatCO2, formatNumber } from '@/lib/utils'
import MetricCard from '@/components/MetricCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Truck, Fuel, TrendingDown, Leaf } from 'lucide-react'

const monthlyData = [
  { month: 'Nov', co2: 8450 },
  { month: 'Dec', co2: 9200 },
  { month: 'Jan', co2: 8100 },
  { month: 'Feb', co2: 7800 },
  { month: 'Mar', co2: 7400 },
  { month: 'Apr', co2: 6720 },
]

const vehicleMix = [
  { name: 'Diesel', value: 78 },
  { name: 'HVO', value: 18 },
  { name: 'Other', value: 4 },
]
const COLORS = ['#1a365d', '#38a169', '#94a3b8']

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    api.dashboard().then(setStats).catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">APRIL 2026</p>
        </div>
        <span className="bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full border border-primary-200">
          DEFRA 2025
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="This Month CO₂e"
          value={stats ? formatCO2(stats.current_month_co2e) : '—'}
          sub={stats ? `${formatNumber(stats.total_transactions)} transactions` : undefined}
          icon={<Truck className="w-5 h-5" />}
          trend={stats && stats.change_percentage < 0 ? 'down' : stats && stats.change_percentage > 0 ? 'up' : 'neutral'}
        />
        <MetricCard
          label="Per Vehicle"
          value={stats ? formatCO2(stats.avg_per_vehicle) : '—'}
          sub={stats ? `${stats.total_vehicles} vehicles` : undefined}
          icon={<Fuel className="w-5 h-5" />}
        />
        <MetricCard
          label="HVO Savings"
          value={stats ? formatCO2(stats.hvo_savings_kg) : '—'}
          sub="vs diesel baseline"
          icon={<Leaf className="w-5 h-5 text-green-600" />}
          trend="down"
        />
        <MetricCard
          label="vs Last Month"
          value={stats ? `${stats.change_percentage > 0 ? '+' : ''}${stats.change_percentage}%` : '—'}
          sub={stats ? `${formatCO2(stats.previous_month_co2e)} prior` : undefined}
          icon={<TrendingDown className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Monthly Emissions (kg CO₂e)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number) => [`${v.toLocaleString()} kg`, 'CO₂e']}
              />
              <Bar dataKey="co2" fill="#1a365d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Fuel Mix</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={vehicleMix} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {vehicleMix.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-primary-700 text-white rounded-xl p-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-primary-200">FORS Compliance</div>
          <div className="text-lg font-bold mt-1">Your data is ready for Silver reporting</div>
          <div className="text-sm text-primary-200 mt-1">Upload fuel card data and generate a FORS-ready PDF in 30 seconds</div>
        </div>
        <a href="/upload" className="bg-white text-primary-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
          Upload Now
        </a>
      </div>
    </div>
  )
}

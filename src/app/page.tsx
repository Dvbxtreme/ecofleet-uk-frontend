'use client'

import { useAuth } from '@/lib/auth'
import { useEffect, useState } from 'react'
import { api, DashboardStats } from '@/lib/api'
import { formatCO2, formatNumber } from '@/lib/utils'
import MetricCard from '@/components/MetricCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Truck, Fuel, TrendingDown, Leaf, ArrowRight, Shield, FileText, BarChart3, Users, CreditCard, Check } from 'lucide-react'

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

const plans = [
  {
    name: 'Starter',
    price: '£199',
    period: '/month',
    vehicles: 10,
    features: ['Up to 10 vehicles', 'DEFRA 2025 calculations', 'FORS Silver-ready reports', 'Fuel card CSV upload', 'Monthly emissions dashboard', 'Email support'],
    badge: null,
  },
  {
    name: 'Business',
    price: '£449',
    period: '/month',
    vehicles: 50,
    features: ['Up to 50 vehicles', 'Everything in Starter', 'FORS Silver & Gold reports', 'Multi-department tracking', 'HVO savings analysis', 'SECR compliance export', 'Priority support'],
    badge: 'Popular',
  },
  {
    name: 'Enterprise',
    price: '£999',
    period: '/month',
    vehicles: 9999,
    features: ['Unlimited vehicles', 'Everything in Business', 'White-label PDF reports', 'REST API access', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee'],
    badge: null,
  },
]

const features = [
  { icon: FileText, title: 'FORS-ready Reports', desc: 'Generate Silver & Gold compliant reports in 30 seconds from your fuel card data.' },
  { icon: BarChart3, title: 'DEFRA 2025 Factors', desc: 'Built-in UK government emission factors — always up to date with the latest DEFRA release.' },
  { icon: Truck, title: 'Fleet-wide Tracking', desc: 'Monitor CO₂e across your entire fleet — diesel, HVO, electric, and hybrid.' },
  { icon: Users, title: 'Multi-user Teams', desc: 'Invite your team, assign roles, and manage access with company-level isolation.' },
  { icon: Shield, title: 'SECR Compliance', desc: 'Streamlined reporting for Streamlined Energy and Carbon Reporting regulations.' },
  { icon: CreditCard, title: 'Simple Billing', desc: 'Monthly subscription, no hidden fees. Upgrade, downgrade or cancel anytime.' },
]

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary-700" />
            <span className="font-bold text-lg text-gray-900">EcoFleet UK</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2">Sign In</a>
            <a href="/login?tab=register" className="text-sm bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition font-medium">Get Started</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full border border-primary-200 mb-6">
          DEFRA 2025 Compliant
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
          Carbon Reporting for<br />Fleet Operators
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Track, report, and reduce your fleet's CO₂ emissions. FORS-ready, SECR-compliant,
          and powered by the latest DEFRA emission factors.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="/login?tab=register" className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition inline-flex items-center gap-2">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#pricing" className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-200 hover:border-gray-300 transition">
            View Pricing
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Everything you need for compliance</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">From fuel card uploads to FORS-ready PDF reports — one platform for your entire fleet.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Simple, transparent pricing</h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">No hidden fees. All plans include DEFRA 2025 factors, FORS-ready reports, and email support.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-xl border ${plan.badge === 'Popular' ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200'} bg-white p-6 relative`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-700 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Up to {plan.vehicles.toLocaleString()} vehicles</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/login?tab=register"
                className={`block text-center w-full py-2.5 rounded-lg text-sm font-semibold transition ${plan.badge === 'Popular' ? 'bg-primary-700 text-white hover:bg-primary-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-gray-400">
          <span>&copy; {new Date().getFullYear()} Dvbxtreme Sp.z o.o. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-gray-600">Privacy</a>
            <a href="/terms" className="hover:text-gray-600">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Dashboard() {
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

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Dashboard />
  }

  return <LandingPage />
}

'use client'

import Link from 'next/link'
import { CheckCircle, ArrowRight, Truck } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '£49',
    period: '/month',
    desc: 'For small fleets getting started with carbon reporting.',
    features: ['Up to 10 vehicles', 'DEFRA-compliant CO2e reports', 'Fuel data upload & analysis', 'Monthly emissions dashboard', 'FORS Silver-ready PDFs', 'Email support'],
    popular: false,
  },
  {
    name: 'Business',
    price: '£99',
    period: '/month',
    desc: 'For growing fleets needing full compliance reporting.',
    features: ['Up to 50 vehicles', 'Everything in Starter, plus:', 'EV Transition Planner', 'HVO savings tracking', 'FORS Gold-ready reports', 'Multi-user access', 'Priority support'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '£199',
    period: '/month',
    desc: 'For large fleets with advanced analytics needs.',
    features: ['Unlimited vehicles', 'Everything in Business, plus:', 'API access & integrations', 'Custom report builder', 'Benchmarking & analytics', 'Dedicated account manager', '24/7 phone support'],
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center"><Truck className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-primary-700">EcoFleet UK</span>
          </Link>
          <Link href="/login" className="btn-primary text-xs px-5 py-2.5">Sign In</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-14">
          <h1 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h1>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto">All plans include FORS-ready reports, fuel data upload, and EV transition analysis. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <div key={i} className={`bg-white rounded-xl border p-8 relative ${p.popular ? 'border-primary-700 shadow-md ring-1 ring-primary-700' : 'border-gray-200'}`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
              <p className="text-sm text-gray-400 mt-1 mb-4">{p.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{p.price}</span>
                <span className="text-sm text-gray-400">{p.period}</span>
              </div>
              <Link href="/login" className={`block text-center text-sm font-medium py-3 rounded-lg transition mb-8 ${p.popular ? 'btn-primary' : 'btn-secondary'}`}>
                Start Free Trial <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
              <ul className="space-y-3">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-400">All prices exclude VAT. Need a custom plan?</p>
          <a href="mailto:sales@dvbxtreme.com" className="text-sm text-primary-700 hover:underline font-medium">Contact sales</a>
        </div>
      </div>

      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © 2026 Dvbxtreme Sp.z o.o.
        </div>
      </footer>
    </div>
  )
}

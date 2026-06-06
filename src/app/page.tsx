'use client'

import Link from 'next/link'
import { Truck, BarChart3, Leaf, Upload, FileText, Zap, CheckCircle, ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

const features = [
  { icon: BarChart3, title: 'Carbon Reporting', desc: 'DEFRA-compliant CO2e reports ready for FORS Silver & Gold accreditation.' },
  { icon: Upload, title: 'Fuel Data Upload', desc: 'Upload fuel card data in seconds. Auto-calculates emissions per vehicle.' },
  { icon: Leaf, title: 'HVO Savings Tracker', desc: 'Track Hydrotreated Vegetable Oil usage and carbon savings vs diesel.' },
  { icon: Zap, title: 'EV Transition Planner', desc: 'AI-powered analysis of your fleet for EV suitability with cost savings projections.' },
  { icon: FileText, title: 'FORS-Ready Reports', desc: 'Generate audit-ready PDF reports compliant with FORS standards.' },
  { icon: Truck, title: 'Fleet Management', desc: 'Comprehensive vehicle tracking, fuel consumption, and cost analysis.' },
]

const plans = [
  {
    name: 'Starter',
    price: '£49',
    period: '/month',
    desc: 'For small fleets getting started with carbon reporting.',
    feature: 'Up to 10 vehicles',
    popular: false,
  },
  {
    name: 'Business',
    price: '£99',
    period: '/month',
    desc: 'For growing fleets needing full compliance reporting.',
    feature: 'Up to 50 vehicles',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '£199',
    period: '/month',
    desc: 'For large fleets with advanced analytics needs.',
    feature: 'Unlimited vehicles',
    popular: false,
  },
]

const testimonials = [
  { text: 'EcoFleet UK cut our FORS Silver prep from 3 days to 30 minutes. The EV transition planner alone saved us £12k in year one.', author: 'Operations Director', company: 'London Logistics Ltd' },
  { text: 'The DEFRA-compliant reporting is a game-changer. We got FORS Gold on our first audit.', author: 'Fleet Manager', company: 'northwest Haulage' },
]

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-primary-700">EcoFleet UK</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-gray-800 transition">Features</a>
            <a href="#pricing" className="hover:text-gray-800 transition">Pricing</a>
            <a href="/ev-calculator" className="hover:text-gray-800 transition">EV Calculator</a>
            <Link href="/login" className="text-primary-700 hover:text-primary-800 transition">Sign In</Link>
            <Link href="/login" className="btn-primary text-xs px-5 py-2.5">Get Started</Link>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-500">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-3 bg-white">
            <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-600">Features</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-600">Pricing</a>
            <a href="/ev-calculator" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-600">EV Calculator</a>
            <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-primary-700 font-medium">Sign In</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-sm btn-primary text-center">Get Started</Link>
          </div>
        )}
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Leaf className="w-3.5 h-3.5" /> DEFRA 2025 Compliant
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Carbon Reporting for<br />
            <span className="text-primary-700">UK Fleet Operators</span>
          </h1>
          <p className="text-lg text-gray-400 mt-6 max-w-xl mx-auto leading-relaxed">
            FORS-ready, DEFRA-compliant CO2e reporting. Upload fuel data, track emissions, plan your EV transition, and generate audit-ready reports in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/login" className="btn-primary text-sm px-8 py-3.5 w-full sm:w-auto text-center">
              Start Free Trial
            </Link>
            <a href="#features" className="btn-secondary text-sm px-8 py-3.5 w-full sm:w-auto text-center">
              See Features
            </a>
          </div>
          <div className="flex items-center justify-center gap-8 mt-10 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> FORS Silver/Gold</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> UK support</span>
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Everything you need for compliance</h2>
            <p className="text-gray-400 mt-3">Built for UK fleet operators, designed for FORS accreditation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="text-gray-400 mt-3">All plans include FORS-ready reports, fuel data upload, and EV transition analysis.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((p, i) => (
              <div key={i} className={`rounded-xl border p-6 relative ${p.popular ? 'border-primary-700 shadow-md' : 'border-gray-200'}`}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-bold text-gray-900">{p.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{p.desc}</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">{p.price}</span>
                  <span className="text-sm text-gray-400">{p.period}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <CheckCircle className="w-4 h-4 text-green-500" /> {p.feature}
                </div>
                <Link href="/login" className={`block text-center text-sm font-medium py-2.5 rounded-lg transition ${p.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to simplify your carbon reporting?</h2>
          <p className="text-primary-200 mt-3 mb-8">Join UK fleet operators who trust EcoFleet for their FORS compliance.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-lg hover:bg-gray-100 transition">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-14">Trusted by fleet operators</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
                <div className="text-sm font-medium text-gray-900">{t.author}</div>
                <div className="text-xs text-gray-400">{t.company}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div>© 2026 Dvbxtreme Sp.z o.o. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
            <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

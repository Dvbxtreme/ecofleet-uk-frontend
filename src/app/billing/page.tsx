'use client'

import { useEffect, useState } from 'react'
import { api, PlanInfo, SubscriptionInfo } from '@/lib/api'
import { CheckCircle, Loader2, ArrowUp, Star, Zap } from 'lucide-react'

const PLAN_ICONS: Record<string, React.ReactNode> = {
  starter: <Star className="w-8 h-8" />,
  business: <Zap className="w-8 h-8" />,
  enterprise: <ArrowUp className="w-8 h-8" />,
}

export default function BillingPage() {
  const [plans, setPlans] = useState<PlanInfo[]>([])
  const [current, setCurrent] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([api.plans.list(), api.subscription.current()])
      .then(([p, s]) => { setPlans(p); setCurrent(s) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleUpgrade = async (code: string) => {
    setUpgrading(code)
    try {
      const result = await api.subscription.createCheckout(code)
      if (result.url) {
        window.location.href = result.url
      } else if (result.dev_mode) {
        // Dev mode — instant upgrade
        const updated = await api.subscription.current()
        setCurrent(updated)
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setUpgrading(null)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plan</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your subscription</p>
      </div>

      {current && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Current Plan</div>
              <div className="text-xl font-bold text-gray-900 mt-1">{current.plan_name}</div>
              <div className="text-sm text-gray-400">£{current.price_gbp}/mo</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Vehicles</div>
              <div className="text-lg font-semibold">{current.vehicles_used} / {current.max_vehicles}</div>
              <div className="w-40 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (current.vehicles_used / current.max_vehicles) * 100)}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {current.includes_secr && <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">SECR Ready</span>}
            {current.includes_white_label && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">White Label</span>}
            {current.includes_api && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full font-medium">API Access</span>}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Available Plans</h2>
        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = current?.plan_code === plan.code
            const isUpgrade = !isCurrent && (plan.code === 'business' || plan.code === 'enterprise')
            return (
              <div
                key={plan.code}
                className={`bg-white rounded-xl border-2 p-6 flex flex-col ${isCurrent ? 'border-primary-500' : 'border-gray-200'}`}
              >
                <div className="text-primary-600 mb-3">{PLAN_ICONS[plan.code]}</div>
                <div className="text-lg font-bold text-gray-900">{plan.name}</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">£{plan.price_gbp}<span className="text-sm text-gray-400 font-normal">/mo</span></div>

                <ul className="mt-6 space-y-3 flex-1">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    Up to {plan.max_vehicles >= 9999 ? 'unlimited' : plan.max_vehicles} vehicles
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    DEFRA-compliant reports
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    FORS Silver/Gold ready
                  </li>
                  {plan.includes_secr && (
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      SECR reporting
                    </li>
                  )}
                  {plan.includes_white_label && (
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      White-label PDF
                    </li>
                  )}
                  {plan.includes_api && (
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      API access
                    </li>
                  )}
                </ul>

                {isCurrent ? (
                  <div className="mt-6 text-center text-sm text-primary-600 font-medium bg-primary-50 py-2.5 rounded-lg">
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.code)}
                    disabled={upgrading === plan.code}
                    className="mt-6 w-full bg-primary-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {upgrading === plan.code && <Loader2 className="w-4 h-4 animate-spin" />}
                    {plan.price_gbp > (current?.price_gbp || 0) ? 'Upgrade' : 'Downgrade'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

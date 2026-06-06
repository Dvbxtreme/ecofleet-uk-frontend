'use client'
import { useEffect, useState } from 'react'
import { api, EVAnalysisResult, EVFleetSummary, EVPlanOut } from '@/lib/api'
import { Loader2, Zap, ArrowUp, CheckCircle, XCircle, Car, Leaf, TrendingDown, PoundSterling, Calendar, BarChart3 } from 'lucide-react'

export default function EVPage() {
  const [vehicles, setVehicles] = useState<EVAnalysisResult[]>([])
  const [plans, setPlans] = useState<EVPlanOut[]>([])
  const [summary, setSummary] = useState<EVFleetSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState<string | null>(null)
  const [tab, setTab] = useState<'overview' | 'fleet'>('overview')

  useEffect(() => {
    Promise.all([
      api.ev.vehicles().catch(() => [] as EVAnalysisResult[]),
      api.ev.plans.list().catch(() => [] as EVPlanOut[]),
      api.ev.fleetSummary().catch(() => null),
    ]).then(([v, p, s]) => {
      setVehicles(v)
      setPlans(p)
      setSummary(s)
    }).finally(() => setLoading(false))
  }, [])

  const handleConvert = async (vehicleId: string) => {
    setConverting(vehicleId)
    try {
      const plan = await api.ev.plans.create(vehicleId)
      setPlans(prev => [plan, ...prev])
    } catch (e: any) {
      alert(e.message)
    } finally {
      setConverting(null)
    }
  }

  const handleUpdateStatus = async (planId: string, status: string) => {
    await api.ev.plans.update(planId, { status })
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, status } : p))
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'fleet', label: 'Fleet Analysis', icon: Car },
  ] as const

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">EV Transition Planner</h1>
        <p className="text-sm text-gray-400 mt-1">Analyse your fleet for electric vehicle suitability and plan your transition</p>
      </div>

      {summary && (
        <div className="grid grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-3"><Car className="w-5 h-5 text-primary-600" /><div className="text-xs text-gray-400">Total Vehicles</div></div>
            <div className="text-2xl font-bold">{summary.total_vehicles}</div>
          </div>
          <div className="card border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-3"><CheckCircle className="w-5 h-5 text-green-600" /><div className="text-xs text-gray-400">EV Ready</div></div>
            <div className="text-2xl font-bold text-green-600">{summary.suitable_for_ev}</div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3 mb-3"><PoundSterling className="w-5 h-5 text-amber-600" /><div className="text-xs text-gray-400">Annual Saving Potential</div></div>
            <div className="text-2xl font-bold text-amber-600">L{summary.total_annual_saving_potential_gbp.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3 mb-3"><Leaf className="w-5 h-5 text-green-600" /><div className="text-xs text-gray-400">CO2 Reduction / Year</div></div>
            <div className="text-2xl font-bold text-green-600">{(summary.total_co2_saving_potential_kg / 1000).toFixed(1)}t</div>
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-px">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${tab === t.key ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          ><t.icon className="w-4 h-4" />{t.label}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          {plans.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Transition Plans</h2>
              <div className="grid gap-4">
                {plans.map(plan => (
                  <div key={plan.id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-bold text-lg">{plan.registration}</div>
                        <div className="text-sm text-gray-400 capitalize">{plan.vehicle_type.replace(/_/g, ' ')}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${plan.status === 'completed' ? 'bg-green-50 text-green-700' : plan.status === 'ordered' ? 'bg-blue-50 text-blue-700' : plan.status === 'planned' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-600'}`}>
                          {plan.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div><span className="label">Suggested EV</span><p className="font-medium">{plan.suggested_ev_make} {plan.suggested_ev_model}</p></div>
                      <div><span className="label">Range</span><p className="font-medium">{plan.suggested_ev_range_miles} miles</p></div>
                      <div><span className="label">Annual Saving</span><p className="font-medium text-green-600">L{plan.total_annual_saving_gbp.toLocaleString()}</p></div>
                      <div><span className="label">CO2 Reduction</span><p className="font-medium text-green-600">{(plan.co2_saving_kg_per_year / 1000).toFixed(1)}t/year</p></div>
                      <div><span className="label">EV Price</span><p className="font-medium">L{plan.ev_price_gbp.toLocaleString()}</p></div>
                      <div><span className="label">Payback</span><p className="font-medium">{plan.payback_years} years</p></div>
                      <div><span className="label">Annual Miles</span><p className="font-medium">{plan.annual_miles.toLocaleString()}</p></div>
                      <div><span className="label">Score</span><p className="font-medium">{plan.suitability_score}/100</p></div>
                    </div>
                    {plan.status !== 'completed' && (
                      <div className="mt-4 flex gap-2">
                        {plan.status === 'planned' && <button onClick={() => handleUpdateStatus(plan.id, 'ordered')} className="btn-primary text-xs px-3 py-1.5">Mark as Ordered</button>}
                        {plan.status === 'ordered' && <button onClick={() => handleUpdateStatus(plan.id, 'completed')} className="btn-primary text-xs px-3 py-1.5">Mark as Completed</button>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {plans.length === 0 && (
            <div className="card text-center py-12">
              <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400">No transition plans yet. Go to Fleet Analysis to create one.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'fleet' && (
        <div className="space-y-4">
          {vehicles.length === 0 ? (
            <div className="card text-center py-12">
              <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400">No vehicles found. Upload fuel data first.</p>
            </div>
          ) : (
            vehicles.map(v => {
              const hasPlan = plans.some(p => p.vehicle_id === v.vehicle_id)
              return (
                <div key={v.vehicle_id} className={`card ${v.suitable_for_ev ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-300'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${v.suitable_for_ev ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                        {v.suitable_for_ev ? <Leaf className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div>
                        <div className="font-bold">{v.registration}</div>
                        <div className="text-xs text-gray-400 capitalize">{v.vehicle_type.replace(/_/g, ' ')} &middot; {v.annual_miles.toLocaleString()} mi/yr</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {v.suggested_ev && <span className="text-xs font-medium text-primary-600">{v.suggested_ev.make} {v.suggested_ev.model}</span>}
                      <div className={`text-xs font-bold px-2 py-1 rounded-full ${v.suitability_score >= 70 ? 'bg-green-50 text-green-700' : v.suitability_score >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                        {v.suitability_score}/100
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="label">Annual Fuel</span>
                      <p className="font-medium">L{v.annual_fuel_cost_gbp.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="label">Annual Electric</span>
                      <p className="font-medium">L{v.annual_electric_cost_gbp.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="label">Total Saving</span>
                      <p className={`font-bold ${v.total_annual_saving_gbp > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        L{v.total_annual_saving_gbp.toLocaleString()}/yr
                      </p>
                    </div>
                    <div>
                      <span className="label">CO2 Reduction</span>
                      <p className="font-medium text-green-600">{(v.co2_saving_kg_per_year / 1000).toFixed(1)}t/yr</p>
                    </div>
                    <div>
                      <span className="label">EV Price</span>
                      <p className="font-medium">L{v.ev_price_gbp.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="label">Payback</span>
                      <p className="font-medium">{v.payback_years} years</p>
                    </div>
                    <div>
                      <span className="label">Daily Miles</span>
                      <p className="font-medium">{v.avg_daily_miles} mi</p>
                    </div>
                    <div>
                      <span className="label">EV Range</span>
                      <p className="font-medium">{v.suggested_ev?.range_miles || '-'} mi</p>
                    </div>
                  </div>

                  {v.notes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {v.notes.map((note, i) => (
                        <span key={i} className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">{note}</span>
                      ))}
                    </div>
                  )}

                  {!hasPlan && v.suitable_for_ev && (
                    <button
                      onClick={() => handleConvert(v.vehicle_id)}
                      disabled={converting === v.vehicle_id}
                      className="btn-primary text-xs px-4 py-2 flex items-center gap-2"
                    >
                      {converting === v.vehicle_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
                      Create Transition Plan
                    </button>
                  )}
                  {hasPlan && (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Transition Plan Created
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
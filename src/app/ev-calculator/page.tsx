'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Truck, Car, Leaf, PoundSterling, Calculator, ArrowRight, Zap, TrendingDown } from 'lucide-react'

const UK_EV_DATA = [
  { make: 'MG', model: 'MG4 EV Long Range', range: 270, price: 29995, battery: 64, efficiency: 3.9 },
  { make: 'MG', model: 'MG5 EV Long Range', range: 250, price: 31995, battery: 61, efficiency: 3.7 },
  { make: 'Tesla', model: 'Model 3 RWD', range: 318, price: 42990, battery: 60, efficiency: 4.5 },
  { make: 'Tesla', model: 'Model Y RWD', range: 283, price: 44990, battery: 60, efficiency: 4.0 },
  { make: 'Kia', model: 'Niro EV', range: 285, price: 36995, battery: 64, efficiency: 3.8 },
  { make: 'Kia', model: 'EV6 RWD', range: 328, price: 45995, battery: 77, efficiency: 3.9 },
  { make: 'Hyundai', model: 'Kona Electric', range: 260, price: 34995, battery: 65, efficiency: 3.9 },
  { make: 'Hyundai', model: 'IONIQ 5 RWD', range: 315, price: 44995, battery: 77, efficiency: 3.8 },
  { make: 'Vauxhall', model: 'Vivaro Electric LWB', range: 208, price: 43995, battery: 75, efficiency: 2.6 },
  { make: 'Vauxhall', model: 'Combo Electric', range: 174, price: 32995, battery: 50, efficiency: 2.8 },
  { make: 'Peugeot', model: 'e-Expert', range: 211, price: 42995, battery: 75, efficiency: 2.6 },
  { make: 'Ford', model: 'E-Transit 350 LWB', range: 154, price: 46995, battery: 68, efficiency: 2.1 },
  { make: 'Maxus', model: 'eDeliver 9 LWB', range: 185, price: 49995, battery: 72, efficiency: 2.3 },
  { make: 'Mercedes', model: 'eSprinter', range: 162, price: 52995, battery: 81, efficiency: 2.2 },
]

const FUEL_TYPES: Record<string, { mpg: number; fuelPrice: number; co2PerMile: number }> = {
  diesel: { mpg: 28, fuelPrice: 1.55, co2PerMile: 0.37 },
  petrol: { mpg: 32, fuelPrice: 1.45, co2PerMile: 0.32 },
  hvo: { mpg: 28, fuelPrice: 1.85, co2PerMile: 0.08 },
}

const ELECTRIC_RATE = 0.075 // £ per kWh (low-rate overnight)
const P11D_BENEFIT_EV = 0.02 // 2%
const P11D_BENEFIT_DIESEL = 0.37 // 37%

export default function EVCalculatorPage() {
  const [step, setStep] = useState<'form' | 'results'>('form')
  const [numVehicles, setNumVehicles] = useState(10)
  const [annualMiles, setAnnualMiles] = useState(15000)
  const [fuelType, setFuelType] = useState('diesel')
  const [vehicleType, setVehicleType] = useState('van')
  const [results, setResults] = useState<any>(null)

  const handleCalculate = () => {
    const ev = UK_EV_DATA.filter(v => {
      if (vehicleType === 'van') return ['Vauxhall Vivaro', 'Peugeot e-Expert', 'Ford E-Transit', 'Maxus eDeliver', 'Mercedes eSprinter', 'Vauxhall Combo', 'Vivaro'].some(s => v.model.includes(s))
      return !['Vauxhall Vivaro', 'Peugeot e-Expert', 'Ford E-Transit', 'Maxus eDeliver', 'Mercedes eSprinter', 'Vauxhall Combo'].some(s => v.model.includes(s))
    })
    const selectedEV = ev[Math.floor(Math.random() * ev.length)] || UK_EV_DATA[0]
    const fuel = FUEL_TYPES[fuelType]
    const annualFuelCost = numVehicles * annualMiles / fuel.mpg * fuel.fuelPrice
    const annualEVFuelCost = numVehicles * annualMiles * ELECTRIC_RATE / selectedEV.efficiency
    const annualMaintenanceCost = numVehicles * 1200
    const annualEVMaintenanceCost = numVehicles * 450
    const annualTaxCost = numVehicles * 320
    const annualEVTaxCost = 0
    const annualULEZCost = fuelType === 'diesel' ? numVehicles * 12.50 * 52 : 0
    const totalSavings = (annualFuelCost - annualEVFuelCost) + (annualMaintenanceCost - annualEVMaintenanceCost) + annualTaxCost + annualULEZCost
    const co2Saving = numVehicles * annualMiles * fuel.co2PerMile
    const evCost = numVehicles * selectedEV.price
    const payback = totalSavings > 0 ? evCost / totalSavings : 99

    setResults({ annualFuelCost, annualEVFuelCost, annualMaintenanceCost, annualEVMaintenanceCost, annualTaxCost, annualEVTaxCost, annualULEZCost, totalSavings, co2Saving, evCost, payback, selectedEV })
    setStep('results')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center"><Truck className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-primary-700">EcoFleet UK</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-primary-700 font-medium hover:underline">Sign In</Link>
            <Link href="/login" className="btn-primary text-xs px-5 py-2.5">Get Started</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-12 pb-20">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Free EV Fleet Savings Calculator</h1>
          <p className="text-gray-400 mt-2">See how much your fleet could save by switching to electric vehicles.</p>
        </div>

        {step === 'form' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-lg mx-auto">
            <div className="space-y-5">
              <div>
                <label className="label">Vehicle type</label>
                <div className="flex gap-2 mt-1">
                  {['van', 'car'].map(t => (
                    <button key={t} onClick={() => setVehicleType(t)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition ${vehicleType === t ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <span className="capitalize">{t === 'van' ? '🚐 Vans' : '🚗 Cars'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Fuel type</label>
                <div className="flex gap-2 mt-1">
                  {Object.entries({ diesel: '⛽ Diesel', petrol: '⛽ Petrol', hvo: '🌿 HVO' }).map(([k, v]) => (
                    <button key={k} onClick={() => setFuelType(k)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition ${fuelType === k ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Number of vehicles</label>
                <input type="range" min={1} max={100} value={numVehicles} onChange={e => setNumVehicles(Number(e.target.value))}
                  className="w-full accent-primary-700 mt-2" />
                <div className="text-center text-sm font-medium text-gray-700 mt-1">{numVehicles} vehicle{numVehicles > 1 ? 's' : ''}</div>
              </div>
              <div>
                <label className="label">Average annual miles per vehicle</label>
                <input type="range" min={5000} max={50000} step={1000} value={annualMiles} onChange={e => setAnnualMiles(Number(e.target.value))}
                  className="w-full accent-primary-700 mt-2" />
                <div className="text-center text-sm font-medium text-gray-700 mt-1">{annualMiles.toLocaleString()} mi/yr</div>
              </div>
              <button onClick={handleCalculate} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                <Calculator className="w-4 h-4" /> Calculate Savings
              </button>
            </div>
          </div>
        )}

        {step === 'results' && results && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className="text-xs text-gray-400 mb-1">Annual Saving</div>
                <div className="text-xl font-bold text-green-600">£{Math.round(results.totalSavings).toLocaleString()}</div>
                <div className="text-xs text-gray-400">for {numVehicles} vehicles</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className="text-xs text-gray-400 mb-1">CO₂ Reduction</div>
                <div className="text-xl font-bold text-green-600">{(results.co2Saving / 1000).toFixed(0)}t</div>
                <div className="text-xs text-gray-400">per year</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className="text-xs text-gray-400 mb-1">Payback Period</div>
                <div className="text-xl font-bold text-amber-600">{results.payback < 10 ? `${results.payback.toFixed(1)} years` : 'N/A'}</div>
                <div className="text-xs text-gray-400">vs current fleet cost</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className="text-xs text-gray-400 mb-1">Suggested EV</div>
                <div className="text-sm font-bold text-primary-700">{results.selectedEV.make} {results.selectedEV.model}</div>
                <div className="text-xs text-gray-400">{results.selectedEV.range} mi range</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cost Comparison (annual, per vehicle)</h3>
              <div className="space-y-3">
                {[
                  { label: 'Fuel/Energy', current: results.annualFuelCost / numVehicles, ev: results.annualEVFuelCost / numVehicles, format: 'currency' },
                  { label: 'Maintenance', current: results.annualMaintenanceCost / numVehicles, ev: results.annualEVMaintenanceCost / numVehicles, format: 'currency' },
                  { label: 'Tax (VED)', current: results.annualTaxCost / numVehicles, ev: results.annualEVTaxCost / numVehicles, format: 'currency' },
                  { label: 'ULEZ/CAZ', current: results.annualULEZCost / numVehicles, ev: 0, format: 'currency' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{row.label}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-red-600 font-medium">£{Math.round(row.current).toLocaleString()}</span>
                      <ArrowRight className="w-3 h-3 text-gray-300" />
                      <span className="text-green-600 font-medium">£{Math.round(row.ev).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">Get a detailed EV transition plan for your entire fleet.</p>
              <Link href="/login" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
                Unlock Full EV Planner <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={() => setStep('form')} className="block mx-auto mt-3 text-sm text-primary-700 hover:underline">
                ← Adjust calculation
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © 2026 Dvbxtreme Sp.z o.o. &middot; <Link href="/pricing" className="hover:text-gray-600">Pricing</Link> &middot; <Link href="/login" className="hover:text-gray-600">Sign In</Link>
        </div>
      </footer>
    </div>
  )
}

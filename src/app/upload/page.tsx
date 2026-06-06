'use client'

import { useState } from 'react'
import FileDrop from '@/components/FileDrop'
import MetricCard from '@/components/MetricCard'
import { UploadResult } from '@/lib/api'
import { formatCO2, formatNumber } from '@/lib/utils'
import { Truck, Droplets, AlertTriangle } from 'lucide-react'

export default function UploadPage() {
  const [lastResult, setLastResult] = useState<UploadResult | null>(null)

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Fuel Data</h1>
        <p className="text-sm text-gray-400 mt-1">
          Drag & drop your fuel card export — Allstar, FuelGenie, Shell UK, Keyfuels
        </p>
      </div>

      <FileDrop onSuccess={setLastResult} />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <strong>Supported formats:</strong> CSV, XLSX. Ensure your export contains vehicle registration,
          transaction date, fuel type, and quantity columns. AdBlue and HVO are auto-detected.
        </div>
      </div>

      {lastResult && (
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            label="CO₂e"
            value={formatCO2(lastResult.total_co2e_kg)}
            icon={<Truck className="w-5 h-5" />}
            className="col-span-1"
          />
          <MetricCard
            label="Fuel"
            value={`${formatNumber(lastResult.total_fuel_litres)} L`}
            icon={<Droplets className="w-5 h-5" />}
          />
          <MetricCard
            label="Vehicles"
            value={String(lastResult.vehicles_found.length)}
            sub={lastResult.transactions_count + ' transactions'}
          />
        </div>
      )}
    </div>
  )
}

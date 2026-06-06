'use client'

import { useEffect, useState } from 'react'
import { api, ReportSummary } from '@/lib/api'
import { formatCO2, formatDate } from '@/lib/utils'
import { FileText, Download, Loader2, Save } from 'lucide-react'

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [periodStart, setPeriodStart] = useState('2025-04-01')
  const [periodEnd, setPeriodEnd] = useState('2025-04-30')
  const [tonneKm, setTonneKm] = useState('45000')
  const [forsLevel, setForsLevel] = useState('Silver')

  const loadReports = () => {
    setLoading(true)
    api.reports.list().then(setReports).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadReports() }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const blob = await api.reports.generate({
        period_start: periodStart,
        period_end: periodEnd,
        fors_level: forsLevel,
        total_tonne_km: parseFloat(tonneKm) || 0,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ecofleet-${forsLevel.toLowerCase()}-${periodStart}-${periodEnd}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      loadReports()
    } catch (e: any) {
      alert(e.message || 'Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  const handleExportCsv = async (id: string) => {
    try {
      const blob = await api.reports.exportCsv(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `report-${id}.csv`; a.click()
      URL.revokeObjectURL(url)
    } catch { alert('Export failed') }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
        <p className="text-sm text-gray-400 mt-1">Generate FORS-compliant PDF reports</p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Generate New Report</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="label">Period Start</label>
            <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="label">Period End</label>
            <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="label">Total Tonne-km</label>
            <input type="number" value={tonneKm} onChange={(e) => setTonneKm(e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="label">FORS Level</label>
            <select value={forsLevel} onChange={(e) => setForsLevel(e.target.value)} className="input w-full">
              <option value="Silver">FORS Silver</option>
              <option value="Gold">FORS Gold</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary flex items-center gap-2"
        >
          {generating && <Loader2 className="w-4 h-4 animate-spin" />}
          {generating ? 'Generating...' : `Generate FORS ${forsLevel} Report (PDF)`}
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Previous Reports</h2>
        {loading ? (
          <div className="text-sm text-gray-400 py-8 text-center">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="card text-center text-sm text-gray-400 py-10">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No reports yet — generate your first one above
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                </div>
                <div>
                  <div className="font-medium text-sm">{r.title || 'FORS Report'}</div>
                  <div className="text-xs text-gray-400">
                    {r.report_period} · {r.vehicle_count} vehicles · {formatCO2(r.total_co2e_kg)}
                    {r.fors_level && <span className={`ml-2 font-medium ${r.fors_level === 'Gold' ? 'text-amber-500' : 'text-gray-400'}`}>FORS {r.fors_level}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleExportCsv(r.id)} className="text-xs text-gray-400 hover:text-primary-600 flex items-center gap-1">
                  <Save className="w-3 h-3" /> CSV
                </button>
                <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

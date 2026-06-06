'use client'

import { useState, useRef, DragEvent } from 'react'
import { Upload, FileSpreadsheet, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api, UploadResult } from '@/lib/api'

interface Props {
  companyId?: string
  onSuccess: (result: UploadResult) => void
}

export default function FileDrop({ onSuccess }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const accept = '.csv,.xlsx,.xls'

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await api.upload(file)
      setResult(res)
      onSuccess(res)
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors',
          dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f) }}
        />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-primary-600" />
            <div className="text-left">
              <div className="font-medium text-sm">{file.name}</div>
              <div className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</div>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <div className="text-sm font-medium">Drop your fuel card CSV here</div>
            <div className="text-xs text-gray-400 mt-1">or click to browse — Allstar, FuelGenie, Shell UK, Keyfuels</div>
          </>
        )}
      </div>

      {file && !result && !loading && (
        <div className="flex gap-3">
          <button onClick={handleUpload} className="btn-primary flex-1">
            Upload &amp; Calculate
          </button>
          <button onClick={reset} className="btn-secondary">Cancel</button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          Parsing and calculating emissions...
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-green-700 font-medium mb-3">
            <CheckCircle className="w-5 h-5" />
            Processed {result.transactions_count} transactions
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400 text-xs">Total CO₂e</div>
              <div className="font-bold text-lg">{result.total_co2e_kg.toLocaleString()} kg</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Total Fuel</div>
              <div className="font-bold text-lg">{result.total_fuel_litres.toLocaleString()} L</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Vehicles Found</div>
              <div className="font-medium">{result.vehicles_found.join(', ') || 'none'}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Source</div>
              <div className="font-medium capitalize">{result.source}</div>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-3 text-xs text-amber-600">
              {result.errors.length} warnings — some rows could not be parsed
            </div>
          )}
          <button onClick={reset} className="mt-4 text-sm text-primary-600 hover:underline">
            Upload another file
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-700 text-sm">
          <XCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}

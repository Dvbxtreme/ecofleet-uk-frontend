'use client'

import { useEffect, useState } from 'react'
import { api, VehicleOut, VehicleCreateData, VehicleUpdateData } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import {
  Plus, Pencil, Trash2, X, Loader2, Truck, Fuel, Weight,
  Euro, Snowflake, Search,
} from 'lucide-react'

const VEHICLE_TYPES = [
  { value: 'rigid_hgv', label: 'Rigid HGV' },
  { value: 'artic_hgv', label: 'Articulated HGV' },
  { value: 'van', label: 'Van' },
  { value: 'car', label: 'Car' },
  { value: 'minibus', label: 'Minibus' },
  { value: 'coach', label: 'Coach' },
]

const WEIGHT_CATEGORIES = [
  { value: 'up_to_3.5t', label: 'Up to 3.5t' },
  { value: '3.5t_to_7.5t', label: '3.5t – 7.5t' },
  { value: '7.5t_to_17t', label: '7.5t – 17t' },
  { value: '17t_to_26t', label: '17t – 26t' },
  { value: 'over_26t', label: 'Over 26t' },
]

const FUEL_TYPES = [
  { value: 'diesel', label: 'Diesel' },
  { value: 'hvo', label: 'HVO' },
  { value: 'electric', label: 'Electric' },
  { value: 'lng', label: 'LNG' },
  { value: 'petrol', label: 'Petrol' },
]

const EURO_CLASSES = ['Euro 6', 'Euro 5', 'Euro 4', 'Euro 3']

interface VehicleForm {
  registration: string
  vehicle_type: string
  weight_category: string
  fuel_type: string
  euro_class: string
  is_refrigerated: boolean
}

const emptyForm: VehicleForm = {
  registration: '',
  vehicle_type: 'rigid_hgv',
  weight_category: 'up_to_17t',
  fuel_type: 'diesel',
  euro_class: '',
  is_refrigerated: false,
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleOut[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<VehicleForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const loadVehicles = () => {
    setLoading(true)
    api.vehicles.list().then(setVehicles).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadVehicles() }, [])

  const openAdd = () => {
    setForm(emptyForm)
    setEditId(null)
    setModal('add')
  }

  const openEdit = (v: VehicleOut) => {
    setForm({
      registration: v.registration,
      vehicle_type: v.vehicle_type,
      weight_category: v.weight_category,
      fuel_type: v.fuel_type,
      euro_class: v.euro_class || '',
      is_refrigerated: v.is_refrigerated,
    })
    setEditId(v.id)
    setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data: VehicleCreateData = {
        ...form,
        euro_class: form.euro_class || undefined,
      }
      if (editId) {
        const updates: VehicleUpdateData = {}
        for (const key of Object.keys(data) as (keyof VehicleCreateData)[]) {
          if (data[key] !== undefined) { (updates as any)[key] = data[key] }
        }
        await api.vehicles.update(editId, updates)
      } else {
        await api.vehicles.create(data)
      }
      setModal(null)
      loadVehicles()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.vehicles.remove(id)
      setConfirmDelete(null)
      loadVehicles()
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your fleet register</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <Truck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">No vehicles yet</h2>
          <p className="text-sm text-gray-400 mt-1 mb-6">Add your first vehicle to start tracking emissions</p>
          <button onClick={openAdd} className="btn-primary">Add Vehicle</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-4">Registration</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Weight</th>
                <th className="px-5 py-4">Fuel</th>
                <th className="px-5 py-4">Euro</th>
                <th className="px-5 py-4">Refrig</th>
                <th className="px-5 py-4">Added</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-semibold text-gray-900">{v.registration}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 capitalize">{v.vehicle_type.replace(/_/g, ' ')}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{WEIGHT_CATEGORIES.find(w => w.value === v.weight_category)?.label || v.weight_category}</td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${v.fuel_type === 'hvo' ? 'text-green-600' : v.fuel_type === 'electric' ? 'text-blue-600' : 'text-gray-700'}`}>
                      {v.fuel_type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{v.euro_class || '—'}</td>
                  <td className="px-5 py-4">{v.is_refrigerated ? <Snowflake className="w-4 h-4 text-blue-400" /> : '—'}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{formatDate(v.created_at)}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(v)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirmDelete(v.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editId ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Registration *</label>
                <input
                  value={form.registration}
                  onChange={e => setForm({ ...form, registration: e.target.value.toUpperCase() })}
                  placeholder="e.g. AB24 CDE"
                  className="input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Vehicle Type</label>
                  <select value={form.vehicle_type} onChange={e => setForm({ ...form, vehicle_type: e.target.value })} className="input w-full">
                    {VEHICLE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Weight Category</label>
                  <select value={form.weight_category} onChange={e => setForm({ ...form, weight_category: e.target.value })} className="input w-full">
                    {WEIGHT_CATEGORIES.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Fuel Type</label>
                  <select value={form.fuel_type} onChange={e => setForm({ ...form, fuel_type: e.target.value })} className="input w-full">
                    {FUEL_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Euro Class</label>
                  <select value={form.euro_class} onChange={e => setForm({ ...form, euro_class: e.target.value })} className="input w-full">
                    <option value="">—</option>
                    {EURO_CLASSES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_refrigerated}
                  onChange={e => setForm({ ...form, is_refrigerated: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Refrigerated vehicle</span>
              </label>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleSave} disabled={saving || !form.registration.trim()} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? 'Save Changes' : 'Add Vehicle'}
              </button>
              <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900">Remove Vehicle?</h2>
            <p className="text-sm text-gray-500 mt-2">This will deactivate the vehicle. Historical data will be preserved.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="btn-primary flex-1 bg-red-600 hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

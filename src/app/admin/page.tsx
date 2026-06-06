'use client'

import { useEffect, useState } from 'react'
import { api, AdminStats, CompanyUser } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { Loader2, Users, Building2, Database, Leaf, Shield, CheckCircle, XCircle } from 'lucide-react'

export default function AdminPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<CompanyUser[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [tab, setTab] = useState<'overview' | 'users' | 'companies'>('overview')
  const [loading, setLoading] = useState(true)

  if (user?.role !== 'admin') {
    return <div className="text-center py-20 text-gray-400">Admin access required</div>
  }

  useEffect(() => {
    Promise.all([
      api.admin.stats().catch(() => null),
      api.admin.users().catch(() => []),
      api.admin.companies().catch(() => []),
    ]).then(([s, u, c]) => {
      setStats(s)
      setUsers(u)
      setCompanies(c)
    }).finally(() => setLoading(false))
  }, [])

  const handleToggle = async (userId: string) => {
    await api.admin.toggleUser(userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u))
  }

  const handleRole = async (userId: string, role: string) => {
    await api.admin.setRole(userId, role)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
  }

  const handlePlan = async (companyId: string, planCode: string) => {
    await api.admin.setPlan(companyId, planCode)
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, plan: planCode } : c))
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users' },
    { key: 'companies', label: 'Companies' },
  ] as const

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Panel</h1>
        <p className="text-sm text-gray-400 mt-1">System administration by Dvbxtreme Sp.z o.o.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-px">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${tab === t.key ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >{t.label}</button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="card"><Users className="w-5 h-5 text-primary-600 mb-2" /><div className="text-2xl font-bold">{stats.total_users}</div><div className="label">Users</div></div>
          <div className="card"><Building2 className="w-5 h-5 text-primary-600 mb-2" /><div className="text-2xl font-bold">{stats.total_companies}</div><div className="label">Companies</div></div>
          <div className="card"><Database className="w-5 h-5 text-primary-600 mb-2" /><div className="text-2xl font-bold">{stats.total_transactions.toLocaleString()}</div><div className="label">Transactions</div></div>
          <div className="card"><Leaf className="w-5 h-5 text-primary-600 mb-2" /><div className="text-2xl font-bold">{stats.total_co2e_tonnes.toLocaleString()} t</div><div className="label">Total CO₂e</div></div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-800">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800/50 text-sm">
                  <td className="px-5 py-4 font-medium">{u.full_name}</td>
                  <td className="px-5 py-4 text-gray-500">{u.email}</td>
                  <td className="px-5 py-4">
                    <select value={u.role} onChange={e => handleRole(u.id, e.target.value)}
                      className="text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">{u.is_active ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-400" />}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleToggle(u.id)} className="text-xs text-primary-600 hover:underline">
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'companies' && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-800">
                <th className="px-5 py-4">Company</th>
                <th className="px-5 py-4">Number</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Users</th>
                <th className="px-5 py-4">Txns</th>
                <th className="px-5 py-4">Change Plan</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800/50 text-sm">
                  <td className="px-5 py-4 font-medium">{c.name}</td>
                  <td className="px-5 py-4 text-gray-500">{c.company_number || '—'}</td>
                  <td className="px-5 py-4"><span className="capitalize text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">{c.plan}</span></td>
                  <td className="px-5 py-4">{c.users}</td>
                  <td className="px-5 py-4">{c.transactions}</td>
                  <td className="px-5 py-4">
                    <select value={c.plan} onChange={e => handlePlan(c.id, e.target.value)}
                      className="text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800"
                    >
                      <option value="starter">Starter</option>
                      <option value="business">Business</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

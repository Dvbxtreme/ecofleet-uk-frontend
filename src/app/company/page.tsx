'use client'

import { useEffect, useState } from 'react'
import { api, CompanyResult, ApiKeyOut, ApiKeyCreated, CompanyUser } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { Building2, Loader2, Key, Plus, Trash2, Copy, CheckCircle, Users, UserPlus, Mail, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function CompanyPage() {
  const { user } = useAuth()
  const [company, setCompany] = useState<CompanyResult | null>(null)
  const [apiKeys, setApiKeys] = useState<ApiKeyOut[]>([])
  const [team, setTeam] = useState<CompanyUser[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'profile' | 'api' | 'team'>('profile')

  // API key creation
  const [showNewKey, setShowNewKey] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [createdKey, setCreatedKey] = useState<ApiKeyCreated | null>(null)
  const [creating, setCreating] = useState(false)

  // Invite
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState('manager')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')

  useEffect(() => {
    Promise.all([
      api.company.me().catch(() => null),
      api.apiKeys.list().catch(() => []),
      user ? api.auth.companyUsers().catch(() => []) : [],
    ]).then(([c, k, t]) => {
      setCompany(c)
      setApiKeys(k)
      setTeam(t)
    }).finally(() => setLoading(false))
  }, [user])

  const handleCreateKey = async () => {
    if (!keyName.trim()) return
    setCreating(true)
    try {
      const result = await api.apiKeys.create({ name: keyName, permissions: 'read' })
      setCreatedKey(result)
      setKeyName('')
      setShowNewKey(false)
      api.apiKeys.list().then(setApiKeys)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this API key? This cannot be undone.')) return
    await api.apiKeys.revoke(id)
    setApiKeys(prev => prev.filter(k => k.id !== id))
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return
    setInviting(true)
    setInviteMsg('')
    try {
      await api.auth.invite(inviteEmail, inviteName, inviteRole)
      setInviteMsg(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
      setInviteName('')
      setShowInvite(false)
    } catch (e: any) {
      setInviteMsg(e.message)
    } finally {
      setInviting(false)
    }
  }

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'team', label: 'Team' },
    { key: 'api', label: 'API Keys' },
  ] as const

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Company</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your company profile, team, and API access</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-px">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${tab === t.key ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >{t.label}</button>
        ))}
      </div>

      {tab === 'profile' && company && (
        <div className="card space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary-600 dark:text-primary-300" />
            </div>
            <div>
              <div className="text-lg font-bold">{company.name}</div>
              <div className="text-sm text-gray-400">{company.companies_house_number && `Company #${company.companies_house_number}`}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="label">Registered Address</span><p className="text-gray-700 dark:text-gray-300">{company.registered_address || '—'}</p></div>
            <div><span className="label">Postcode</span><p className="text-gray-700 dark:text-gray-300">{company.postcode || '—'}</p></div>
            <div><span className="label">Contact Email</span><p className="text-gray-700 dark:text-gray-300">{company.contact_email || '—'}</p></div>
            <div><span className="label">Plan</span><p className="text-gray-700 dark:text-gray-300 capitalize">{company.subscription_tier}</p></div>
            {company.forsilver_url && (
              <div className="col-span-2">
                <span className="label">FORS URL</span>
                <a href={company.forsilver_url} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline text-sm">{company.forsilver_url}</a>
                {company.forsilver_verified && <CheckCircle className="w-4 h-4 text-green-500 inline ml-2" />}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'team' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Team Members</h3>
            <button onClick={() => setShowInvite(true)} className="btn-primary flex items-center gap-2 text-xs px-3 py-2">
              <UserPlus className="w-4 h-4" /> Invite
            </button>
          </div>

          {team.length === 0 ? (
            <p className="text-sm text-gray-400">No team members.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {team.map(m => (
                  <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800/50 text-sm">
                    <td className="py-3 pr-4 font-medium">{m.full_name}</td>
                    <td className="py-3 pr-4 text-gray-500">{m.email}</td>
                    <td className="py-3 pr-4 capitalize">{m.role}</td>
                    <td className="py-3">{m.is_active ? <CheckCircle className="w-4 h-4 text-green-500" /> : <span className="text-xs text-gray-400">Invited</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Invite Modal */}
          {showInvite && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => { setShowInvite(false); setInviteMsg('') }}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Invite Team Member</h2>
                  <button onClick={() => { setShowInvite(false); setInviteMsg('') }}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                {inviteMsg && (
                  <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg px-4 py-2 mb-4">{inviteMsg}</div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input value={inviteName} onChange={e => setInviteName(e.target.value)} className="input w-full" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="input w-full" />
                  </div>
                  <div>
                    <label className="label">Role</label>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="input w-full">
                      <option value="manager">Manager</option>
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button onClick={handleInvite} disabled={inviting} className="btn-primary w-full flex items-center justify-center gap-2">
                    {inviting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <Mail className="w-4 h-4" /> Send Invitation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'api' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">API Keys</h3>
            <button onClick={() => { setShowNewKey(true); setCreatedKey(null) }} className="btn-primary flex items-center gap-2 text-xs px-3 py-2">
              <Plus className="w-4 h-4" /> New Key
            </button>
          </div>

          {createdKey && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 font-medium mb-2">
                <CheckCircle className="w-4 h-4" /> API Key Created
              </div>
              <p className="text-xs text-gray-500 mb-2">Copy this key now — you won't see it again:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-mono select-all">{createdKey.full_key}</code>
                <button onClick={() => navigator.clipboard.writeText(createdKey.full_key)} className="p-2 text-gray-400 hover:text-primary-600"><Copy className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {apiKeys.length === 0 ? (
            <p className="text-sm text-gray-400">No API keys yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Key</th>
                  <th className="pb-3 pr-4">Permissions</th>
                  <th className="pb-3 pr-4">Created</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map(k => (
                  <tr key={k.id} className="border-b border-gray-50 dark:border-gray-800/50 text-sm">
                    <td className="py-3 pr-4 font-medium">{k.name}</td>
                    <td className="py-3 pr-4"><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{k.key_prefix}...</code></td>
                    <td className="py-3 pr-4 capitalize">{k.permissions}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(k.created_at)}</td>
                    <td className="py-3">
                      <button onClick={() => handleRevoke(k.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* New Key Modal */}
          {showNewKey && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowNewKey(false)}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold mb-6">Create API Key</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Key Name</label>
                    <input value={keyName} onChange={e => setKeyName(e.target.value)} placeholder="e.g. Production Integration" className="input w-full" />
                  </div>
                  <button onClick={handleCreateKey} disabled={creating || !keyName.trim()} className="btn-primary w-full flex items-center justify-center gap-2">
                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Generate Key
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

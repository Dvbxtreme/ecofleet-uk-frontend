const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('ecofleet_token')
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...authHeaders(), ...(opts?.headers as Record<string, string> || {}) }
  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  if (res.status === 401) {
    localStorage.removeItem('ecofleet_token')
    if (typeof window !== 'undefined') window.location.href = '/login'
    throw new Error('Session expired')
  }
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `HTTP ${res.status}`)
  }
  return res.json()
}

function postBlob(path: string, body: Record<string, string>): Promise<Blob> {
  const headers: Record<string, string> = { ...authHeaders() }
  const params = new URLSearchParams(body)
  return fetch(`${BASE}${path}?${params}`, { method: 'POST', headers }).then(r => {
    if (r.status === 401) { localStorage.removeItem('ecofleet_token'); window.location.href = '/login'; throw new Error('Expired') }
    if (!r.ok) throw new Error('Failed')
    return r.blob()
  })
}

export interface UploadResult {
  success: boolean
  transactions_count: number
  source: string
  total_co2e_kg: number
  total_fuel_litres: number
  vehicles_found: string[]
  errors: string[]
}

export interface DashboardStats {
  current_month_co2e: number
  previous_month_co2e: number
  change_percentage: number
  total_vehicles: number
  total_transactions: number
  avg_per_vehicle: number
  hvo_savings_kg: number
}

export interface CompanyResult {
  id: string
  name: string
  companies_house_number: string
  registered_address: string | null
  postcode: string | null
  contact_email: string
  forsilver_url: string | null
  forsilver_verified: boolean
  max_vehicles: number
  subscription_tier: string
  is_active: boolean
}

export interface ReportSummary {
  id: string
  title: string
  company_name: string
  company_number: string
  report_period: string
  total_co2e_kg: number
  total_distance_km: number
  total_fuel_litres: number
  total_tonne_km: number
  emission_intensity: number
  vehicle_count: number
  hvo_litres: number
  hvo_co2_saved_kg: number
  fors_level: string
  pdf_url: string | null
  created_at: string
}

export interface PlanInfo {
  code: string
  name: string
  price_gbp: number
  max_vehicles: number
  includes_secr: boolean
  includes_white_label: boolean
  includes_api: boolean
}

export interface SubscriptionInfo {
  plan_code: string
  plan_name: string
  price_gbp: number
  max_vehicles: number
  vehicles_used: number
  vehicles_remaining: number
  status: string
  current_period_end: string | null
  includes_secr: boolean
  includes_white_label: boolean
  includes_api: boolean
}

export interface CheckoutResult {
  url: string | null
  success: boolean
  dev_mode: boolean
}

export interface VehicleOut {
  id: string
  registration: string
  vehicle_type: string
  weight_category: string
  fuel_type: string
  euro_class: string | null
  is_refrigerated: boolean
  is_active: boolean
  created_at: string
}

export interface VehicleCreateData {
  registration: string
  vehicle_type?: string
  weight_category?: string
  fuel_type?: string
  euro_class?: string
  is_refrigerated?: boolean
}

export interface VehicleUpdateData {
  registration?: string
  vehicle_type?: string
  weight_category?: string
  fuel_type?: string
  euro_class?: string
  is_refrigerated?: boolean
}

export interface VehicleDetailStats {
  id: string
  registration: string
  vehicle_type: string
  fuel_type: string
  total_co2e_kg: number
  total_fuel_litres: number
  total_cost_gbp: number
  this_month_co2e_kg: number
  transaction_count: number
  fuel_type_breakdown: { fuel_type: string; count: number }[]
}

export interface VehicleTransaction {
  id: string
  date: string
  fuel_type: string
  quantity: number
  unit: string
  cost_gbp: number | null
  co2e_kg: number | null
  source: string
}

export interface VehicleTrend {
  month: string
  fuel_litres: number
  cost_gbp: number
  co2e_kg: number
}

export interface ApiKeyOut {
  id: string
  name: string
  key_prefix: string
  permissions: string
  last_used_at: string | null
  is_active: boolean
  created_at: string
}

export interface ApiKeyCreated {
  id: string
  name: string
  key_prefix: string
  full_key: string
  permissions: string
  is_active: boolean
}

export interface AdminStats {
  total_users: number
  total_companies: number
  total_transactions: number
  total_co2e_tonnes: number
}

export interface CompanyUser {
  id: string
  email: string
  full_name: string
  role: string
  company_id: string
  email_verified: boolean
  is_active: boolean
}



export interface EVSuggestion {
  make: string
  model: string
  range_miles: number
  battery_kwh: number
  price_gbp: number
  efficiency_mpk: number
  suitability_note: string
}

export interface EVAnalysisResult {
  vehicle_id: string
  registration: string
  vehicle_type: string
  fuel_type: string
  annual_miles: number
  avg_daily_miles: number
  suitable_for_ev: boolean
  suitability_score: number
  suggested_ev: EVSuggestion | null
  annual_fuel_cost_gbp: number
  annual_electric_cost_gbp: number
  annual_maintenance_saving_gbp: number
  annual_tax_saving_gbp: number
  annual_ulez_saving_gbp: number
  total_annual_saving_gbp: number
  co2_saving_kg_per_year: number
  ev_price_gbp: number
  payback_years: number
  notes: string[]
}

export interface EVPlanOut {
  id: string
  vehicle_id: string | null
  registration: string
  vehicle_type: string
  suggested_ev_make: string
  suggested_ev_model: string
  suggested_ev_range_miles: number
  annual_miles: number
  total_annual_saving_gbp: number
  co2_saving_kg_per_year: number
  ev_price_gbp: number
  payback_years: number
  suitability_score: number
  status: string
  created_at: string
}

export interface EVFleetSummary {
  total_vehicles: number
  suitable_for_ev: number
  not_suitable: number
  total_annual_saving_potential_gbp: number
  total_co2_saving_potential_kg: number
  total_ev_investment_gbp: number
  average_payback_years: number
}

export const api = {
  drivers: { scorecard: () => request<any[]>('/api/v1/drivers/scorecard') },
  benchmarking: { industry: () => request<any>('/api/v1/benchmarking/industry') },
  vehicleHealth: {
    records: (id: string) => request<any[]>(`/api/v1/vehicle-health/records/${id}`),
    create: (data: any) => request<any>('/api/v1/vehicle-health/records', { method: 'POST', body: JSON.stringify(data) }),
  },
  upload: async (file: File): Promise<UploadResult> => {
    const form = new FormData()
    form.append('file', file)
    const token = getToken()
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${BASE}/api/v1/upload/`, { method: 'POST', body: form, headers })
    if (res.status === 401) { localStorage.removeItem('ecofleet_token'); window.location.href = '/login'; throw new Error('Expired') }
    if (!res.ok) { const t = await res.text(); throw new Error(t) }
    return res.json()
  },

  dashboard: () => request<DashboardStats>('/api/v1/dashboard/stats'),

  reports: {
    list: () => request<ReportSummary[]>('/api/v1/reports/'),
    generate: (body: { period_start: string; period_end: string; fors_level: string; total_tonne_km: number }) =>
      postBlob('/api/v1/reports/generate', body as any),
    exportCsv: (id: string) => {
      const token = getToken()
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      return fetch(`${BASE}/api/v1/export/report/${id}`, { headers }).then(r => {
        if (r.status === 401) { localStorage.removeItem('ecofleet_token'); window.location.href = '/login'; throw new Error('Expired') }
        if (!r.ok) throw new Error('Failed')
        return r.blob()
      })
    },
  },

  company: {
    search: (query: string) => request<{ company_number: string; name: string; postcode: string; status: string }[]>(`/api/v1/company/search/${encodeURIComponent(query)}`),
    lookup: (num: string) => request<{ company_number: string; name: string; address: Record<string, string>; status: string }>(`/api/v1/company/lookup/${num}`),
    me: () => request<CompanyResult>('/api/v1/company/me'),
    update: (data: any) => request<CompanyResult>('/api/v1/company/me', { method: 'PUT', body: JSON.stringify(data) }),
  },

  plans: { list: () => request<PlanInfo[]>('/api/v1/subscription/plans') },

  subscription: {
    current: () => request<SubscriptionInfo>('/api/v1/subscription/current'),
    createCheckout: (planCode: string) => request<CheckoutResult>('/api/v1/subscription/create-checkout', { method: 'POST', body: JSON.stringify({ plan_code: planCode }) }),
  },

  vehicles: {
    list: () => request<VehicleOut[]>('/api/v1/vehicles/'),
    get: (id: string) => request<VehicleOut>(`/api/v1/vehicles/${id}`),
    create: (data: VehicleCreateData) => request<VehicleOut>('/api/v1/vehicles/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: VehicleUpdateData) => request<VehicleOut>(`/api/v1/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => fetch(`${BASE}/api/v1/vehicles/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r => {
      if (r.status === 401) { localStorage.removeItem('ecofleet_token'); window.location.href = '/login'; throw new Error('Expired') }
      if (!r.ok) throw new Error('Failed to delete')
    }),
    detail: (id: string) => request<VehicleDetailStats>(`/api/v1/vehicles/${id}/stats`),
    transactions: (id: string, limit = 100, offset = 0) => request<VehicleTransaction[]>(`/api/v1/vehicles/${id}/transactions?limit=${limit}&offset=${offset}`),
    trend: (id: string, months = 6) => request<VehicleTrend[]>(`/api/v1/vehicles/${id}/cost-trend?months=${months}`),
  },

  apiKeys: {
    list: () => request<ApiKeyOut[]>('/api/v1/api-keys/'),
    create: (data: { name: string; permissions: string }) => request<ApiKeyCreated>('/api/v1/api-keys/', { method: 'POST', body: JSON.stringify(data) }),
    revoke: (id: string) => fetch(`${BASE}/api/v1/api-keys/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r => {
      if (r.status === 401) { localStorage.removeItem('ecofleet_token'); window.location.href = '/login'; throw new Error('Expired') }
      if (!r.ok) throw new Error('Failed')
    }),
  },

  admin: {
    stats: () => request<AdminStats>('/api/v1/admin/stats'),
    users: () => request<CompanyUser[]>('/api/v1/admin/users'),
    setRole: (userId: string, role: string) => request<any>(`/api/v1/admin/users/${userId}/role?role=${role}`, { method: 'PUT' }),
    toggleUser: (userId: string) => request<any>(`/api/v1/admin/users/${userId}/toggle`, { method: 'PUT' }),
    companies: () => request<any[]>('/api/v1/admin/companies'),
    setPlan: (companyId: string, planCode: string) => request<any>(`/api/v1/admin/companies/${companyId}/plan?plan_code=${planCode}`, { method: 'PUT' }),
  },

  twofa: {
    setup: () => request<{ secret: string; qr_code: string; uri: string }>('/api/v1/2fa/setup'),
    enable: (secret: string, code: string) => request<any>(`/api/v1/2fa/enable?secret=${secret}&code=${code}`, { method: 'POST' }),
    verify: (code: string) => request<any>(`/api/v1/2fa/verify?code=${code}`, { method: 'POST' }),
  },

  auth: {
    forgotPassword: (email: string) => request<{ message: string }>('/api/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token: string, new_password: string) => request<{ message: string }>('/api/v1/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, new_password }) }),
    acceptInvite: (token: string, password: string, full_name: string) => request<any>('/api/v1/auth/accept-invite', { method: 'POST', body: JSON.stringify({ token, password, full_name }) }),
    invite: (email: string, full_name: string, role: string) => request<{ message: string }>('/api/v1/auth/invite', { method: 'POST', body: JSON.stringify({ email, full_name, role }) }),
    companyUsers: () => request<CompanyUser[]>('/api/v1/auth/company-users'),
    sendVerification: () => request<{ message: string }>('/api/v1/verification/send', { method: 'POST' }),
    verifyEmail: (token: string) => request<{ message: string }>(`/api/v1/verification/verify?token=${token}`),
    getAuditLogs: (limit = 50, offset = 0) => request<any[]>(`/api/v1/audit/logs?limit=${limit}&offset=${offset}`),
  },

  fuelPrices: {
    trends: (fuelType = 'diesel', days = 90) => request<any[]>(`/api/v1/fuel-prices/trends?fuel_type=${fuelType}&days=${days}`),
    latest: () => request<any[]>('/api/v1/fuel-prices/latest'),
  },
  yoy: {
    comparison: () => request<any>('/api/v1/yoy/comparison'),
  },

  export: {
    transactions: (periodStart?: string, periodEnd?: string) => {
      const token = getToken()
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      let url = '/api/v1/export/transactions'
      const params = new URLSearchParams()
      if (periodStart) params.set('period_start', periodStart)
      if (periodEnd) params.set('period_end', periodEnd)
      if (params.toString()) url += `?${params}`
      return fetch(`${BASE}${url}`, { headers }).then(r => {
        if (r.status === 401) { localStorage.removeItem('ecofleet_token'); window.location.href = '/login'; throw new Error('Expired') }
        if (!r.ok) throw new Error('Failed')
        return r.blob()
      })
    },
  },

  ev: {
    fleetSummary: () => request<EVFleetSummary>('/api/v1/ev/fleet-summary'),
    vehicles: () => request<EVAnalysisResult[]>('/api/v1/ev/vehicles'),
    analyze: (vehicle_id: string, annual_miles?: number, avg_daily_miles?: number) =>
      request<EVAnalysisResult>('/api/v1/ev/analyze', { method: 'POST', body: JSON.stringify({ vehicle_id, annual_miles, avg_daily_miles }) }),
    plans: {
      list: () => request<EVPlanOut[]>('/api/v1/ev/plans'),
      create: (vehicle_id: string, annual_miles?: number, avg_daily_miles?: number) =>
        request<EVPlanOut>('/api/v1/ev/plans', { method: 'POST', body: JSON.stringify({ vehicle_id, annual_miles, avg_daily_miles }) }),
      update: (plan_id: string, data: { status?: string; notes?: string }) =>
        request<EVPlanOut>(`/api/v1/ev/plans/${plan_id}`, { method: 'PUT', body: JSON.stringify(data) }),
    },
  },
}

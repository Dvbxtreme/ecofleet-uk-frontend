import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface Props {
  label: string
  value: string
  sub?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export default function MetricCard({ label, value, sub, icon, trend, className }: Props) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
          {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
        </div>
        {icon && <div className="text-primary-600">{icon}</div>}
      </div>
      {trend && (
        <div
          className={cn(
            'mt-3 text-xs font-medium',
            trend === 'up' && 'text-red-500',
            trend === 'down' && 'text-green-500',
            trend === 'neutral' && 'text-gray-400'
          )}
        >
          {trend === 'down' && '↓ '}
          {trend === 'up' && '↑ '}
          vs last month
        </div>
      )}
    </div>
  )
}

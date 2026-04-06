import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency, monthLabel } from '@/lib/utils'
import type { MonthlyProjection } from '@finance/types'

interface Props {
  data: MonthlyProjection[]
}

export function ProjectionChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: monthLabel(d.month),
    Cuotas: d.installmentsTotal,
    Recurrentes: d.recurringTotal,
    total: d.total,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
        />
        <Legend />
        <Bar dataKey="Cuotas" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Recurrentes" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

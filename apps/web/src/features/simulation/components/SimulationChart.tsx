import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency, monthLabel } from '@/lib/utils'
import type { SimulationResult } from '@finance/types'

interface Props {
  result: SimulationResult
}

export function SimulationChart({ result }: Props) {
  const data = result.baseline.map((b, i) => ({
    name: monthLabel(b.month),
    Actual: b.total,
    'Con nueva compra': result.withNewExpense[i].total,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
        />
        <Legend />
        <Line type="monotone" dataKey="Actual" stroke="#94a3b8" strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="Con nueva compra" stroke="#6366f1" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

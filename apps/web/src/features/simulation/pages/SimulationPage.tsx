import { useState } from 'react'
import { useSimulation } from '../hooks/useSimulation'
import { useCards } from '@/features/cards/hooks/useCards'
import { SimulationChart } from '../components/SimulationChart'
import { ExpenseForm } from '@/features/expenses/components/ExpenseForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatMonth } from '@/lib/utils'
import type { CreateExpenseDTO, SimulationResult } from '@finance/types'

export function SimulationPage() {
  const { data: cards } = useCards()
  const simulate = useSimulation()
  const [result, setResult] = useState<SimulationResult | null>(null)

  async function handleSimulate(data: CreateExpenseDTO) {
    const res = await simulate.mutateAsync(data)
    setResult(res)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Simulador</h2>
        <p className="text-sm text-muted-foreground">Previsualizá el impacto de una nueva compra antes de hacerla</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nueva compra a simular</CardTitle>
          </CardHeader>
          <CardContent>
            {cards?.length ? (
              <ExpenseForm cards={cards} onSubmit={handleSimulate} loading={simulate.isPending} />
            ) : (
              <p className="text-sm text-muted-foreground">Necesitás agregar al menos una tarjeta primero.</p>
            )}
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Impacto en tu proyección</CardTitle>
              </CardHeader>
              <CardContent>
                <SimulationChart result={result} />
              </CardContent>
            </Card>

            <div className="space-y-2">
              {result.impact.filter(i => i.delta > 0).map((i) => (
                <div key={`${i.year}-${i.month}`} className="flex justify-between items-center p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                  <span className="text-sm capitalize">{formatMonth(i.year, i.month)}</span>
                  <span className="text-sm font-semibold text-indigo-700">+{formatCurrency(i.delta)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

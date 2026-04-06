import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Card, Category, CreateExpenseDTO, Expense, ExpenseType } from '@finance/types'

interface Props {
  cards: Card[]
  categories?: Category[]
  initial?: Expense
  onSubmit: (data: CreateExpenseDTO) => void
  loading?: boolean
}

export function ExpenseForm({ cards, categories = [], initial, onSubmit, loading }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    description: initial?.description ?? '',
    amount: initial?.amount?.toString() ?? '',
    type: (initial?.type ?? 'INSTALLMENT') as ExpenseType,
    purchaseDate: initial?.purchaseDate ? initial.purchaseDate.split('T')[0] : today,
    cardId: initial?.cardId ?? '',
    installmentCount: initial?.installmentCount?.toString() ?? '',
    endDate: initial?.endDate ? initial.endDate.split('T')[0] : '',
    categoryId: initial?.categoryId ?? '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      description: form.description,
      amount: Number(form.amount),
      type: form.type,
      purchaseDate: form.purchaseDate,
      cardId: form.cardId,
      installmentCount: form.type === 'INSTALLMENT' ? Number(form.installmentCount) : undefined,
      endDate: form.type === 'RECURRING' && form.endDate ? form.endDate : undefined,
      categoryId: form.categoryId || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Descripción</Label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Monto {form.type === 'INSTALLMENT' ? 'por cuota' : 'mensual'}</Label>
          <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div className="space-y-1">
          <Label>Fecha de compra</Label>
          <Input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Tipo</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as ExpenseType })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INSTALLMENT">Cuotas</SelectItem>
              <SelectItem value="RECURRING">Recurrente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Tarjeta</Label>
          <Select value={form.cardId} onValueChange={(v) => setForm({ ...form, cardId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {cards.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="space-y-1">
          <Label>Categoría (opcional)</Label>
          <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v === '__none__' ? '' : v })}>
            <SelectTrigger>
              <SelectValue placeholder="Sin categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin categoría</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {form.type === 'INSTALLMENT' && (
        <div className="space-y-1">
          <Label>Número de cuotas</Label>
          <Input type="number" min={1} value={form.installmentCount} onChange={(e) => setForm({ ...form, installmentCount: e.target.value })} required />
        </div>
      )}

      {form.type === 'RECURRING' && (
        <div className="space-y-1">
          <Label>Fecha de término (opcional)</Label>
          <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading || !form.cardId}>
        {loading ? 'Guardando...' : 'Guardar gasto'}
      </Button>
    </form>
  )
}

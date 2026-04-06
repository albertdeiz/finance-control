import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Category, CreateCategoryDTO } from '@finance/types'

interface Props {
  initial?: Partial<Category>
  onSubmit: (data: CreateCategoryDTO) => void
  loading?: boolean
}

export function CategoryForm({ initial, onSubmit, loading }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    color: initial?.color ?? '#6366f1',
    icon: initial?.icon ?? '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      name: form.name,
      color: form.color || undefined,
      icon: form.icon || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="cat-name">Name</Label>
        <Input
          id="cat-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="cat-icon">Icon (emoji)</Label>
          <Input
            id="cat-icon"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            placeholder="e.g. 🎬"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cat-color">Color</Label>
          <Input
            id="cat-color"
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="h-9 px-2 py-1"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}

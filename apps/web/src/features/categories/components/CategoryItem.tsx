import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Category } from '@finance/types'

interface Props {
  category: Category
  onDelete: (id: string) => void
  onEdit: (category: Category) => void
}

export function CategoryItem({ category, onDelete, onEdit }: Props) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color ?? '#94a3b8' }}
        />
        <span className="text-lg">{category.icon}</span>
        <p className="font-medium text-sm">{category.name}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
          <Pencil size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(category.id)}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  )
}

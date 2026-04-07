import { ArrowDown, ArrowUp } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { SortDirection } from '@/lib/groupSort'

interface Option {
  value: string
  label: string
}

interface Props {
  groupOptions: Option[]
  sortOptions: Option[]
  groupBy: string | null
  sortBy: string
  direction: SortDirection
  onGroupByChange: (v: string | null) => void
  onSortByChange: (v: string) => void
  onDirectionChange: (v: SortDirection) => void
}

export function GroupSortBar({
  groupOptions,
  sortOptions,
  groupBy,
  sortBy,
  direction,
  onGroupByChange,
  onSortByChange,
  onDirectionChange,
}: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Agrupar:</span>
        <Select
          value={groupBy ?? '__none__'}
          onValueChange={(v) => onGroupByChange(v === '__none__' ? null : v)}
        >
          <SelectTrigger className="h-8 text-xs w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Sin agrupamiento</SelectItem>
            {groupOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Ordenar:</span>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="h-8 text-xs w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => onDirectionChange(direction === 'asc' ? 'desc' : 'asc')}
        >
          {direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        </Button>
      </div>
    </div>
  )
}

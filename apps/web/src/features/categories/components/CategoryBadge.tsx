interface Props {
  name: string
  color?: string | null
  icon?: string | null
}

export function CategoryBadge({ name, color, icon }: Props) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color ?? '#94a3b8' }}
      />
      {icon && <span>{icon}</span>}
      {name}
    </span>
  )
}

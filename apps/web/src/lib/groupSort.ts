export type SortDirection = 'asc' | 'desc'

export function sortItems<T>(items: T[], sortBy: keyof T, direction: SortDirection): T[] {
  return [...items].sort((a, b) => {
    const av = a[sortBy]
    const bv = b[sortBy]
    let cmp: number
    if (typeof av === 'number' && typeof bv === 'number') {
      cmp = av - bv
    } else {
      cmp = String(av ?? '').localeCompare(String(bv ?? ''), 'es')
    }
    return direction === 'asc' ? cmp : -cmp
  })
}

export function groupItems<T>(
  items: T[],
  groupBy: keyof T,
  nullLabel = 'Sin categoría'
): { label: string; items: T[] }[] {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const key = String(item[groupBy] ?? nullLabel)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(item)
  }
  return Array.from(map.entries())
    .sort((a, b) => {
      if (a[0] === nullLabel) return 1
      if (b[0] === nullLabel) return -1
      return a[0].localeCompare(b[0], 'es')
    })
    .map(([label, items]) => ({ label, items }))
}

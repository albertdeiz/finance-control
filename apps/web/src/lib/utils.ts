import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatMonth(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString('es-CL', {
    month: 'long',
    year: 'numeric',
  })
}

export function monthLabel(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleDateString('es-CL', { month: 'short' })
}

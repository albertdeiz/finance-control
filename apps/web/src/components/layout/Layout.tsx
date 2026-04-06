import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, CreditCard, Receipt, Calculator, Tag, LogOut } from 'lucide-react'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { Button } from '@/components/ui/button'

const nav = [
  { to: '/dashboard', label: 'Proyección', icon: LayoutDashboard },
  { to: '/cards', label: 'Tarjetas', icon: CreditCard },
  { to: '/expenses', label: 'Gastos', icon: Receipt },
  { to: '/simulation', label: 'Simulador', icon: Calculator },
  { to: '/categories', label: 'Categories', icon: Tag },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const logout = useLogout()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="font-semibold text-lg tracking-tight">Finance Control</h1>
        <nav className="flex gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
          <LogOut size={16} />
          Logout
        </Button>
      </header>
      <main className="flex-1 container mx-auto px-6 py-8 max-w-6xl">{children}</main>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const login = useLogin()
  const [form, setForm] = useState({ email: '', password: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          autoFocus
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>
      {login.error && (
        <p className="text-sm text-red-500">Invalid credentials. Please try again.</p>
      )}
      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? 'Signing in...' : 'Sign in'}
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        No account?{' '}
        <Link to="/register" className="underline hover:text-foreground">
          Register
        </Link>
      </p>
    </form>
  )
}

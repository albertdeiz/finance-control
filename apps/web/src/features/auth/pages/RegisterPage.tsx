import { RegisterForm } from '../components/RegisterForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center">Finance Control</CardTitle>
          <p className="text-sm text-center text-muted-foreground">Create a new account</p>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}

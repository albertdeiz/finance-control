import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/features/projection/pages/DashboardPage'
import { MonthDetailPage } from '@/features/projection/pages/MonthDetailPage'
import { CardsPage } from '@/features/cards/pages/CardsPage'
import { ExpensesPage } from '@/features/expenses/pages/ExpensesPage'
import { SimulationPage } from '@/features/simulation/pages/SimulationPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projection/:year/:month" element={<MonthDetailPage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

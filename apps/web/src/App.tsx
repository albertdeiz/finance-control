import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/features/projection/pages/DashboardPage'
import { MonthDetailPage } from '@/features/projection/pages/MonthDetailPage'
import { CardsPage } from '@/features/cards/pages/CardsPage'
import { ExpensesPage } from '@/features/expenses/pages/ExpensesPage'
import { SimulationPage } from '@/features/simulation/pages/SimulationPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projection/:year/:month" element={<MonthDetailPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
      </Routes>
    </Layout>
  )
}

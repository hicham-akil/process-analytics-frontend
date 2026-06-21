import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SeuilsProvider } from './context/SeuilsContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import JFC1Dashboard from './components/dashboard/JFC1Dashboard'
import GypseDashboard from './components/gypse/GypseDashboard'
import PhosphateDashboard from './components/phosphate/PhosphateDashboard'
import ProductionDashboard from './components/production/ProductionDashboard'
import HistoriqueDashboard from './components/historique/HistoriqueDashboard'
import PerteDashboard from './components/perte/PerteDashboard'
import SeuilsDashboard from './components/seuils/SeuilsDashboard'
import UserManagement from './components/admin/UserManagement'

function App() {
  return (
    <AuthProvider>
      <SeuilsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <JFC1Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/gypse" element={
              <ProtectedRoute>
                <GypseDashboard />
              </ProtectedRoute>
            } />
            <Route path="/phosphate" element={
              <ProtectedRoute>
                <PhosphateDashboard />
              </ProtectedRoute>
            } />
            <Route path="/production" element={
              <ProtectedRoute>
                <ProductionDashboard />
              </ProtectedRoute>
            } />
            <Route path="/historique" element={
              <ProtectedRoute>
                <HistoriqueDashboard />
              </ProtectedRoute>
            } />
            <Route path="/seuils" element={
              <ProtectedRoute>
                <SeuilsDashboard />
              </ProtectedRoute>
            } />
            <Route path="/perte" element={
              <ProtectedRoute requireLabo>
                <PerteDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </SeuilsProvider>
    </AuthProvider>
  )
}

export default App

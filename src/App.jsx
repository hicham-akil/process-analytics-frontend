import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import JFC1Dashboard from './components/dashboard/JFC1Dashboard'
import GypseDashboard from './components/gypse/GypseDashboard'
import PhosphateDashboard from './components/phosphate/PhosphateDashboard'
import ProductionDashboard from './components/production/ProductionDashboard'
import HistoriqueDashboard from './components/historique/HistoriqueDashboard'
import PerteDashboard from './components/perte/PerteDashboard'

function App() {
  return (
    <AuthProvider>
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
          <Route path="/perte" element={
            <ProtectedRoute requireLabo>
              <PerteDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
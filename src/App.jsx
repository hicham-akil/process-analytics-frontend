import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import JFC1Dashboard from './components/dashboard/JFC1Dashboard'
import GypseDashboard from './components/gypse/GypseDashboard'
import PhosphateDashboard from './components/phosphate/PhosphateDashboard'
import ProductionDashboard from './components/production/ProductionDashboard'
import HistoriqueDashboard from './components/historique/HistoriqueDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JFC1Dashboard />} />
        <Route path="/gypse" element={<GypseDashboard />} />
        <Route path="/phosphate" element={<PhosphateDashboard />} />
        <Route path="/production" element={<ProductionDashboard />} />
        <Route path="/historique" element={<HistoriqueDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

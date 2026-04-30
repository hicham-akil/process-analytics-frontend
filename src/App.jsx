import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import JFC1Dashboard from './components/dashboard/JFC1Dashboard'
import GypseDashboard from './components/gypse/GypseDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JFC1Dashboard />} />
        <Route path="/gypse" element={<GypseDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

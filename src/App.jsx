import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import IntelligenceFeed from './pages/IntelligenceFeed.jsx'
import MarketPulse from './pages/MarketPulse.jsx'
import InnovationFeed from './pages/InnovationFeed.jsx'
import PeerNetwork from './pages/PeerNetwork.jsx'
import Digest from './pages/Digest.jsx'
import Settings from './pages/Settings.jsx'
import AdminPortal from './pages/AdminPortal.jsx'

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/intelligence" element={<IntelligenceFeed />} />
        <Route path="/market-pulse" element={<MarketPulse />} />
        <Route path="/innovation" element={<InnovationFeed />} />
        <Route path="/peer-network" element={<PeerNetwork />} />
        <Route path="/digest" element={<Digest />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}

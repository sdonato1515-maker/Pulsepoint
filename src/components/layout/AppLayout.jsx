import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <TopBar />

      {/* Main content area — offset for sidebar + topbar */}
      <main
        className="pt-16 min-h-screen"
        style={{ marginLeft: '240px' }}
      >
        <div className="p-6 max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

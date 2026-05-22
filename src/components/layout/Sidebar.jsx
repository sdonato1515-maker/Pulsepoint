import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Radar,
  TrendingUp,
  Lightbulb,
  Users,
  BookOpen,
  Settings,
  Zap,
  PenLine,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Intelligence Feed', icon: Radar, path: '/intelligence' },
  { label: 'Market Pulse', icon: TrendingUp, path: '/market-pulse' },
  { label: 'Innovation Feed', icon: Lightbulb, path: '/innovation' },
  { label: 'Peer Network', icon: Users, path: '/peer-network' },
  { label: 'Weekly Digest', icon: BookOpen, path: '/digest' },
]

const ADMIN_ITEMS = [
  { label: 'Content Hub', icon: PenLine, path: '/admin' },
]

function NavItem({ item }) {
  const location = useLocation()
  const isActive = item.path === '/'
    ? location.pathname === '/'
    : location.pathname.startsWith(item.path)

  return (
    <NavLink
      to={item.path}
      className={({ isActive: routerActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group ${
          isActive
            ? 'bg-white text-[#0F6E56]'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`
      }
      end={item.path === '/'}
    >
      <item.icon
        size={18}
        strokeWidth={isActive ? 2.5 : 2}
        className={isActive ? 'text-[#0F6E56]' : 'text-white/70 group-hover:text-white'}
      />
      <span>{item.label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <div
      className="fixed left-0 top-0 h-full flex flex-col"
      style={{ width: '240px', backgroundColor: '#0F6E56' }}
    >
      {/* Header / Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight tracking-tight">PulsePoint</p>
            <p className="text-white/50 text-xs leading-tight">Healthcare Intelligence</p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Admin Nav */}
      <div className="px-3 pb-2 border-t border-white/10 pt-3">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-2">Admin</p>
        {ADMIN_ITEMS.map(item => (
          <NavItem key={item.path} item={item} />
        ))}
      </div>

      {/* Bottom: Settings */}
      <div className="px-3 pb-4 pt-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group ${
              isActive
                ? 'bg-white text-[#0F6E56]'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-[#0F6E56]' : 'text-white/70 group-hover:text-white'}
              />
              <span>Settings</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  )
}

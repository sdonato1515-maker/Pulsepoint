import React, { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, Settings, LogOut, X, Activity, Users, FileText, Radar, PenLine } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import ContentPanel from '../admin/ContentPanel.jsx'

const TYPE_ICONS = {
  expansion: Activity, regulatory: FileText, leadership: Users, acquisition: Activity,
  partnership: Activity, payer: FileText, technology: Radar, care_model: Activity, other: Activity,
}

function formatRelative(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr + 'T00:00:00')) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff}d ago`
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function NotificationPanel({ onClose }) {
  const { intelligenceItems, competitors } = useData()
  const [read, setRead] = useState(new Set())
  const recent = intelligenceItems.slice().sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)).slice(0, 6)

  function getCompetitor(id) { return competitors.find(c => c.id === id) }

  return (
    <div className="absolute right-0 top-12 w-[380px] bg-white rounded-xl border border-[#E2E8F0] shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#1E293B]">Notifications</h3>
          <span className="px-1.5 py-0.5 text-xs font-bold bg-[#D97706] text-white rounded-full">
            {recent.length - read.size}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setRead(new Set(recent.map(a => a.id)))} className="text-xs text-[#0F6E56] hover:underline font-medium">
            Mark all read
          </button>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#475569]"><X size={15} /></button>
        </div>
      </div>
      <div className="max-h-[440px] overflow-y-auto divide-y divide-[#F8FAFC]">
        {recent.map(alert => {
          const competitor = getCompetitor(alert.competitorId)
          const Icon = TYPE_ICONS[alert.itemType] || Activity
          const isRead = read.has(alert.id)
          return (
            <Link
              key={alert.id}
              to="/intelligence"
              onClick={() => { setRead(r => new Set([...r, alert.id])); onClose() }}
              className={`flex gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors ${isRead ? 'opacity-55' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: competitor?.bgColor || '#F1F5F9' }}>
                <Icon size={14} style={{ color: competitor?.color || '#475569' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: competitor?.color }}>{competitor?.shortName}</span>
                  {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56]" />}
                  <span className="text-xs text-[#94A3B8] ml-auto">{formatRelative(alert.publishedDate)}</span>
                </div>
                <p className="text-xs text-[#1E293B] leading-snug line-clamp-2">{alert.headline}</p>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="px-4 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC]">
        <Link to="/intelligence" onClick={onClose} className="text-xs font-medium text-[#0F6E56] hover:underline">
          View all intelligence →
        </Link>
      </div>
    </div>
  )
}

function UserMenu({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  async function handleLogout() { await logout(); navigate('/login'); onClose() }
  return (
    <div className="absolute right-0 top-12 w-56 bg-white rounded-xl border border-[#E2E8F0] shadow-2xl z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-[#F1F5F9]">
        <p className="text-sm font-semibold text-[#1E293B]">{user?.name}</p>
        <p className="text-xs text-[#94A3B8]">{user?.org}</p>
      </div>
      <div className="py-1">
        <Link to="/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors">
          <Settings size={15} /> Settings
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#DC2626] hover:bg-red-50 transition-colors">
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  )
}

function useOutsideClick(ref, handler) {
  useEffect(() => {
    function listener(e) { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

function UserAvatar({ user }) {
  const initials = user?.name ? user.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('') : 'U'
  return (
    <div className="w-8 h-8 rounded-full bg-[#0F6E56] flex items-center justify-center">
      <span className="text-white text-xs font-semibold">{initials}</span>
    </div>
  )
}

export default function TopBar() {
  const { user } = useAuth()
  const { backendConnected } = useData()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showContentPanel, setShowContentPanel] = useState(false)
  const notifRef = useRef(null)
  const userRef = useRef(null)

  useOutsideClick(notifRef, () => setShowNotifications(false))
  useOutsideClick(userRef, () => setShowUserMenu(false))

  return (
    <>
      <header
        className="fixed top-0 right-0 h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 z-10"
        style={{ left: '240px' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#1E293B]">{user?.org || 'Stamford Health'}</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="text-xs text-[#94A3B8]">Lower Fairfield County, CT</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
            <span className={backendConnected ? 'text-emerald-600' : 'text-slate-400'}>
              {backendConnected ? 'Live' : 'Offline'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Update Dashboard button */}
          <button
            onClick={() => setShowContentPanel(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F6E56] text-white text-xs font-semibold rounded-lg hover:bg-[#0D5E49] transition-colors shadow-sm"
          >
            <PenLine size={13} />
            Update Dashboard
          </button>

          {/* Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setShowNotifications(v => !v); setShowUserMenu(false) }}
              className="relative p-2 text-[#475569] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              <Bell size={17} strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D97706] rounded-full ring-2 ring-white" />
            </button>
            {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
          </div>

          {/* User */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => { setShowUserMenu(v => !v); setShowNotifications(false) }}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors group"
            >
              <UserAvatar user={user} />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-[#1E293B] leading-tight">{user?.name}</p>
                <p className="text-xs text-[#94A3B8] leading-tight">{user?.title}</p>
              </div>
              <ChevronDown size={13} className="text-[#94A3B8] group-hover:text-[#475569] transition-colors" />
            </button>
            {showUserMenu && <UserMenu onClose={() => setShowUserMenu(false)} />}
          </div>
        </div>
      </header>

      {showContentPanel && <ContentPanel onClose={() => setShowContentPanel(false)} />}
    </>
  )
}

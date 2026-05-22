import React, { useState } from 'react'
import { Plus, X, Check, MapPin, Bell, Shield, User } from 'lucide-react'
import { COMPETITORS, USER_ORG } from '../data/seed.js'
import { useAuth } from '../context/AuthContext.jsx'

const SERVICE_LINE_OPTIONS = [
  'Cardiology', 'Oncology', 'Primary Care', 'Behavioral Health',
  'Orthopedics', 'Neurology', 'Value-Based Care', 'Executive Health',
  'Payer/Contracting', 'Academic/Research',
]

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-[#0F6E56]' : 'bg-[#CBD5E1]'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  )
}

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F1F5F9]">
        <h2 className="text-sm font-semibold text-[#1E293B]">{title}</h2>
        {description && <p className="text-xs text-[#94A3B8] mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

export default function Settings() {
  const { user } = useAuth()

  // Watchlist state
  const [watchlist, setWatchlist] = useState(COMPETITORS.map(c => c.id))
  const [newCompetitor, setNewCompetitor] = useState('')

  // Geography state
  const [geographyLevels, setGeographyLevels] = useState({
    local: true,
    regional: true,
    national: false,
  })

  // Service line filters
  const [activeServiceLines, setActiveServiceLines] = useState(
    ['Cardiology', 'Oncology', 'Primary Care', 'Behavioral Health', 'Orthopedics']
  )

  // Notifications
  const [notifications, setNotifications] = useState({
    weeklyDigest: true,
    alertEmail: true,
    leadershipAlerts: true,
    conAlerts: true,
    payerAlerts: false,
    marketPulseUpdates: true,
  })

  function getCompetitor(id) {
    return COMPETITORS.find(c => c.id === id)
  }

  function removeFromWatchlist(id) {
    setWatchlist(prev => prev.filter(c => c !== id))
  }

  function addToWatchlist() {
    const trimmed = newCompetitor.trim()
    if (!trimmed) return
    const id = trimmed.toLowerCase().replace(/\s+/g, '-')
    if (!watchlist.includes(id)) {
      setWatchlist(prev => [...prev, id])
      COMPETITORS.push({ id, name: trimmed, shortName: trimmed.split(' ')[0], color: '#475569', bgColor: '#F1F5F9', textColor: '#475569' })
    }
    setNewCompetitor('')
  }

  function toggleServiceLine(sl) {
    setActiveServiceLines(prev =>
      prev.includes(sl) ? prev.filter(s => s !== sl) : [...prev, sl]
    )
  }

  function toggleGeo(level) {
    setGeographyLevels(prev => ({ ...prev, [level]: !prev[level] }))
  }

  function toggleNotification(key) {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Settings</h1>
        <p className="text-sm text-[#94A3B8] mt-0.5">Configure your watchlist, geography, and notification preferences</p>
      </div>

      {/* Profile */}
      <SectionCard title="Your Profile" description="Account information from your organization">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#0F6E56] text-white text-lg font-bold flex items-center justify-center flex-shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'SC'}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1E293B]">{user?.name || 'Dr. Sarah Chen'}</p>
            <p className="text-xs text-[#475569]">{user?.title || 'Chief Strategy Officer'}</p>
            <p className="text-xs text-[#94A3B8]">{USER_ORG.name} · {USER_ORG.geography}</p>
          </div>
        </div>
      </SectionCard>

      {/* Competitor Watchlist */}
      <SectionCard
        title="Competitor Watchlist"
        description="Health systems you want to monitor. Intelligence items will be filtered to this list."
      >
        <div className="space-y-3">
          {watchlist.map(id => {
            const competitor = getCompetitor(id)
            if (!competitor) return null
            return (
              <div key={id} className="flex items-center justify-between py-2.5 border-b border-[#F1F5F9] last:border-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: competitor.color }}
                  />
                  <span className="text-sm font-medium text-[#1E293B]">{competitor.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-md font-semibold"
                    style={{ backgroundColor: competitor.bgColor, color: competitor.textColor }}
                  >
                    {competitor.shortName}
                  </span>
                </div>
                <button
                  onClick={() => removeFromWatchlist(id)}
                  className="text-[#CBD5E1] hover:text-[#DC2626] transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            )
          })}

          {/* Add competitor */}
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newCompetitor}
              onChange={e => setNewCompetitor(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addToWatchlist()}
              placeholder="Add a competitor health system…"
              className="flex-1 px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
            />
            <button
              onClick={addToWatchlist}
              disabled={!newCompetitor.trim()}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#0F6E56] text-white text-sm font-medium rounded-lg hover:bg-[#0D5E49] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Geography */}
      <SectionCard
        title="Geography Layers"
        description="Select which service areas to include in your intelligence feed."
      >
        <div className="space-y-3">
          {[
            { key: 'local', label: 'Primary Service Area (PSA)', desc: 'Lower Fairfield County, CT — Stamford, Greenwich, Darien, New Canaan, Westport' },
            { key: 'regional', label: 'Secondary Service Area (SSA)', desc: 'Greater CT and Westchester County, NY' },
            { key: 'national', label: 'National', desc: 'National signals with direct relevance to your market or service lines' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-[#F1F5F9] last:border-0">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[#0F6E56] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#1E293B]">{label}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{desc}</p>
                </div>
              </div>
              <Toggle checked={geographyLevels[key]} onChange={() => toggleGeo(key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Service Lines */}
      <SectionCard
        title="Service Line Filters"
        description="Filter your intelligence feed to the service lines most relevant to your strategy."
      >
        <div className="flex flex-wrap gap-2">
          {SERVICE_LINE_OPTIONS.map(sl => (
            <button
              key={sl}
              onClick={() => toggleServiceLine(sl)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                activeServiceLines.includes(sl)
                  ? 'bg-[#E6F4F1] text-[#0F6E56] border-[#0F6E56]/30'
                  : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] hover:border-[#0F6E56]/30'
              }`}
            >
              {activeServiceLines.includes(sl) && <Check size={11} strokeWidth={2.5} />}
              {sl}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard
        title="Notification Preferences"
        description="Control how and when PulsePoint delivers alerts and digests."
      >
        <div className="space-y-1">
          {[
            { key: 'weeklyDigest', label: 'Weekly Digest email', desc: 'Delivered every Monday at 6:00 AM' },
            { key: 'alertEmail', label: 'New intelligence alerts', desc: 'Email when new items match your watchlist and filters' },
            { key: 'leadershipAlerts', label: 'Leadership change alerts', desc: 'Immediate notification for C-suite and VP changes at watched systems' },
            { key: 'conAlerts', label: 'CON filing alerts', desc: 'Notify when a new CON is filed in your geography' },
            { key: 'payerAlerts', label: 'Payer and contracting signals', desc: 'Network changes, direct-to-employer contracts' },
            { key: 'marketPulseUpdates', label: 'Market Pulse score changes', desc: 'When momentum scores shift significantly on tracked topics' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
              <div className="flex items-start gap-2.5">
                <Bell size={13} className="text-[#475569] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#1E293B]">{label}</p>
                  <p className="text-xs text-[#94A3B8]">{desc}</p>
                </div>
              </div>
              <Toggle checked={notifications[key]} onChange={() => toggleNotification(key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Save button */}
      <div className="flex justify-end gap-3 pb-2">
        <button className="px-4 py-2 text-sm font-medium text-[#475569] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors">
          Reset to defaults
        </button>
        <button className="flex items-center gap-2 px-5 py-2 bg-[#0F6E56] text-white text-sm font-medium rounded-lg hover:bg-[#0D5E49] transition-colors shadow-sm">
          <Check size={14} /> Save settings
        </button>
      </div>
    </div>
  )
}

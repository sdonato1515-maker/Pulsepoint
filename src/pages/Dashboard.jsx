import React from 'react'
import { Link } from 'react-router-dom'
import {
  Bell, Activity, FileText, Users, TrendingUp, TrendingDown, Minus,
  ArrowRight, AlertTriangle, ChevronRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import SourceTag from '../components/ui/SourceTag.jsx'

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}
function getTodayString() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}
function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

const STAT_ICONS = { Bell, Activity, FileText, Users }

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, subtitle, icon, color, bgColor }) {
  const Icon = STAT_ICONS[icon] || Bell
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bgColor }}>
        <Icon size={20} style={{ color }} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="text-3xl font-bold text-[#1E293B] leading-none tabular-nums">{value}</div>
        <div className="text-sm font-semibold text-[#1E293B] mt-1">{label}</div>
        <div className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</div>
      </div>
    </div>
  )
}

// ── Situation report banner ───────────────────────────────────────────────────
function SituationBanner({ report }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-[#E2E8F0]" style={{ backgroundColor: '#0F6E56' }}>
        <AlertTriangle size={14} className="text-white/80" />
        <span className="text-xs font-bold text-white tracking-widest uppercase">
          Situation Report · Week of May 19, 2026
        </span>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm text-[#1E293B] leading-relaxed">{report.text}</p>
        <p className="text-xs text-[#94A3B8] mt-2">
          Last updated {formatDate(report.updatedAt)} · Edit via <span className="text-[#0F6E56] font-medium">Update Dashboard</span>
        </p>
      </div>
    </div>
  )
}

// ── Competitor move card ──────────────────────────────────────────────────────
function MoveCard({ item, competitor }) {
  return (
    <div
      className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden hover:shadow-md transition-all group"
    >
      {/* Colored top band */}
      <div className="h-1" style={{ backgroundColor: competitor?.color || '#E2E8F0' }} />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: competitor?.bgColor, color: competitor?.textColor }}
          >
            {competitor?.shortName}
          </span>
          {item.serviceLine && (
            <span className="text-xs font-medium px-2 py-1 rounded-lg bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
              {item.serviceLine}
            </span>
          )}
          {item.flag === 'new' && (
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-[#DCFCE7] text-[#15803D]">New</span>
          )}
        </div>
        <p className="text-sm font-semibold text-[#1E293B] leading-snug mb-2.5">{item.headline}</p>
        <div className="border-l-[3px] border-[#0F6E56] pl-3 mb-3">
          <p className="text-xs italic text-[#475569] leading-relaxed">{item.soWhat}</p>
        </div>
        <SourceTag source={item.source} date={item.publishedDate} url={item.sourceUrl} />
      </div>
    </div>
  )
}

// ── Market Pulse card ─────────────────────────────────────────────────────────
function PulseCard({ topic }) {
  const color = topic.momentumScore >= 75 ? '#0F6E56' : topic.momentumScore >= 50 ? '#D97706' : '#DC2626'
  const TrendIcon = topic.trendDirection === 'up' ? TrendingUp : topic.trendDirection === 'down' ? TrendingDown : Minus
  const trendColor = topic.trendDirection === 'up' ? '#059669' : topic.trendDirection === 'down' ? '#DC2626' : '#94A3B8'

  return (
    <Link
      to="/market-pulse"
      className="block bg-white rounded-xl border border-[#E2E8F0] p-4 hover:shadow-md hover:border-[#0F6E56]/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <p className="text-sm font-semibold text-[#1E293B] group-hover:text-[#0F6E56] transition-colors leading-snug">
          {topic.name}
        </p>
        <div className="flex items-center gap-1 flex-shrink-0" style={{ color: trendColor }}>
          <TrendIcon size={13} strokeWidth={2.5} />
          <span className="text-xs font-bold">{topic.momentumScore}</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden mb-2">
        <div className="h-1.5 rounded-full" style={{ width: `${topic.momentumScore}%`, backgroundColor: color }} />
      </div>
      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">{topic.summary}</p>
    </Link>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth()
  const {
    dashboardStats, intelligenceItems, marketPulseTopics, weeklyDigest,
    conFilings, watchlist, competitors, situationReport,
  } = useData()

  function getCompetitor(id) { return competitors.find(c => c.id === id) }

  const topMoves = intelligenceItems
    .filter(i => i.itemType !== 'other')
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    .slice(0, 3)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">
            {getGreeting()}, {user?.name || 'Dr. Chen'}
          </h1>
          <p className="text-sm text-[#94A3B8] mt-0.5">{getTodayString()}</p>
        </div>
        <Link
          to="/digest"
          className="flex items-center gap-1.5 text-sm font-medium text-[#0F6E56] hover:text-[#0D5E49] transition-colors"
        >
          View weekly digest <ArrowRight size={14} />
        </Link>
      </div>

      {/* Situation report */}
      <SituationBanner report={situationReport} />

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {dashboardStats.map(stat => <StatCard key={stat.label} {...stat} />)}
      </div>

      {/* 2-column body */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT: 2/3 */}
        <div className="xl:col-span-2 space-y-6">

          {/* Top competitor moves */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-[#1E293B]">Top Competitor Moves This Week</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">Most recent across your watchlist</p>
              </div>
              <Link
                to="/intelligence"
                className="flex items-center gap-1 text-sm font-medium text-[#0F6E56] hover:text-[#0D5E49] transition-colors"
              >
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {topMoves.map(item => (
                <MoveCard key={item.id} item={item} competitor={getCompetitor(item.competitorId)} />
              ))}
            </div>
          </div>

          {/* Market Pulse */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-[#1E293B]">Market Pulse</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">Initiative momentum in your market</p>
              </div>
              <Link
                to="/market-pulse"
                className="flex items-center gap-1 text-sm font-medium text-[#0F6E56] hover:text-[#0D5E49] transition-colors"
              >
                Explore <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {marketPulseTopics.slice(0, 4).map(topic => <PulseCard key={topic.id} topic={topic} />)}
            </div>
          </div>
        </div>

        {/* RIGHT: 1/3 */}
        <div className="space-y-4">

          {/* Weekly Digest preview */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="text-sm font-bold text-[#1E293B]">Weekly Digest</h3>
                <span className="text-xs text-[#94A3B8]">Week of {weeklyDigest.weekOf}</span>
              </div>
              <p className="text-xs text-[#94A3B8]">Ready for executive distribution</p>
            </div>
            <div className="px-5 py-3 space-y-2.5">
              {weeklyDigest.sections.map(section => (
                <div key={section.title} className="flex items-center justify-between">
                  <span className="text-sm text-[#475569]">{section.title}</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded-full">
                    {section.itemCount}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 pb-4">
              <Link
                to="/digest"
                className="block w-full text-center py-2 bg-[#0F6E56] text-white text-sm font-semibold rounded-xl hover:bg-[#0D5E49] transition-colors"
              >
                Read Full Digest
              </Link>
            </div>
          </div>

          {/* Watchlist */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#1E293B]">Watchlist</h3>
              <Link to="/settings" className="text-xs font-medium text-[#0F6E56] hover:underline">Manage</Link>
            </div>
            <div className="space-y-1">
              {watchlist.map(entry => {
                const c = getCompetitor(entry.competitorId)
                if (!c) return null
                return (
                  <Link
                    key={entry.competitorId}
                    to="/intelligence"
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-sm font-medium text-[#1E293B]">{c.shortName}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bgColor, color: c.textColor }}>
                      {entry.alertCount}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* CON Filings */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#1E293B]">Active CON Filings</h3>
              <span className="text-xs text-[#94A3B8]">{conFilings.length} active</span>
            </div>
            <div className="space-y-3">
              {conFilings.map(filing => {
                const c = getCompetitor(filing.competitorId)
                return (
                  <div key={filing.id} className="flex items-start justify-between gap-3 py-2.5 border-b border-[#F8FAFC] last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-bold" style={{ color: c?.color }}>{c?.shortName}</span>
                        {filing.beds && <span className="text-xs text-[#94A3B8]">· {filing.beds} beds</span>}
                      </div>
                      <p className="text-xs font-semibold text-[#1E293B] truncate">{filing.facility}</p>
                      <p className="text-xs text-[#94A3B8]">{filing.serviceLine}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                        style={{ backgroundColor: `${filing.statusColor}18`, color: filing.statusColor }}
                      >
                        {filing.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

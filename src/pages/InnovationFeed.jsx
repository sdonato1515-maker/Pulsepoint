import React, { useState, useMemo } from 'react'
import { ChevronDown, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { INNOVATION_ITEMS } from '../data/seed.js'

const INITIATIVE_TYPE_LABELS = {
  technology: 'Technology',
  care_model: 'Care Model',
  new_service_line: 'New Service Line',
  care_integration: 'Care Integration',
  employer_partnership: 'Employer Partnership',
  partnership_model: 'Partnership Model',
}

const INITIATIVE_TYPE_COLORS = {
  technology: { bg: '#EFF6FF', color: '#1D4ED8' },
  care_model: { bg: '#F0FDF4', color: '#16A34A' },
  new_service_line: { bg: '#FDF4FF', color: '#9333EA' },
  care_integration: { bg: '#FFF7ED', color: '#EA580C' },
  employer_partnership: { bg: '#ECFDF5', color: '#059669' },
  partnership_model: { bg: '#F1F5F9', color: '#475569' },
}

const SERVICE_LINES = ['All Service Lines', 'Oncology', 'Cardiology', 'Executive Health', 'Behavioral Health', 'Orthopedics']
const INITIATIVE_TYPES = ['All Types', 'Technology', 'Care Model', 'New Service Line', 'Care Integration', 'Employer Partnership', 'Partnership Model']

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function InnovationCard({ item }) {
  const typeLabel = INITIATIVE_TYPE_LABELS[item.initiativeType] || item.initiativeType
  const typeColor = INITIATIVE_TYPE_COLORS[item.initiativeType] || { bg: '#F1F5F9', color: '#475569' }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1E293B] text-white">
            {item.systemName}
          </span>
          <span
            className="px-2 py-0.5 rounded-md text-xs font-medium"
            style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
          >
            {item.serviceLine}
          </span>
          <span
            className="px-2 py-0.5 rounded-md text-xs font-semibold"
            style={{ backgroundColor: typeColor.bg, color: typeColor.color }}
          >
            {typeLabel}
          </span>
        </div>
        <span className="text-xs text-[#94A3B8] whitespace-nowrap flex-shrink-0">{formatDate(item.publishedDate)}</span>
      </div>

      <h3 className="text-sm font-semibold text-[#1E293B] leading-snug mb-2">{item.headline}</h3>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">{item.summary}</p>

      {item.outcomes && (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg px-3 py-2.5 mb-3">
          <p className="text-xs font-semibold text-[#15803D] mb-0.5">Reported Outcomes</p>
          <p className="text-xs text-[#166534] leading-relaxed">{item.outcomes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {item.relevanceTags.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-md text-xs bg-[#F8FAFC] text-[#94A3B8] border border-[#E2E8F0]">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-[#F1F5F9]">
        <Link
          to="/peer-network"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F6E56] hover:text-[#0D5E49] transition-colors"
        >
          <Users size={14} />
          Connect with a peer doing this
        </Link>
      </div>
    </div>
  )
}

export default function InnovationFeed() {
  const [selectedServiceLine, setSelectedServiceLine] = useState('All Service Lines')
  const [selectedType, setSelectedType] = useState('All Types')

  const filtered = useMemo(() => {
    return INNOVATION_ITEMS.filter(item => {
      if (selectedServiceLine !== 'All Service Lines' && item.serviceLine !== selectedServiceLine) return false
      if (selectedType !== 'All Types') {
        const label = INITIATIVE_TYPE_LABELS[item.initiativeType] || item.initiativeType
        if (label !== selectedType) return false
      }
      return true
    })
  }, [selectedServiceLine, selectedType])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Innovation Feed</h1>
        <p className="text-sm text-[#94A3B8] mt-0.5">
          What high-performing health systems are building nationally — curated for your strategic context
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <select
            value={selectedServiceLine}
            onChange={e => setSelectedServiceLine(e.target.value)}
            className="pl-3 pr-8 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#475569] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56] cursor-pointer shadow-sm"
          >
            {SERVICE_LINES.map(sl => <option key={sl}>{sl}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="pl-3 pr-8 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#475569] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56] cursor-pointer shadow-sm"
          >
            {INITIATIVE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>

        <span className="text-sm text-[#94A3B8]">{filtered.length} initiative{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {filtered.map(item => <InnovationCard key={item.id} item={item} />)}
        {filtered.length === 0 && (
          <div className="col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-12 text-center">
            <p className="text-sm text-[#94A3B8]">No innovation items match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

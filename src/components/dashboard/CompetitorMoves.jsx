import React from 'react'
import Badge from '../ui/Badge.jsx'
import SourceTag from '../ui/SourceTag.jsx'
import { COMPETITORS } from '../../data/seed.js'

function getCompetitor(competitorId) {
  return COMPETITORS.find(c => c.id === competitorId)
}

function getServiceLineColor(serviceLine) {
  const map = {
    'Cardiology': { bg: '#EFF6FF', text: '#1D4ED8' },
    'Oncology': { bg: '#FFF7ED', text: '#C2410C' },
    'Primary Care': { bg: '#F0FDF4', text: '#15803D' },
    'Behavioral Health': { bg: '#FAF5FF', text: '#7E22CE' },
    'Payer/Contracting': { bg: '#F8FAFC', text: '#475569' },
    'Orthopedics': { bg: '#FFF1F2', text: '#BE123C' },
    'Value-Based Care': { bg: '#F0FDF4', text: '#15803D' },
    'Neurology': { bg: '#EFF6FF', text: '#1D4ED8' },
  }
  return map[serviceLine] || { bg: '#F8FAFC', text: '#475569' }
}

export function CompetitorMoveCard({ item }) {
  const competitor = getCompetitor(item.competitorId)
  const slColor = getServiceLineColor(item.serviceLine)

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="flex items-start gap-3 mb-2">
        {competitor && (
          <Badge
            bgColor={competitor.bgColor}
            textColor={competitor.textColor}
            size="sm"
          >
            {competitor.shortName}
          </Badge>
        )}
        {item.serviceLine && (
          <Badge
            bgColor={slColor.bg}
            textColor={slColor.text}
            size="sm"
          >
            {item.serviceLine}
          </Badge>
        )}
      </div>

      <p className="text-sm font-semibold text-[#1E293B] leading-snug">{item.headline}</p>

      {item.soWhat && (
        <p className="text-sm italic text-[#475569] mt-2 pl-3 border-l-2 border-[#0F6E56]">
          {item.soWhat}
        </p>
      )}

      <div className="mt-3">
        <SourceTag source={item.source} date={item.publishedDate} url={item.sourceUrl} />
      </div>
    </div>
  )
}

export default function CompetitorMoves({ items }) {
  return (
    <div className="space-y-3">
      {items.map(item => (
        <CompetitorMoveCard key={item.id} item={item} />
      ))}
    </div>
  )
}

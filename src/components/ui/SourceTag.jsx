import React from 'react'
import { ExternalLink } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const SOURCE_URLS = {
  'CT OHCA': 'https://portal.ct.gov/DPH/Health-Care-Quality-And-Safety/Office-of-Health-Care-Access',
  'YNHH Press Release': 'https://www.ynhh.org/news',
  'HHC Press Release': 'https://hartfordhealthcare.org/about-us/news-press/news',
  'Northwell Press Release': 'https://www.northwell.edu/about/newsroom',
  'Healthgrades': 'https://www.healthgrades.com/',
  'Greenwich Time': 'https://www.greenwichtime.com/',
  'Hartford Business Journal': 'https://www.hartfordbusiness.com/',
  'Modern Healthcare': 'https://www.modernhealthcare.com/',
  'CT Mirror': 'https://ctmirror.org/',
  'New Haven Register': 'https://www.nhregister.com/',
  "Becker's Hospital Review": 'https://www.beckershospitalreview.com/',
  "Becker's Payer Issues": 'https://www.beckershospitalreview.com/payer-issues.html',
  'Hartford Courant': 'https://www.courant.com/',
}

export default function SourceTag({ source, date, url }) {
  const resolvedUrl = (url && url !== '#') ? url : SOURCE_URLS[source]

  return (
    <div className="flex items-center justify-between gap-3 mt-1">
      <span className="text-xs text-[#94A3B8]">
        {source}
        {date && (
          <>
            <span className="mx-1 text-[#CBD5E1]">·</span>
            {formatDate(date)}
          </>
        )}
      </span>
      {resolvedUrl && (
        <a
          href={resolvedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#0F6E56] hover:text-[#0D5E49] transition-colors whitespace-nowrap flex-shrink-0"
        >
          Read article
          <ExternalLink size={11} strokeWidth={2} />
        </a>
      )}
    </div>
  )
}

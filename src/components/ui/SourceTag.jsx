import React from 'react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function SourceTag({ source, date, url }) {
  return (
    <span className="text-xs text-[#94A3B8] flex items-center gap-1">
      {url && url !== '#' ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#0F6E56] transition-colors"
        >
          {source}
        </a>
      ) : (
        <span>{source}</span>
      )}
      {date && (
        <>
          <span className="text-[#CBD5E1]">·</span>
          <span>{formatDate(date)}</span>
        </>
      )}
    </span>
  )
}

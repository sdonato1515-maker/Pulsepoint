import React from 'react'

export default function Card({ children, className = '', padding = true }) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E2E8F0] shadow-sm ${padding ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

import React from 'react'

export default function Badge({ children, color, bgColor, textColor, size = 'sm' }) {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md whitespace-nowrap ${sizeClasses[size]}`}
      style={{
        backgroundColor: bgColor || '#F1F5F9',
        color: textColor || color || '#475569',
      }}
    >
      {children}
    </span>
  )
}

import { useId } from 'react'
import type { Tone } from '../lib/api/types'
import { toneHex } from '../lib/tone'

export function Ring({
  value,
  size = 132,
  stroke = 10,
  tone = 'teal',
  label,
  detail,
  track = 'rgba(14, 31, 43, 0.08)',
  light = false,
}: {
  value: number
  size?: number
  stroke?: number
  tone?: Tone
  label?: string
  detail?: string
  track?: string
  light?: boolean
}) {
  const id = useId().replace(/:/g, '')
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.max(0, Math.min(100, value)) / 100)
  const color = toneHex[tone]

  return (
    <div className="zx-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.65" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          className="zx-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#ring-${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            ['--ring-circumference' as string]: `${circumference}`,
            ['--ring-offset' as string]: `${offset}`,
          }}
        />
      </svg>
      <div className={`zx-ring-center ${light ? 'is-light' : ''}`}>
        <strong style={{ fontSize: size < 110 ? 19 : size < 130 ? 24 : 28 }}>{label ?? `${value}%`}</strong>
        {detail && <span>{detail}</span>}
      </div>
    </div>
  )
}

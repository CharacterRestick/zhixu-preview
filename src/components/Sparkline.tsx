import { motion } from 'framer-motion'
import { useId } from 'react'
import type { Tone } from '../lib/api/types'
import { toneHex } from '../lib/tone'

export function Sparkline({
  values,
  tone = 'teal',
  height = 64,
  fill = true,
  showDot = true,
}: {
  values: number[]
  tone?: Tone
  height?: number
  fill?: boolean
  showDot?: boolean
}) {
  const id = useId().replace(/:/g, '')
  const width = 240
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(1, max - min)
  const points = values.map((value, index) => {
    const x = (index / Math.max(1, values.length - 1)) * width
    const y = height - 8 - ((value - min) / span) * (height - 18)
    return [x, y] as const
  })
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`
  const color = toneHex[tone]
  const last = points[points.length - 1]

  return (
    <svg className="zx-spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ height }} aria-hidden="true">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <motion.path d={area} fill={`url(#spark-${id})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }} />}
      <path
        className="zx-spark-line"
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDot && last && (
        <motion.circle
          cx={last[0]}
          cy={last[1]}
          r="4"
          fill={color}
          stroke="var(--paper-2)"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 380, damping: 22 }}
        />
      )}
    </svg>
  )
}

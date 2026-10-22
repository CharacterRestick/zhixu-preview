import { motion } from 'framer-motion'
import type { Tone } from '../lib/api/types'
import { toneHex } from '../lib/tone'

export function Radar({
  data,
  tone = 'teal',
  size = 330,
}: {
  data: { label: string; value: number }[]
  tone?: Tone
  size?: number
}) {
  const width = size
  const height = size * 0.9
  const cx = width / 2
  const cy = height / 2 + 4
  const radius = size * 0.265
  const count = data.length
  const color = toneHex[tone]
  const point = (index: number, value: number) => {
    const angle = -Math.PI / 2 + (index / count) * Math.PI * 2
    const r = radius * (value / 100)
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as const
  }
  const polygon = data.map((item, index) => point(index, item.value).join(',')).join(' ')

  return (
    <svg className="zx-radar" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="能力雷达图">
      {[25, 50, 75, 100].map((level) => {
        const ring = data.map((_, index) => point(index, level).join(',')).join(' ')
        return <polygon key={level} points={ring} fill="none" stroke="rgba(14,31,43,0.10)" strokeWidth="1" />
      })}
      {data.map((item, index) => {
        const [x, y] = point(index, 100)
        return <line key={item.label} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(14,31,43,0.10)" strokeWidth="1" />
      })}
      <motion.polygon
        points={polygon}
        fill={color}
        fillOpacity="0.16"
        stroke={color}
        strokeWidth="2.2"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {data.map((item, index) => {
        const [x, y] = point(index, item.value)
        return <motion.circle key={item.label} cx={x} cy={y} r="3.5" fill={color} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + index * 0.05 }} />
      })}
      {data.map((item, index) => {
        const angle = -Math.PI / 2 + (index / count) * Math.PI * 2
        const lx = cx + Math.cos(angle) * (radius + 38)
        const ly = cy + Math.sin(angle) * (radius + 38)
        const anchor = Math.abs(Math.cos(angle)) < 0.2 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end'
        return (
          <g key={item.label}>
            <text x={lx} y={ly - 2} textAnchor={anchor} className="zx-radar-label">
              {item.label}
            </text>
            <text x={lx} y={ly + 14} textAnchor={anchor} className="zx-radar-value">
              {item.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

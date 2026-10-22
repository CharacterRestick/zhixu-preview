import { motion } from 'framer-motion'
import type { LearningNode } from '../lib/api/types'

const statusColor: Record<LearningNode['status'], string> = {
  mastered: '#0f766e',
  learning: '#d97706',
  todo: '#c9d2d0',
}

export function KnowledgeMap({
  nodes,
  edges,
  selectedId,
  onSelect,
}: {
  nodes: LearningNode[]
  edges: { from: string; to: string }[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  const byId = new Map(nodes.map((node) => [node.id, node]))

  return (
    <div className="zx-map-wrap">
      <svg viewBox="0 0 820 460" className="zx-map" role="img" aria-label="一次函数知识地图">
        <defs>
          <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {edges.map((edge, index) => {
          const from = byId.get(edge.from)
          const to = byId.get(edge.to)
          if (!from || !to) return null
          const midX = (from.x + to.x) / 2
          const path = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`
          return (
            <motion.path
              key={`${edge.from}-${edge.to}`}
              d={path}
              fill="none"
              stroke="rgba(14,31,43,0.18)"
              strokeWidth="1.6"
              strokeDasharray="4 5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.15 + index * 0.08, duration: 0.8 }}
            />
          )
        })}
        {nodes.map((node, index) => {
          const selected = node.id === selectedId
          const color = statusColor[node.status]
          return (
            <motion.g
              key={node.id}
              className="zx-map-node"
              onClick={() => onSelect(node.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + index * 0.06, type: 'spring', stiffness: 180, damping: 18 }}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect(node.id)
              }}
            >
              {selected && <circle cx={node.x} cy={node.y} r="38" fill="none" stroke={color} strokeOpacity="0.28" strokeWidth="6" />}
              <circle cx={node.x} cy={node.y} r="28" fill={color} fillOpacity={node.status === 'todo' ? 0.18 : 0.16} stroke={color} strokeWidth={selected ? 2.8 : 1.8} filter={selected ? 'url(#mapGlow)' : undefined} />
              <circle cx={node.x} cy={node.y} r="20" fill="var(--paper-2)" />
              <text x={node.x} y={node.y + 4} textAnchor="middle" className="zx-map-node-value" fill={color}>
                {node.mastery}
              </text>
              <text x={node.x} y={node.y + 50} textAnchor="middle" className="zx-map-node-label">
                {node.label}
              </text>
            </motion.g>
          )
        })}
      </svg>
      <div className="zx-map-legend">
        <span><i className="is-mastered" />已掌握</span>
        <span><i className="is-learning" />正在学</span>
        <span><i className="is-todo" />待探索</span>
      </div>
    </div>
  )
}

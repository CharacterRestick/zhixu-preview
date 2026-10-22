import { motion } from 'framer-motion'

export function Heatmap({
  items,
  compact = false,
}: {
  items: { label: string; value: number }[]
  compact?: boolean
}) {
  return (
    <div className={`zx-heatmap ${compact ? 'is-compact' : ''}`}>
      {items.map((item, index) => {
        const alpha = 0.08 + (item.value / 100) * 0.72
        const strong = item.value >= 62
        return (
          <motion.div
            key={`${item.label}-${index}`}
            className="zx-heat-cell"
            style={{
              background: `linear-gradient(135deg, rgba(15,118,110,${alpha}), rgba(15,118,110,${Math.max(0.06, alpha - 0.18)}))`,
              color: strong ? 'white' : 'var(--ink)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035, duration: 0.45 }}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </motion.div>
        )
      })}
    </div>
  )
}

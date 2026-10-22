import { motion } from 'framer-motion'
import { ArrowUpRight, Lightbulb, Sparkles, TrendingUp } from 'lucide-react'

export function OrbitVisual() {
  return (
    <div className="zx-orbit-panel">
      <div className="zx-orbit-glow" />
      <div className="zx-orbit-grid" />
      <div className="zx-orbit-ring ring-1" />
      <div className="zx-orbit-ring ring-2" />
      <div className="zx-orbit-ring ring-3" />
      <div className="zx-orbit-path" />

      <span className="zx-orbit-dot dot-1" />
      <span className="zx-orbit-dot dot-2" />
      <span className="zx-orbit-dot dot-3" />
      <span className="zx-orbit-dot dot-4" />
      <span className="zx-orbit-dot dot-5" />

      <motion.div
        className="zx-orbit-core"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 180, damping: 18 }}
      >
        <Sparkles size={22} />
        <span>小序</span>
      </motion.div>

      <motion.div
        className="zx-float-card float-score"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <span className="zx-float-icon teal"><TrendingUp size={15} /></span>
        <div>
          <small>本周掌握增益</small>
          <strong>+12.4%</strong>
        </div>
        <ArrowUpRight size={15} className="zx-float-arrow" />
      </motion.div>

      <motion.div
        className="zx-float-card float-hint"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <span className="zx-float-icon amber"><Lightbulb size={15} /></span>
        <div>
          <small>小序刚刚</small>
          <strong>给了一个提示，不是答案</strong>
        </div>
      </motion.div>

      <motion.div
        className="zx-float-label float-label-a"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.25 }}
      >
        图像平移
      </motion.div>
      <motion.div
        className="zx-float-label float-label-b"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.35 }}
      >
        学科分析
      </motion.div>
    </div>
  )
}

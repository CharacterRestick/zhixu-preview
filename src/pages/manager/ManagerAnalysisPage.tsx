import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Download, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Heatmap } from '../../components/Heatmap'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { Ring } from '../../components/Ring'
import { Sparkline } from '../../components/Sparkline'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { toneHex, toneSoft } from '../../lib/tone'
import { useApi } from '../../lib/useApi'

export function ManagerAnalysisPage() {
  const { data, loading } = useApi(api.getManagerSubjectAnalysis)
  const toast = useToast()

  if (loading || !data) return <PageSkeleton />

  return (
    <div className="zx-page">
      <PageHeader
        eyebrow="SUBJECT ANALYSIS · 学科治理"
        title="看学科结构，不看班级排名。"
        description="从班级学情上升到学科治理：共性薄弱点、班级增值、资源与教研建议。增值已控制入口差异，不做绝对排名。"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => toast('学科报告导出会在接后端后开放')}>
              <Download size={15} /> 导出报告
            </Button>
            <Button size="sm" onClick={() => toast('已发起「图像平移」同课异构教研')}>
              <Sparkles size={15} /> 发起教研
            </Button>
          </>
        }
      />

      <div className="zx-manager-analysis-hero">
        <div>
          <span className="zx-eyebrow">{data.grade} · {data.subject}</span>
          <h2>一次函数，整体在往上走。</h2>
          <p>本周年级掌握度 {data.mastery}%，较上周 +{data.delta}%。但“图像平移”仍是共性薄弱点，值得一次同课异构。</p>
          <div className="zx-analysis-chips">
            <span><TrendingUp size={14} /> 连续 3 周上升</span>
            <span><Users size={14} /> 6 个班级 · 增值对比</span>
          </div>
        </div>
        <Ring value={data.mastery} size={132} stroke={10} tone="teal" detail="年级掌握" />
      </div>

      <div className="zx-manager-analysis-grid">
        <Card className="zx-mgr-trend-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">TREND</span>
              <h3>近 6 周掌握趋势</h3>
            </div>
            <span className="zx-delta is-up">+{data.trend[data.trend.length - 1] - data.trend[0]}%</span>
          </div>
          <div className="zx-big-spark">
            <Sparkline values={data.trend} tone="teal" height={150} />
            <div className="zx-chart-axis"><span>第 1 周</span><span>第 6 周</span></div>
          </div>
          <p className="zx-chart-note">趋势用于判断教学策略是否有效，不作为班级排名依据。</p>
        </Card>

        <Card className="zx-class-value-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">VALUE ADDED</span>
              <h3>班级增值对比</h3>
            </div>
            <span className="zx-soft-label">已控制入口差异</span>
          </div>
          <div className="zx-class-bars">
            {data.classes.map((item, index) => (
              <motion.div
                className="zx-class-bar"
                key={item.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + index * 0.05 }}
              >
                <span>{item.name}</span>
                <div><span style={{ width: `${item.value}%`, background: toneHex[item.tone] }} /></div>
                <strong>{item.value}</strong>
                <em style={{ color: toneHex[item.tone] }}>+{item.delta}</em>
              </motion.div>
            ))}
          </div>
          <p className="zx-chart-note">看“进步幅度”，不看“谁分高”。小样本会显示置信区间。</p>
        </Card>
      </div>

      <div className="zx-manager-analysis-bottom">
        <Card className="zx-heat-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">TOPIC HEATMAP</span>
              <h3>知识点掌握热力</h3>
            </div>
            <span className="zx-soft-label">全年级</span>
          </div>
          <Heatmap items={data.topics} />
        </Card>

        <Card className="zx-actions-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">NEXT ACTIONS</span>
              <h3>学科组下一步</h3>
            </div>
            <ArrowUpRight size={18} />
          </div>
          <div className="zx-action-list">
            {data.actions.map((action, index) => (
              <div className="zx-action-item" key={action}>
                <span>{index + 1}</span>
                <p>{action}</p>
              </div>
            ))}
          </div>
          <Button className="zx-full-btn" onClick={() => toast('已把建议加入学科组本周教研议程')}>
            加入本周教研议程 <ArrowRight size={15} />
          </Button>
        </Card>
      </div>
    </div>
  )
}

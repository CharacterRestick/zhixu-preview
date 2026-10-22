import { motion } from 'framer-motion'
import { ArrowRight, Award, FolderKanban, Plus, Sparkles, Trophy } from 'lucide-react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { toneHex, toneSoft } from '../../lib/tone'
import { useApi } from '../../lib/useApi'

export function GrowthPage() {
  const { data, loading } = useApi(api.getGrowth)
  const toast = useToast()

  if (loading || !data) return <PageSkeleton />

  return (
    <div className="zx-page">
      <PageHeader
        eyebrow="GROWTH & PORTFOLIO"
        title="你不是在刷题，你在解决问题。"
        description="项目、作品、回讲和徽章，都是“学会了”的证据。它们默认私密，只在你允许时分享。"
        actions={
          <Button size="sm" onClick={() => toast('新建项目会在接后端后开放')}>
            <Plus size={15} /> 新建项目
          </Button>
        }
      />

      <div className="zx-growth-grid">
        <div className="zx-growth-projects">
          {data.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <Card className="zx-growth-project">
                <div className={`zx-project-art small art-${project.tone}`}>
                  <span className="zx-project-orbit" />
                  <FolderKanban size={20} />
                  <span className="zx-project-status">{project.updated}</span>
                </div>
                <div className="zx-growth-project-body">
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <div className="zx-tag-row">{project.tags.map((tag) => <span className="zx-tag" key={tag}>{tag}</span>)}</div>
                  <div className="zx-project-progress">
                    <span><span style={{ width: `${project.progress}%`, background: toneHex[project.tone] }} /></span>
                    <strong>{project.progress}%</strong>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="zx-growth-side">
          <Card className="zx-badge-card">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">BADGES</span>
                <h3>能力徽章</h3>
              </div>
              <Award size={18} />
            </div>
            <div className="zx-badge-grid">
              {data.badges.map((badge) => (
                <div className="zx-badge" key={badge.id} style={{ background: toneSoft[badge.tone] }}>
                  <span style={{ color: toneHex[badge.tone] }}><Trophy size={18} /></span>
                  <strong>{badge.title}</strong>
                  <small>{badge.detail}</small>
                </div>
              ))}
            </div>
            <p className="zx-fine-print">徽章绑定作品与评审记录，可验证、可撤销，不替代学历。</p>
          </Card>

          <Card className="zx-timeline-card">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">TIMELINE</span>
                <h3>最近的成长</h3>
              </div>
              <Sparkles size={18} />
            </div>
            <div className="zx-timeline">
              {data.timeline.map((entry) => (
                <div className="zx-timeline-item" key={entry.title}>
                  <span className="zx-timeline-dot" />
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{entry.detail}</p>
                  </div>
                  <time>{entry.date}</time>
                </div>
              ))}
            </div>
            <button className="zx-text-link" onClick={() => toast('完整成长档案会在接后端后开放')}>
              查看完整成长档案 <ArrowRight size={14} />
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}

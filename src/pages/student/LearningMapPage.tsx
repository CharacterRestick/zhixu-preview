import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, Compass, Layers3, Lock, Sparkles, Target } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { KnowledgeMap } from '../../components/KnowledgeMap'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { useApi } from '../../lib/useApi'

export function LearningMapPage() {
  const { data, loading } = useApi(api.getLearningMap)
  const [selectedId, setSelectedId] = useState('n3')
  const toast = useToast()
  const navigate = useNavigate()

  if (loading || !data) return <PageSkeleton />
  const selected = data.nodes.find((node) => node.id === selectedId) ?? data.nodes[0]
  const statusLabel = selected.status === 'mastered' ? '已掌握' : selected.status === 'learning' ? '正在学' : '待探索'

  return (
    <div className="zx-page">
      <PageHeader
        eyebrow="LEARNING MAP · 数学"
        title="你走到哪了，一眼看清。"
        description="不按班级排名，只看自己的知识地图。每个节点都能点开，看看它和前后知识的关系。"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => toast('已切换为「数学 · 一次函数」章节')}>
              <Layers3 size={15} /> 切换章节
            </Button>
            <Button size="sm" onClick={() => navigate('/student/tutor')}>
              问小序 <Sparkles size={15} />
            </Button>
          </>
        }
      />

      <div className="zx-map-layout">
        <Card className="zx-map-card">
          <div className="zx-map-toolbar">
            <div className="zx-subject-switch">
              <button className="is-active">数学</button>
              <button onClick={() => toast('物理地图会在接后端后开放')}>物理</button>
              <button onClick={() => toast('化学地图会在接后端后开放')}>化学</button>
            </div>
            <div className="zx-map-meta"><Compass size={14} /> 一次函数 · 8 个知识点</div>
          </div>
          <KnowledgeMap nodes={data.nodes} edges={data.edges} selectedId={selected.id} onSelect={setSelectedId} />
        </Card>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="zx-map-side"
          >
            <Card className="zx-node-card">
              <div className="zx-node-head">
                <span className={`zx-status-pill status-${selected.status}`}>{statusLabel}</span>
                <span className="zx-node-mastery">{selected.mastery}%</span>
              </div>
              <h2>{selected.label}</h2>
              <p>{selected.description}</p>
              <div className="zx-node-meta">
                <div>
                  <span>前置知识</span>
                  <strong>{selected.prerequisite}</strong>
                </div>
                <div>
                  <span>下一步</span>
                  <strong>{selected.next}</strong>
                </div>
              </div>
              <div className="zx-node-progress">
                <div className="zx-node-progress-head"><span>当前掌握度</span><strong>{selected.mastery}%</strong></div>
                <div className="zx-progress-track"><span style={{ width: `${selected.mastery}%` }} /></div>
              </div>
              <Button className="zx-full-btn" onClick={() => navigate('/student/tutor')}>
                开始这个知识点 <ArrowRight size={16} />
              </Button>
              <button className="zx-lock-note" onClick={() => toast('答案锁已开启：先思考，再看解析')}>
                <Lock size={13} /> 练习中不会直接给最终答案
              </button>
            </Card>

            <Card className="zx-path-card">
              <div className="zx-card-head compact">
                <div>
                  <span className="zx-eyebrow">NEXT PATH</span>
                  <h3>本周建议路径</h3>
                </div>
                <Target size={18} />
              </div>
              <div className="zx-path-list">
                {[
                  ['图像平移', '2 道变式 + 1 次回讲', '今天'],
                  ['待定系数法', '从图像反推解析式', '本周'],
                  ['校园节能方案', '用函数做一次真实决策', '项目周'],
                ].map(([title, detail, when], index) => (
                  <div className="zx-path-item" key={title}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{title}</strong>
                      <small>{detail}</small>
                    </div>
                    <em>{when}</em>
                  </div>
                ))}
              </div>
              <div className="zx-map-tip">
                <BookOpen size={15} />
                先补「图像平移」，别急着开新章。它是待定系数法的前置。
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

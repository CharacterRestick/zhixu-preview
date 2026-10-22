import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Download, Eye, HeartHandshake, Sparkles, Target, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Heatmap } from '../../components/Heatmap'
import { PageHeader } from '../../components/PageHeader'
import { Radar } from '../../components/Radar'
import { Ring } from '../../components/Ring'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/auth/AuthProvider'
import { useApi } from '../../lib/useApi'

export function SubjectAnalysisPage() {
  const { session } = useAuth()
  const isParent = session?.role === 'parent'
  const { data, loading } = useApi(
    () => (isParent ? api.getFamilySubjectAnalysis() : api.getSubjectAnalysis()),
    [isParent],
  )
  const [view, setView] = useState<'student' | 'parent'>(isParent ? 'parent' : 'student')
  const toast = useToast()
  const navigate = useNavigate()

  if (loading || !data) return <PageSkeleton />

  return (
    <div className="zx-page">
      <PageHeader
        eyebrow="SUBJECT ANALYSIS · 数学"
        title="不只看总分，看学科结构。"
        description="强项在哪、卡在哪、下一步练什么。学生看到自己的路径，家长看到趋势与建议，不看班级排名。"
        actions={
          <>
            {!isParent && (
              <div className="zx-view-toggle">
                <button className={view === 'student' ? 'is-active' : ''} onClick={() => setView('student')}><Eye size={14} /> 学生视图</button>
                <button className={view === 'parent' ? 'is-active' : ''} onClick={() => setView('parent')}><HeartHandshake size={14} /> 家长视图</button>
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={() => toast('学科报告导出会在接后端后开放')}>
              <Download size={15} /> 导出
            </Button>
          </>
        }
      />

      {view === 'parent' && (
        <motion.div className="zx-parent-view-banner" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <HeartHandshake size={18} />
          <div>
            <strong>家长视图：只看趋势、薄弱点与陪伴建议</strong>
            <span>{data.parentNote}</span>
          </div>
        </motion.div>
      )}

      <div className="zx-analysis-hero">
        <div>
          <span className="zx-eyebrow">CURRENT SUBJECT</span>
          <h2>{data.subject} · 一次函数</h2>
          <p>本周的进步主要来自“图像识别”。下一步不是加量，而是把“图像平移”练稳。</p>
          <div className="zx-analysis-chips">
            <span><TrendingUp size={14} /> 较上周 +{data.delta}%</span>
            <span><Target size={14} /> 最近目标：图像平移 70%</span>
          </div>
        </div>
        <div className="zx-analysis-ring">
          <Ring value={data.mastery} size={138} stroke={11} tone="teal" detail="学科掌握" />
          <div className="zx-analysis-ring-note">
            <strong>稳步上升</strong>
            <span>不是一次考试的结果</span>
          </div>
        </div>
      </div>

      <div className="zx-analysis-grid">
        <Card className="zx-radar-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">PROFILE</span>
              <h3>六维学科画像</h3>
            </div>
            <span className="zx-soft-label">带置信度</span>
          </div>
          <Radar data={data.radar} tone="teal" size={360} />
          <div className="zx-radar-foot">
            <span><i className="dot teal" /> 概念与计算是强项</span>
            <span><i className="dot amber" /> 迁移与回讲是下一步</span>
          </div>
        </Card>

        <div className="zx-analysis-side">
          <Card className="zx-insight-card is-good">
            <span className="zx-insight-icon"><Sparkles size={17} /></span>
            <div>
              <span className="zx-eyebrow">STRENGTHS</span>
              <h3>已经做得好的</h3>
              <ul>{data.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </Card>
          <Card className="zx-insight-card is-focus">
            <span className="zx-insight-icon"><Target size={17} /></span>
            <div>
              <span className="zx-eyebrow">NEXT FOCUS</span>
              <h3>最值得练的</h3>
              <ul>{data.gaps.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </Card>
        </div>
      </div>

      <div className="zx-analysis-bottom">
        <Card className="zx-heat-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">KNOWLEDGE HEATMAP</span>
              <h3>知识点掌握热力</h3>
            </div>
            <span className="zx-soft-label">越深越稳</span>
          </div>
          <Heatmap items={data.heatmap} />
        </Card>

        <Card className="zx-next-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">NEXT 3 STEPS</span>
              <h3>下一步，做这三件事</h3>
            </div>
            <ArrowUpRight size={18} />
          </div>
          <div className="zx-step-list">
            {data.nextSteps.map((step, index) => (
              <div className="zx-step" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
          <Button className="zx-full-btn" onClick={() => navigate(isParent ? '/family' : '/student/tutor')}>
            {isParent ? '回到家长周报' : '让小序陪我练'} <ArrowRight size={15} />
          </Button>
          <p className="zx-fine-print">不排名、不比较；分析结果用于调整学习路径。</p>
        </Card>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { ArrowUpRight, Filter, FolderOpen, ShieldCheck, Sparkles, Upload } from 'lucide-react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { toneHex, toneSoft } from '../../lib/tone'
import { useApi } from '../../lib/useApi'

export function ResourcesPage() {
  const { data, loading } = useApi(api.getResources)
  const toast = useToast()

  if (loading || !data) return <PageSkeleton />

  return (
    <div className="zx-page">
      <PageHeader
        eyebrow="RESOURCE CENTER · 课程与资源"
        title="好资源，先审后用。"
        description="每份资源都有“内容营养标签”：课标对齐、认知层级、智能参与度、审核人与版本。教师选得明白，学校管得住。"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => toast('已打开审核队列：2 份待审')}>
              <ShieldCheck size={15} /> 审核队列
            </Button>
            <Button size="sm" onClick={() => toast('资源上传会在接后端后开放')}>
              <Upload size={15} /> 上传资源
            </Button>
          </>
        }
      />

      <div className="zx-resource-toolbar">
        <div className="zx-resource-filters">
          <button className="is-active">全部</button>
          <button onClick={() => toast('筛选：数学')}>数学</button>
          <button onClick={() => toast('筛选：物理')}>物理</button>
          <button onClick={() => toast('筛选：化学')}>化学</button>
          <button onClick={() => toast('筛选：跨学科')}>跨学科</button>
        </div>
        <button className="zx-filter-btn" onClick={() => toast('高级筛选会在接后端后开放')}><Filter size={15} /> 筛选</button>
      </div>

      <div className="zx-resource-grid">
        {data.map((resource, index) => (
          <motion.article
            className="zx-resource-card"
            key={resource.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="zx-resource-top" style={{ background: toneSoft[resource.tone] }}>
              <span className="zx-resource-type" style={{ color: toneHex[resource.tone] }}>{resource.type}</span>
              <span className={`zx-resource-status ${resource.status === '待审核' ? 'is-pending' : ''}`}>{resource.status}</span>
              <span className="zx-resource-orbit" />
            </div>
            <div className="zx-resource-body">
              <span className="zx-resource-meta">{resource.subject} · {resource.grade}</span>
              <h3>{resource.title}</h3>
              <div className="zx-tag-row">
                {resource.tags.map((tag) => <span className="zx-tag" key={tag}>{tag}</span>)}
              </div>
              <div className="zx-resource-foot">
                <span>{resource.usage}</span>
                <button onClick={() => toast(`已打开：${resource.title}`)}><ArrowUpRight size={15} /></button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <Card className="zx-nutrition-card">
        <div className="zx-nutrition-icon"><Sparkles size={20} /></div>
        <div>
          <span className="zx-eyebrow">CONTENT NUTRITION LABEL</span>
          <h3>每个资源，都有一张“营养标签”</h3>
          <p>课标对齐 · 认知层级 · 证据基础 · 智能参与度 · 审核人 · 版本。教师可以按“智能参与度”“版权类型”筛选，学校可以追溯每一次修改。</p>
        </div>
        <button onClick={() => toast('内容营养标签说明会在接后端后开放')}>
          <FolderOpen size={16} /> 了解标签
        </button>
      </Card>
    </div>
  )
}

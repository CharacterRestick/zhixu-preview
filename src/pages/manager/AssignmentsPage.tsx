import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ClipboardCheck, FileCheck2, Sparkles } from 'lucide-react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { toneHex, toneSoft } from '../../lib/tone'
import { useApi } from '../../lib/useApi'

export function AssignmentsPage() {
  const { data, loading } = useApi(api.getAssignmentOverview)
  const toast = useToast()

  if (loading || !data) return <PageSkeleton />

  return (
    <div className="zx-page">
      <PageHeader
        eyebrow="ASSIGNMENTS · 作业与学情"
        title="智能预批，教师终审。"
        description="批改重复劳动交给 AI，评价权仍然在教师手里。先看共性错因，再决定讲什么。"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => toast('已筛选出 6 份需要重点复核的作业')}>
              <FileCheck2 size={15} /> 重点复核 6 份
            </Button>
            <Button size="sm" onClick={() => toast('批量终审已提交，教师签名已记录')}>
              <CheckCircle2 size={15} /> 批量终审
            </Button>
          </>
        }
      />

      <Card className="zx-batch-card">
        <div className="zx-card-head">
          <div>
            <span className="zx-eyebrow">BATCHES</span>
            <h3>作业批次</h3>
          </div>
          <span className="zx-soft-label">按班级 / 状态</span>
        </div>
        <div className="zx-batch-table">
          <div className="zx-batch-head">
            <span>作业</span><span>班级</span><span>提交</span><span>状态</span><span>操作</span>
          </div>
          {data.batches.map((batch, index) => (
            <motion.div
              className="zx-batch-row"
              key={batch.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.06 }}
            >
              <div><strong>{batch.title}</strong><small>智能预批 · 教师终审</small></div>
              <span>{batch.className}</span>
              <span>{batch.submitted} / {batch.total}</span>
              <span>
                <span className="zx-batch-status" style={{ background: toneSoft[batch.tone], color: toneHex[batch.tone] }}>{batch.status}</span>
              </span>
              <button onClick={() => toast(`已打开：${batch.title}`)}>查看 <ArrowRight size={13} /></button>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="zx-assign-grid">
        <Card className="zx-error-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">COMMON ERRORS</span>
              <h3>共性错因</h3>
            </div>
            <span className="zx-soft-label">建议讲评顺序</span>
          </div>
          <div className="zx-error-list">
            {data.errors.map((error, index) => (
              <div className="zx-error-row" key={error.title}>
                <span className="zx-error-index" style={{ background: toneSoft[error.tone], color: toneHex[error.tone] }}>{index + 1}</span>
                <div>
                  <strong>{error.title}</strong>
                  <p>{error.detail}</p>
                </div>
                <div className="zx-error-bar">
                  <span style={{ width: `${error.ratio}%`, background: toneHex[error.tone] }} />
                  <strong>{error.ratio}%</strong>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="zx-precheck-card">
          <div className="zx-precheck-icon"><Sparkles size={20} /></div>
          <span className="zx-eyebrow">SMART PRE-CHECK</span>
          <h3>预批不是“替教师打分”</h3>
          <p>{data.feedback}</p>
          <div className="zx-precheck-stats">
            <div><strong>42</strong><span>已预批</span></div>
            <div><strong>6</strong><span>待重点复核</span></div>
            <div><strong>0</strong><span>已自动发布</span></div>
          </div>
          <Button variant="secondary" onClick={() => toast('已打开 6 份待复核作业')}>
            <ClipboardCheck size={15} /> 打开待复核
          </Button>
        </Card>
      </div>
    </div>
  )
}

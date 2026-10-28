import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Clock3, Lightbulb, MessageSquareText, Play, Sparkles } from 'lucide-react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { toneHex, toneSoft } from '../../lib/tone'
import { useApi } from '../../lib/useApi'

export function TeachingPage() {
  const { data, loading } = useApi(api.getTeachingOverview)
  const toast = useToast()

  if (loading || !data) return <PageSkeleton />

  return (
    <div className="zx-page">
      <PageHeader
        eyebrow="TEACHING STUDIO · 备课与课堂"
        title="备课少花一点时间，课堂多留一点判断。"
        description="AI 根据班级学情生成初稿，教师逐段修改、终审。课堂互动只看共性问题，不做教师或学生监控。"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => toast('已保存为校本模板')}>保存为校本模板</Button>
            <Button size="sm" onClick={() => toast('课堂已开始，匿名投票已就绪')}>
              <Play size={15} /> 开始课堂
            </Button>
          </>
        }
      />

      <div className="zx-teaching-grid">
        <Card className="zx-lesson-card">
          <div className="zx-lesson-head">
            <div>
              <span className="zx-eyebrow">LESSON DRAFT · {data.lesson.grade}</span>
              <h2>{data.lesson.title}</h2>
              <p>{data.lesson.objective}</p>
            </div>
            <span className="zx-status-pill status-learning">{data.lesson.status}</span>
          </div>
          <div className="zx-lesson-blocks">
            {data.lesson.blocks.map((block, index) => (
              <motion.div
                className="zx-lesson-block"
                key={block.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.07 }}
              >
                <span className="zx-lesson-index" style={{ background: index === 0 ? toneSoft.teal : index === 1 ? toneSoft.amber : toneSoft.blue, color: index === 0 ? toneHex.teal : index === 1 ? toneHex.amber : toneHex.blue }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <strong>{block.label}</strong>
                  <p>{block.detail}</p>
                </div>
                <em><Clock3 size={12} /> {block.duration}</em>
              </motion.div>
            ))}
          </div>
          <div className="zx-lesson-foot">
            <div className="zx-lesson-ai"><Sparkles size={15} /> 系统已根据班级迷思调整“分层任务”的顺序。</div>
            <Button variant="secondary" size="sm" onClick={() => toast('教案已进入教师终审')}>
              进入终审 <ArrowRight size={15} />
            </Button>
          </div>
        </Card>

        <div className="zx-teaching-side">
          <Card className="zx-pulse-card">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">LIVE PULSE</span>
                <h3>课堂脉搏</h3>
              </div>
              <span className="zx-live-pill"><span /> 实时</span>
            </div>
            <div className="zx-pulse-list">
              {data.pulse.map((item) => (
                <div className="zx-pulse-row" key={item.label}>
                  <div><span>{item.label}</span><strong>{item.value}%</strong></div>
                  <span className="zx-progress-track"><span style={{ width: `${item.value}%`, background: toneHex[item.tone] }} /></span>
                </div>
              ))}
            </div>
            <p className="zx-fine-print">匿名投票，不显示学生姓名；教师只看到共性问题。</p>
          </Card>

          <Card className="zx-misconception-card">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">MISCONCEPTIONS</span>
                <h3>高频迷思</h3>
              </div>
              <Lightbulb size={18} />
            </div>
            <div className="zx-misconception-list">
              {data.misconceptions.map((item) => (
                <div className="zx-misconception" key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <span>{item.ratio}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="zx-summary-card">
        <div className="zx-summary-icon"><MessageSquareText size={20} /></div>
        <div>
          <span className="zx-eyebrow light">CLASS SUMMARY</span>
          <h3>今天这节课，值得留到明天的三句话</h3>
          <p>{data.summary}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => toast('课堂小结已推送到班级')}>
          <CheckCircle2 size={15} /> 推送给班级
        </Button>
      </Card>
    </div>
  )
}

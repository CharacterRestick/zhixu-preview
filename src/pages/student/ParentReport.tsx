import { motion } from 'framer-motion'
import { CalendarDays, HeartHandshake, Lock, MessageCircle, Sparkles, Sun } from 'lucide-react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { toneHex, toneSoft } from '../../lib/tone'
import { useApi } from '../../lib/useApi'

export function ParentReport() {
  const { data, loading } = useApi(api.getParentReport)
  const toast = useToast()

  if (loading || !data) return <PageSkeleton />

  return (
    <div className="zx-page zx-parent-page">
      <motion.header className="zx-parent-hero" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <span className="zx-eyebrow"><Sun size={13} /> 家长周报 · {data.week}</span>
          <h1>{data.child}的这一周，<br /><em>慢慢来，也在变好。</em></h1>
          <p>不排名，不比较。只告诉你：他这周真正学会了什么，哪里还需要一点帮助。</p>
        </div>
        <div className="zx-parent-hero-mark">
          <span><HeartHandshake size={22} /></span>
          <strong>看见成长</strong>
          <small>而不是只看见分数</small>
        </div>
      </motion.header>

      <div className="zx-parent-highlights">
        {data.highlights.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
          >
            <Card className="zx-parent-highlight" style={{ borderTopColor: toneHex[item.tone] }}>
              <span className="zx-highlight-dot" style={{ background: toneSoft[item.tone], color: toneHex[item.tone] }}>
                <Sparkles size={16} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="zx-parent-mid">
        <Card className="zx-parent-challenge">
          <span className="zx-eyebrow">ONE THING TO NOTICE</span>
          <h2>{data.challenge.title}</h2>
          <p>{data.challenge.detail}</p>
          <div className="zx-parent-challenge-note">
            <Lock size={14} />
            这不是“不认真”，是一个还没稳的知识点。
          </div>
        </Card>

        <Card className="zx-parent-activities">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">TOGETHER</span>
              <h3>下周可以一起做</h3>
            </div>
            <CalendarDays size={18} />
          </div>
          <div className="zx-activity-list">
            {data.activities.map((activity, index) => (
              <div className="zx-activity" key={activity.title}>
                <span>{index + 1}</span>
                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.detail}</p>
                </div>
                <em>{activity.duration}</em>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="zx-parent-quote">
        <span className="zx-quote-mark">“</span>
        <p>{data.quote}</p>
        <div>
          <span>本周最值得肯定的一件事</span>
          <button onClick={() => toast('给孩子的鼓励已记录')}>把这句话说给他听 <MessageCircle size={14} /></button>
        </div>
      </Card>

      <div className="zx-parent-bottom">
        <Card className="zx-contract-card">
          <span className="zx-eyebrow">USAGE AGREEMENT</span>
          <h3>使用契约，不是监控</h3>
          <p>家长可以设置使用时段、总时长与学习辅助范围；孩子也参与制定。周报看趋势，不看原始聊天。</p>
          <div className="zx-contract-chips">
            <span>工作日 40 分钟</span>
            <span>21:30 后不推送</span>
            <span>只给提示，不给答案</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => toast('契约编辑会在接后端后开放')}>调整契约</Button>
        </Card>
        <Card className="zx-privacy-card">
          <span className="zx-eyebrow">PRIVACY</span>
          <h3>孩子的隐私，也是成长的一部分。</h3>
          <p>家长看到的是聚合后的成长视图，而不是全部对话。孩子可以查看、更正、删除自己的数据。</p>
          <div className="zx-privacy-row"><Lock size={15} /> 默认不向第三方共享</div>
        </Card>
      </div>
    </div>
  )
}

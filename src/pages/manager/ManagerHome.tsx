import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Heatmap } from '../../components/Heatmap'
import { PageSkeleton } from '../../components/Skeleton'
import { Ring } from '../../components/Ring'
import { Sparkline } from '../../components/Sparkline'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/auth/AuthProvider'
import { toneHex, toneSoft } from '../../lib/tone'
import { useApi } from '../../lib/useApi'

export function ManagerHome() {
  const { data, loading } = useApi(api.getManagerDashboard)
  const { session } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const isManager = session?.role === 'manager'

  if (loading || !data) return <PageSkeleton />

  return (
    <div className="zx-page zx-manager-home">
      <motion.header className="zx-greeting" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <span className="zx-eyebrow"><CalendarDays size={13} /> 10 月 21 日 · 周三 · {data.profile.school}</span>
          <h1>早上好，{isManager ? '王校长' : '明老师'}。</h1>
          <p>{isManager ? '先看全局，再看需要你拍板的三件事。' : '本周先看三个真正要帮的学生，再看数据。'}</p>
        </div>
        <div className="zx-greeting-side">
          <span className="zx-role-pill"><Users size={14} /> {session?.detail ?? data.profile.role}</span>
          <span className="zx-muted-note">{isManager ? '管理者端 · 全部管理权限' : '教师端 · 教学工作台'}</span>
        </div>
      </motion.header>

      <div className="zx-stat-row">
        {data.stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`zx-stat-card tone-${stat.tone}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small style={{ color: toneHex[stat.tone] }}>{stat.delta}</small>
            <i style={{ background: toneSoft[stat.tone] }} />
          </motion.div>
        ))}
      </div>

      <div className="zx-manager-grid">
        <Card className="zx-intervention-card">
          <div className="zx-card-head">
            <div>
              <span className="zx-eyebrow">THIS WEEK · 3 ACTIONS</span>
              <h2>本周三个关键干预</h2>
              <p>不是所有学生都需要同一件事。先做这三件。</p>
            </div>
            <button className="zx-quiet-link" onClick={() => navigate('/manager/assignments')}>
              查看全部 <ChevronRight size={14} />
            </button>
          </div>
          <div className="zx-intervention-list">
            {data.interventions.map((item, index) => (
              <motion.div
                className="zx-intervention"
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
              >
                <span className="zx-avatar intervention" style={{ background: toneSoft[item.tone], color: toneHex[item.tone] }}>{item.initials}</span>
                <div className="zx-intervention-copy">
                  <div className="zx-intervention-title">
                    <strong>{item.student}</strong>
                    <span style={{ color: toneHex[item.tone] }}>{item.reason}</span>
                  </div>
                  <p>{item.evidence}</p>
                </div>
                <button className="zx-action-chip" onClick={() => toast(`已为 ${item.student} 生成：${item.action}`)}>
                  {item.action} <ArrowUpRight size={13} />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="zx-intervention-foot">
            <Sparkles size={15} />
            每条建议都附证据；教师可以采纳、改写或忽略。
          </div>
          <div className="zx-intervention-insight">
            <span><Target size={15} /></span>
            <p><strong>本周建议</strong> 先用一次同课异构处理「图像平移」，不要分班加练。3 个班的错因相同，值得一起讲。</p>
          </div>
        </Card>

        <div className="zx-manager-side">
          <Card className="zx-hours-snapshot">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">CLASS HOURS</span>
                <h3>课时进度</h3>
              </div>
              <button className="zx-quiet-link" onClick={() => navigate('/manager/hours')}>详情 <ChevronRight size={13} /></button>
            </div>
            <div className="zx-hours-snapshot-body">
              <Ring value={92} size={108} stroke={8} tone="amber" label="92%" detail="整体完成" />
              <div className="zx-hours-bars">
                {data.hours.slice(0, 3).map((hour) => (
                  <div className="zx-mini-bar" key={hour.label}>
                    <div><span>{hour.label}</span><strong>{hour.value}%</strong></div>
                    <span className="zx-progress-track"><span style={{ width: `${hour.value}%`, background: toneHex[hour.tone] }} /></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="zx-hours-alert"><Clock3 size={14} /> 化学组缺口 14 课时，建议先核对实验课安排。</div>
          </Card>

          <Card className="zx-todo-card">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">TO DO</span>
                <h3>今天要处理</h3>
              </div>
              <Target size={18} />
            </div>
            <div className="zx-todo-list">
              {data.todos.map((todo) => (
                <button key={todo.title} onClick={() => toast(`已打开：${todo.title}`)}>
                  <span className="zx-todo-check" />
                  <div>
                    <strong>{todo.title}</strong>
                    <small>{todo.detail}</small>
                  </div>
                  <em>{todo.tag}</em>
                </button>
              ))}
            </div>
            <div className="zx-todo-done"><CheckCircle2 size={14} /> 已处理 3 项</div>
          </Card>
        </div>
      </div>

      <div className="zx-manager-bottom">
        <Card className="zx-heatmap-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">CLASS HEATMAP</span>
              <h3>班级认知热力图</h3>
            </div>
            <span className="zx-soft-label">不排名 · 看结构</span>
          </div>
          <Heatmap items={data.heatmap} compact />
          <p className="zx-fine-print">越深表示掌握越稳；点击任一知识点，可查看对应学生与证据。</p>
        </Card>

        <Card className="zx-trends-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">SUBJECT TRENDS</span>
              <h3>学科趋势</h3>
            </div>
            <button className="zx-quiet-link" onClick={() => navigate('/manager/analysis')}>学科分析 <ChevronRight size={13} /></button>
          </div>
          <div className="zx-trend-list">
            {data.subjectTrends.map((trend) => (
              <div className="zx-trend-row" key={trend.label}>
                <div>
                  <strong>{trend.label}</strong>
                  <span style={{ color: toneHex[trend.tone] }}>+{trend.values[trend.values.length - 1] - trend.values[0]}%</span>
                </div>
                <Sparkline values={trend.values} tone={trend.tone} height={52} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="zx-quick-links">
        <button onClick={() => navigate('/manager/schedule')}><span>排课与课时</span><ArrowRight size={15} /></button>
        <button onClick={() => navigate('/manager/teaching')}><span>备课与课堂</span><ArrowRight size={15} /></button>
        <button onClick={() => navigate('/manager/assignments')}><span>作业与学情</span><ArrowRight size={15} /></button>
        <button onClick={() => navigate('/manager/analysis')}><span>学科分析</span><ArrowRight size={15} /></button>
        <button onClick={() => navigate('/manager/hours')}><span>课时统计</span><ArrowRight size={15} /></button>
        {isManager && <button onClick={() => navigate('/manager/teachers')}><span>教师管理</span><ArrowRight size={15} /></button>}
      </div>
    </div>
  )
}

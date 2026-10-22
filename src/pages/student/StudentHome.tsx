import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageSkeleton } from '../../components/Skeleton'
import { Ring } from '../../components/Ring'
import { Sparkline } from '../../components/Sparkline'
import { api } from '../../lib/api'
import { toneHex, toneSoft } from '../../lib/tone'
import { useApi } from '../../lib/useApi'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

export function StudentHome() {
  const { data, loading } = useApi(api.getStudentDashboard)
  const navigate = useNavigate()

  if (loading || !data) return <PageSkeleton />

  const shortName = data.profile.name.slice(1)
  const doneCount = data.today.tasks.filter((task) => task.done).length

  return (
    <motion.div className="zx-page zx-student-home" variants={stagger} initial="hidden" animate="show">
      <motion.header className="zx-greeting" variants={item}>
        <div>
          <span className="zx-eyebrow"><CalendarDays size={13} /> 10 月 21 日 · 周三</span>
          <h1>晚上好，{shortName}。</h1>
          <p>今天不用做很多，先把「图像平移」拿下。</p>
        </div>
        <div className="zx-greeting-side">
          <span className="zx-streak-pill"><Flame size={15} /> 连续学习 {data.profile.streak} 天</span>
          <span className="zx-muted-note">不是打卡，是 {data.profile.streak} 次真的坐下来学</span>
        </div>
      </motion.header>

      <div className="zx-dash-grid">
        <motion.div variants={item}>
          <Card className="zx-today-card">
            <div className="zx-today-top">
              <div>
                <span className="zx-eyebrow light">TODAY · 25 MIN</span>
                <h2>{data.today.focus}</h2>
                <p>今天只做三件事。做完，就可以安心收工。</p>
              </div>
              <Ring value={data.today.progress} size={124} stroke={9} tone="teal" light label={`${data.today.progress}%`} detail="今日进度" track="rgba(255,255,255,.12)" />
            </div>

            <div className="zx-task-list">
              {data.today.tasks.map((task) => (
                <button
                  key={task.id}
                  className={`zx-task ${task.done ? 'is-done' : ''}`}
                  onClick={() => navigate(task.done ? '/student/map' : '/student/tutor')}
                >
                  <span className="zx-task-check" style={{ borderColor: toneHex[task.tone], background: task.done ? toneHex[task.tone] : 'transparent' }}>
                    {task.done && <Check size={13} />}
                  </span>
                  <span className="zx-task-copy">
                    <strong>{task.title}</strong>
                    <small>{task.subject} · {task.type}</small>
                  </span>
                  <span className="zx-task-time"><Clock3 size={13} /> {task.duration}</span>
                  <ChevronRight size={16} className="zx-task-arrow" />
                </button>
              ))}
            </div>

            <div className="zx-today-foot">
              <span><Sparkles size={14} /> 小序会在你卡住时出现，不直接给答案。</span>
              <Button variant="secondary" size="sm" onClick={() => navigate('/student/tutor')}>
                开始 25 分钟 <ArrowRight size={15} />
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div className="zx-stack" variants={item}>
          <Card className="zx-companion-card">
            <div className="zx-companion-head">
              <span className="zx-spark-badge"><Sparkles size={16} /></span>
              <div>
                <strong>小序说</strong>
                <span>今天的一句话</span>
              </div>
            </div>
            <p>“{data.today.quote}”</p>
            <div className="zx-companion-suggest">{data.suggestion}</div>
            <Link to="/student/tutor" className="zx-text-link">
              去和它聊聊 <ArrowUpRight size={14} />
            </Link>
          </Card>

          <Card className="zx-rhythm-card">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">THIS WEEK</span>
                <h3>本周节奏</h3>
              </div>
              <span className="zx-delta is-up">+18%</span>
            </div>
            <Sparkline values={data.week} tone="teal" height={68} />
            <div className="zx-rhythm-foot">
              <span>周一</span>
              <span>今天</span>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="zx-section-grid three">
        <motion.div variants={item}>
          <Card className="zx-subject-card">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">SUBJECTS</span>
                <h3>学科状态</h3>
              </div>
              <Link to="/student/analysis" className="zx-quiet-link">看学科分析 <ChevronRight size={14} /></Link>
            </div>
            <div className="zx-subject-list">
              {data.subjects.map((subject) => (
                <button key={subject.name} className="zx-subject-row" onClick={() => navigate('/student/analysis')}>
                  <span className="zx-subject-dot" style={{ background: toneHex[subject.tone], boxShadow: `0 0 0 5px ${toneSoft[subject.tone]}` }} />
                  <span className="zx-subject-main">
                    <span className="zx-subject-line">
                      <strong>{subject.name}</strong>
                      <span>{subject.mastery}%</span>
                    </span>
                    <span className="zx-progress-track"><span style={{ width: `${subject.mastery}%`, background: toneHex[subject.tone] }} /></span>
                    <small>待加强：{subject.weakPoint}</small>
                  </span>
                  <span className={`zx-delta ${subject.delta >= 0 ? 'is-up' : 'is-down'}`}>{subject.delta >= 0 ? '+' : ''}{subject.delta}%</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="zx-project-card">
            <div className="zx-project-art">
              <span className="zx-project-orbit" />
              <span className="zx-project-orbit second" />
              <Trophy size={22} />
              <span className="zx-project-status">进行中</span>
            </div>
            <div className="zx-project-body">
              <span className="zx-eyebrow">PROJECT · 真实任务</span>
              <h3>{data.project.title}</h3>
              <p>{data.project.summary}</p>
              <div className="zx-tag-row">
                {data.project.tags.map((tag) => <span className="zx-tag" key={tag}>{tag}</span>)}
              </div>
              <div className="zx-project-progress">
                <span><span style={{ width: `${data.project.progress}%` }} /></span>
                <strong>{data.project.progress}%</strong>
              </div>
              <Link to="/student/growth" className="zx-text-link">继续项目 <ArrowRight size={14} /></Link>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="zx-moments-card">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">MOMENTS</span>
                <h3>成长瞬间</h3>
              </div>
              <Link to="/student/growth" className="zx-quiet-link">全部 <ChevronRight size={14} /></Link>
            </div>
            <div className="zx-moment-list">
              {data.moments.map((moment, index) => (
                <div className="zx-moment" key={moment.label}>
                  <span className="zx-moment-dot" style={{ background: index === 0 ? '#0f766e' : index === 1 ? '#d97706' : '#4d7ea8' }} />
                  <div>
                    <strong>{moment.label}</strong>
                    <p>{moment.detail}</p>
                  </div>
                  <span>{moment.time}</span>
                </div>
              ))}
            </div>
            <div className="zx-moment-quote">
              <Target size={15} />
              本周目标：把「图像平移」的掌握度从 54% 提到 70%。
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Headphones,
  Play,
  Pause,
  Sparkles,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { CourseCard } from '../../components/CourseCard'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/auth/AuthProvider'
import { formatCompact, formatPercent } from '../../lib/format'
import { useApi } from '../../lib/useApi'

export function CourseLearningPage() {
  const { session } = useAuth()
  const role = session?.role ?? 'student'
  const { data, loading } = useApi(() => api.getCourseCatalog(role), [role])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [category, setCategory] = useState('全部')
  const [playing, setPlaying] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const active = useMemo(() => {
    if (!data) return null
    return data.courses.find((course) => course.id === selectedId) ?? data.featured
  }, [data, selectedId])

  const filtered = useMemo(() => {
    if (!data) return []
    return category === '全部' ? data.courses : data.courses.filter((course) => course.category === category)
  }, [data, category])

  if (loading || !data || !active) return <PageSkeleton />

  const isParent = role === 'parent'
  const isStaff = role === 'teacher' || role === 'manager'

  return (
    <div className="zx-page zx-course-page">
      <PageHeader
        eyebrow={`AI COURSE · ${isParent ? '家长学习' : isStaff ? '教师成长' : '学生成长'}`}
        title={isStaff ? '先学一遍，再决定课堂怎么用。' : '把不会，变成一段可以反复看的学习。'}
        description={isStaff ? '管理者和教师也会是学习者。先看课程怎么讲，再决定把它放进备课、布置给学生，还是推荐给家长。' : '课程不是把课堂录一遍。每节课都有 AI 摘要、学习目标和一段可以马上用起来的小练习。'}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => toast('学习记录会保存在你的账号里')}>
              <Headphones size={15} /> 学习记录
            </Button>
            <Button size="sm" onClick={() => toast('AI 会根据你的学习记录推荐下一节')}>
              <Sparkles size={15} /> 让 AI 推荐
            </Button>
          </>
        }
      />

      <div className="zx-course-top">
        <motion.div
          className={`zx-course-stage tone-${active.tone}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="zx-course-stage-ambient" aria-hidden="true" />
          <div className="zx-stage-topline">
            <span className="zx-course-stage-tag"><span className="zx-live-dot" /> AI COURSE · {active.category}</span>
            <span className="zx-course-stage-meta"><Clock3 size={13} /> {active.duration} · {active.lessons} 节</span>
          </div>

          <div className="zx-stage-copy">
            <span className="zx-eyebrow light">FEATURED LESSON</span>
            <h2>{active.title}</h2>
            <p>{active.subtitle}</p>
            <div className="zx-stage-tags">
              <span>{active.level}</span>
              <span>{active.audience.map((item) => ({ student: '学生', parent: '家长', teacher: '教师', manager: '管理者' }[item])).join(' · ')}</span>
              <span>{active.videoLabel}</span>
            </div>
          </div>

          <div className="zx-stage-player">
            <button className="zx-stage-play" onClick={() => { setPlaying((value) => !value); toast('示例播放器：接入视频服务后可播放真实课程') }} aria-label={playing ? '暂停' : '播放'}>
              {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
            </button>
            <div className="zx-stage-wave" aria-hidden="true">
              {[18, 34, 24, 46, 30, 52, 28, 38, 22, 44, 26, 36].map((height, index) => (
                <span key={index} style={{ height: `${height}%`, animationDelay: `${index * 0.08}s` }} />
              ))}
            </div>
            <div className="zx-stage-progress">
              <span style={{ width: playing ? '38%' : '18%' }} />
            </div>
            <div className="zx-stage-times">
              <span>{playing ? '06:42' : '03:12'}</span>
              <span>{active.duration}</span>
            </div>
          </div>

          <div className="zx-stage-foot">
            <span><Users size={14} /> {formatCompact(active.views)} 人学习过</span>
            <span><Check size={14} /> 完成率 {formatPercent(active.completion)}</span>
            {active.progress > 0 && <span className="zx-stage-progress-note">你的进度 {active.progress}%</span>}
          </div>
        </motion.div>

        <aside className="zx-course-aside">
          <div className="zx-course-aside-head">
            <span className="zx-eyebrow">AI SUMMARY</span>
            <span className="zx-ai-badge"><Sparkles size={12} /> 已生成</span>
          </div>
          <h3>这节课，记住一句话</h3>
          <blockquote>{active.aiSummary}</blockquote>
          <div className="zx-course-objectives">
            <span className="zx-eyebrow">学完能做到</span>
            {active.objectives.map((objective) => (
              <div key={objective}><Check size={14} /> <span>{objective}</span></div>
            ))}
          </div>
          <div className="zx-course-outline">
            <span className="zx-eyebrow">课程目录 · {active.lessons} 节</span>
            {['先看清自己卡在哪', '把问题改写得更具体', '用反例检验理解', '让 AI 只给提示', '回到真实任务'].slice(0, active.lessons).map((lesson, index) => (
              <div key={lesson}>
                <em>{String(index + 1).padStart(2, '0')}</em>
                <span>{lesson}</span>
                <small>{index === 0 ? '已看' : index === 1 ? '正在看' : `${8 + index}′`}</small>
              </div>
            ))}
          </div>
          <div className="zx-course-aside-foot">
            <div>
              <span>授课</span>
              <strong>{active.instructor}</strong>
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (isParent) navigate('/family')
                else if (isStaff) navigate(role === 'manager' ? '/manager/courses' : '/manager/teaching')
                else navigate('/student/tutor')
              }}
            >
              {isParent ? '回到周报' : isStaff ? (role === 'manager' ? '去课程管理' : '去备课') : '问小序'} <ArrowRight size={14} />
            </Button>
          </div>
        </aside>
      </div>

      <div className="zx-course-library-head">
        <div>
          <span className="zx-eyebrow">LEARNING LIBRARY</span>
          <h2>为你整理的 AI 课程</h2>
        </div>
        <span className="zx-muted-note">{data.courses.length} 节 · 按你的身份推荐</span>
      </div>

      <div className="zx-course-filters">
        {['全部', ...data.categories].map((item) => (
          <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="zx-course-grid">
        {filtered.map((course, index) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <CourseCard
              course={course}
              selected={active.id === course.id}
              onSelect={() => { setSelectedId(course.id); setPlaying(false) }}
            />
          </motion.div>
        ))}
      </div>

      <div className="zx-course-note">
        <BookOpen size={18} />
        <div>
          <strong>课程视频由管理者发布，教师可参与审核。</strong>
          <p>真实版本会接入视频转写、AI 摘要、学习进度和班级完成率；当前为演示数据。</p>
        </div>
      </div>
    </div>
  )
}

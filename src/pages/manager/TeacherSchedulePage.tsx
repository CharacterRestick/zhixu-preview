import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  Download,
  ListChecks,
  MapPin,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/auth/AuthProvider'
import { useApi } from '../../lib/useApi'

const statusTone = ['teal', 'blue', 'amber', 'coral', 'violet'] as const

export function TeacherSchedulePage() {
  const { data, loading } = useApi(api.getTeacherSchedule)
  const { session } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const isManager = session?.role === 'manager'

  if (loading || !data) return <PageSkeleton />

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const summaryActions = [
    () => scrollTo('class-roster'),
    () => scrollTo('weekly-schedule'),
    () => navigate('/manager/hours'),
    () => navigate('/manager/hours'),
  ]

  return (
    <div className="zx-page zx-schedule-page">
      <PageHeader
        eyebrow={isManager ? 'TEACHING VIEW · 管理者' : 'TEACHING CALENDAR · 教师工作台'}
        title={isManager ? '排课、学生、课时，集中查看。' : '这一周，先看课，再看人。'}
        description={isManager ? '查看教师课表、班级人数与课时余额；调课与缺口会同步到课时统计。' : '你的课表、学生人数、剩余课时都在这里。少翻几个表，把时间留给课堂。'}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => toast('课表导出会在接入教务系统后开放')}>
              <Download size={15} /> 导出课表
            </Button>
            <Button size="sm" onClick={() => navigate('/manager/hours')}>
              <CalendarDays size={15} /> 调整排课
            </Button>
          </>
        }
      />

      <div className="zx-schedule-summary">
        {data.summary.map((item, index) => (
          <motion.button
            key={item.label}
            className={`zx-metric-card tone-${item.tone}`}
            onClick={summaryActions[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
            <em>查看 <ArrowUpRight size={12} /></em>
          </motion.button>
        ))}
      </div>

      <div className="zx-schedule-layout">
        <section className="zx-card zx-calendar-card" id="weekly-schedule">
          <div className="zx-card-head">
            <div>
              <span className="zx-eyebrow">WEEKLY SCHEDULE</span>
              <h2>本周排课</h2>
              <p>{isManager ? '按教师与班级查看本周课堂安排。' : '今天有 4 节安排，周三第 5 节有调课。'}</p>
            </div>
            <div className="zx-calendar-legend">
              <span><i className="is-class" /> 上课</span>
              <span><i className="is-other" /> 教研 / 项目</span>
            </div>
          </div>

          <div className="zx-week-calendar">
            {data.week.map((day, index) => {
              const lessons = data.lessons.filter((lesson) => lesson.day === index)
              return (
                <div className={`zx-cal-day ${day.isToday ? 'is-today' : ''}`} key={day.label}>
                  <div className="zx-cal-dayhead">
                    <span>{day.label}</span>
                    <strong>{day.date}</strong>
                    {day.isToday && <em>今天</em>}
                  </div>
                  <div className="zx-cal-daybody">
                    {lessons.length === 0 && <div className="zx-cal-empty">无课</div>}
                    {lessons.map((lesson) => (
                      <button
                        className={`zx-cal-lesson tone-${lesson.tone}`}
                        key={lesson.id}
                        onClick={() => toast(`${lesson.title} · ${lesson.className} · ${lesson.room}`)}
                      >
                        <span className="zx-cal-time">{lesson.start}–{lesson.end}</span>
                        <strong>{lesson.title}</strong>
                        <small>{lesson.className}</small>
                        <em><MapPin size={10} /> {lesson.room}</em>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <aside className="zx-schedule-side">
          <div className="zx-card">
            <div className="zx-card-head">
              <div>
                <span className="zx-eyebrow">TO REVIEW</span>
                <h2>需要留意</h2>
              </div>
              <ListChecks size={18} className="zx-muted-icon" />
            </div>
            <div className="zx-schedule-notes">
              {data.notes.map((note) => (
                <button className="zx-schedule-note" key={note.title} onClick={() => navigate('/manager/hours')}>
                  <span className="zx-note-dot" />
                  <div>
                    <strong>{note.title}</strong>
                    <p>{note.detail}</p>
                    <small>{note.time}</small>
                  </div>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
            <button className="zx-block-link" onClick={() => navigate('/manager/hours')}>
              去课时统计处理 <ArrowRight size={14} />
            </button>
          </div>

          <div className="zx-card zx-schedule-tip">
            <span className="zx-eyebrow">WEEKLY FOCUS</span>
            <h3>先把 3 班的 16 节余额排进日历。</h3>
            <p>按当前进度，3 班到月底还剩 16 节；5 班剩 8 节，2 班剩 4 节。</p>
            <button className="zx-block-link" onClick={() => scrollTo('class-roster')}>
              查看班级余额 <ArrowRight size={14} />
            </button>
          </div>
        </aside>
      </div>

      <section className="zx-card zx-roster-card" id="class-roster">
        <div className="zx-card-head">
          <div>
            <span className="zx-eyebrow">CLASS OVERVIEW</span>
            <h2>班级学生与剩余课时</h2>
            <p>人数、进度和余额放在一起，避免只看课时不看班级。</p>
          </div>
          <button className="zx-block-link" onClick={() => navigate('/manager/assignments')}>
            查看学情 <ArrowRight size={14} />
          </button>
        </div>
        <div className="zx-class-roster">
          {data.classes.map((item, index) => (
            <motion.div
              className={`zx-class-row tone-${statusTone[index % statusTone.length]}`}
              key={item.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="zx-class-main">
                <span className="zx-class-icon"><Users size={16} /></span>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.subject} · {item.students} 名学生</span>
                </div>
              </div>
              <div className="zx-class-progress">
                <div><span>已完成 {item.done}</span><em>{item.done}/{item.planned} 节</em></div>
                <div className="zx-progress-track"><span style={{ width: `${(item.done / item.planned) * 100}%` }} /></div>
              </div>
              <div className="zx-class-balance">
                <span>剩余课时</span>
                <strong>{item.remaining}<small> 节</small></strong>
              </div>
              <button className="zx-row-link" onClick={() => navigate('/manager/assignments')}>
                查看班级 <ArrowUpRight size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="zx-schedule-foot">
        <BookOpen size={16} />
        <p>课表、学生人数和课时余额由教务与课时服务统一提供；调课、代课会同步更新本页。</p>
        <button className="zx-block-link" onClick={() => navigate('/manager/hours')}>
          打开课时统计 <Clock3 size={14} />
        </button>
      </div>
    </div>
  )
}

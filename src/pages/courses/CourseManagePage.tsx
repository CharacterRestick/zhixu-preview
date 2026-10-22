import { motion } from 'framer-motion'
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Eye,
  Plus,
  ShieldCheck,
  UploadCloud,
  Users,
  Video,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import type { AICourse, CourseDraft } from '../../lib/api/types'
import { useAuth } from '../../lib/auth/AuthProvider'
import { formatCompact, formatPercent } from '../../lib/format'
import { useApi } from '../../lib/useApi'

const audienceOptions: { role: CourseDraft['audience'][number]; label: string }[] = [
  { role: 'student', label: '学生' },
  { role: 'parent', label: '家长' },
  { role: 'teacher', label: '教师' },
  { role: 'manager', label: '管理者' },
]

const statusLabel: Record<AICourse['status'], string> = {
  published: '已发布',
  draft: '草稿',
  review: '待审核',
}

const emptyDraft: CourseDraft = {
  title: '',
  subtitle: '',
  category: '学习方法',
  audience: ['student'],
  duration: '15 分钟',
  level: '入门',
  description: '',
  videoLabel: '待上传视频',
}

export function CourseManagePage() {
  const { data, loading } = useApi(api.getCourseManagement)
  const { can } = useAuth()
  const toast = useToast()
  const canManage = can('manager.courses.manage')
  const [params] = useSearchParams()
  const [courses, setCourses] = useState<AICourse[]>([])
  const [open, setOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [draft, setDraft] = useState<CourseDraft>(emptyDraft)

  useEffect(() => {
    if (data) setCourses(canManage ? data.courses : data.courses.filter((course) => course.status === 'published'))
  }, [data, canManage])

  useEffect(() => {
    if (canManage && params.get('publish') === '1') setOpen(true)
  }, [canManage, params])

  const stats = useMemo(() => {
    const published = courses.filter((course) => course.status === 'published').length
    const drafts = courses.filter((course) => course.status !== 'published').length
    const views = courses.reduce((sum, course) => sum + course.views, 0)
    const publishedCourses = courses.filter((course) => course.status === 'published')
    const completion = Math.round(publishedCourses.reduce((sum, course) => sum + course.completion, 0) / Math.max(publishedCourses.length, 1))
    return [
      { label: '已发布', value: String(published), detail: '面向全校可见', tone: 'teal' },
      { label: '草稿 / 待审', value: String(drafts), detail: '发布前可继续修改', tone: 'amber' },
      { label: '累计学习', value: formatCompact(views), detail: '学生 / 家长 / 教师', tone: 'blue' },
      { label: '平均完成率', value: `${completion}%`, detail: '近 30 天', tone: 'violet' },
    ]
  }, [courses])

  if (loading || !data) return <PageSkeleton />

  const setField = <K extends keyof CourseDraft,>(key: K, value: CourseDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const toggleAudience = (role: CourseDraft['audience'][number]) => {
    setDraft((current) => ({
      ...current,
      audience: current.audience.includes(role)
        ? current.audience.filter((item) => item !== role)
        : [...current.audience, role],
    }))
  }

  const publish = async () => {
    if (!draft.title.trim()) {
      toast('先给课程起一个标题')
      return
    }
    if (draft.audience.length === 0) {
      toast('至少选择一个可见对象')
      return
    }
    setPublishing(true)
    try {
      const created = await api.createCourse(draft)
      setCourses((current) => [created, ...current])
      setOpen(false)
      setDraft(emptyDraft)
      toast('课程已发布，稍后可在课程详情里补充视频')
    } finally {
      setPublishing(false)
    }
  }

  const toggleStatus = async (course: AICourse) => {
    const updated = await api.toggleCourseStatus(course.id)
    setCourses((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    toast(updated.status === 'published' ? '课程已发布' : '课程已转为草稿')
  }

  return (
    <div className="zx-page zx-course-manage-page">
      <PageHeader
        eyebrow={canManage ? 'COURSE STUDIO · 管理者' : 'COURSE STUDIO · 教师只读'}
        title={canManage ? '发布一门课，让全校都能学。' : '先看课程，再决定课堂怎么用。'}
        description={canManage ? '管理课程视频、学习目标、可见范围与发布状态。发布后，学生、家长、教师会看到对应的课程。' : '教师可以查看课程内容与学情；发布、下架和可见范围由管理者统一管理。'}
        actions={
          canManage ? (
            <Button onClick={() => setOpen(true)}><Plus size={16} /> 发布 AI 课程</Button>
          ) : (
            <span className="zx-permission-chip"><ShieldCheck size={14} /> 教师只读</span>
          )
        }
      />

      <div className="zx-course-manage-stats">
        {stats.map((stat, index) => (
          <motion.div className={`zx-mini-stat tone-${stat.tone}`} key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.detail}</small>
          </motion.div>
        ))}
      </div>

      <div className="zx-course-manage-grid">
        <div className="zx-card zx-course-list-card">
          <div className="zx-card-head">
            <div>
              <span className="zx-eyebrow">ALL COURSES</span>
              <h2>课程列表</h2>
              <p>按状态、受众和最近更新排序。</p>
            </div>
            <span className="zx-muted-note">{courses.length} 门课程</span>
          </div>

          <div className="zx-course-table">
            {courses.map((course) => (
              <div className="zx-course-row" key={course.id}>
                <div className={`zx-course-thumb tone-${course.tone}`}>
                  <Video size={18} />
                </div>
                <div className="zx-course-row-main">
                  <div className="zx-course-row-title">
                    <strong>{course.title}</strong>
                    <span className={`zx-status-pill is-${course.status}`}>{statusLabel[course.status]}</span>
                  </div>
                  <p>{course.subtitle}</p>
                  <div className="zx-course-row-meta">
                    <span>{course.category}</span>
                    <span>{course.audience.map((role) => audienceOptions.find((item) => item.role === role)?.label).join(' · ')}</span>
                    <span><Clock3 size={12} /> {course.duration}</span>
                  </div>
                </div>
                <div className="zx-course-row-numbers">
                  <span><Eye size={13} /> {formatCompact(course.views)}</span>
                  <span><BarChart3 size={13} /> {formatPercent(course.completion)}</span>
                </div>
                <div className="zx-course-row-actions">
                  <button className="zx-quiet-link" onClick={() => toast('课程详情编辑会接入课程编辑器')}>查看</button>
                  {canManage && (
                    <button className="zx-quiet-link" onClick={() => void toggleStatus(course)}>
                      {course.status === 'published' ? '转为草稿' : '发布'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="zx-course-manage-aside">
          <div className="zx-card">
            <div className="zx-card-head">
              <div>
                <span className="zx-eyebrow">PUBLISH FLOW</span>
                <h2>发布前检查</h2>
              </div>
            </div>
            <div className="zx-check-list">
              <div><CheckCircle2 size={15} /><span>视频已上传，字幕已生成</span></div>
              <div><CheckCircle2 size={15} /><span>学习目标 3–5 条，可观察</span></div>
              <div><CheckCircle2 size={15} /><span>受众与可见范围已确认</span></div>
              <div><CheckCircle2 size={15} /><span>敏感内容与版权已复核</span></div>
            </div>
            <div className="zx-publish-note">
              <ShieldCheck size={15} />
              <p>发布、下架、修改可见范围都会写入审计日志；教师只读，不拥有发布权限。</p>
            </div>
          </div>

          <div className="zx-card zx-course-manage-mini">
            <span className="zx-eyebrow">AUDIENCE</span>
            <h3>谁能看到这门课？</h3>
            <div className="zx-audience-list">
              <div><Users size={15} /><span>学生</span><strong>{courses.filter((course) => course.audience.includes('student')).length}</strong></div>
              <div><Users size={15} /><span>家长</span><strong>{courses.filter((course) => course.audience.includes('parent')).length}</strong></div>
              <div><Users size={15} /><span>教师</span><strong>{courses.filter((course) => course.audience.includes('teacher')).length}</strong></div>
            </div>
          </div>
        </aside>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="发布 AI 课程"
        eyebrow="NEW COURSE"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={() => void publish()} disabled={publishing}>
              {publishing ? '发布中…' : '确认发布'}
            </Button>
          </>
        }
      >
        <div className="zx-form-grid">
          <label className="zx-field is-full">
            <span>课程标题</span>
            <input value={draft.title} onChange={(event) => setField('title', event.target.value)} placeholder="例如：用 AI 学会提问" />
          </label>
          <label className="zx-field is-full">
            <span>一句话说明</span>
            <input value={draft.subtitle} onChange={(event) => setField('subtitle', event.target.value)} placeholder="学生学完能获得什么？" />
          </label>
          <label className="zx-field">
            <span>分类</span>
            <select value={draft.category} onChange={(event) => setField('category', event.target.value)}>
              {['学习方法', '数学', '物理', '家庭教育', '教师发展', '项目学习'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="zx-field">
            <span>时长</span>
            <input value={draft.duration} onChange={(event) => setField('duration', event.target.value)} />
          </label>
          <div className="zx-field is-full">
            <span>可见对象</span>
            <div className="zx-check-pills">
              {audienceOptions.map((item) => (
                <button key={item.role} type="button" className={draft.audience.includes(item.role) ? 'is-active' : ''} onClick={() => toggleAudience(item.role)}>
                  {draft.audience.includes(item.role) && <CheckCircle2 size={13} />} {item.label}
                </button>
              ))}
            </div>
          </div>
          <label className="zx-field is-full">
            <span>课程简介</span>
            <textarea rows={3} value={draft.description} onChange={(event) => setField('description', event.target.value)} placeholder="这门课解决什么问题？适合谁？" />
          </label>
          <div className="zx-upload-box is-full">
            <UploadCloud size={22} />
            <div>
              <strong>上传课程视频</strong>
              <span>演示版不上传文件；接入对象存储后支持 MP4、HLS 和自动字幕。</span>
            </div>
            <Button variant="secondary" size="sm" onClick={() => toast('演示版：视频上传会在接后端后开放')}>选择文件</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

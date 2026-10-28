import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Download,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import type { TeacherDraft, TeacherRecord, TeacherStatus } from '../../lib/api/types'
import { useApi } from '../../lib/useApi'

const statusLabel: Record<TeacherStatus, string> = {
  active: '在岗',
  leave: '休假 / 暂停',
  pending: '待完善',
}

const emptyDraft: TeacherDraft = {
  name: '',
  employeeNo: '',
  subject: '数学',
  title: '教师',
  phone: '',
  email: '',
  classes: '',
  weeklyHours: 0,
  remainingHours: 0,
  status: 'active',
}

export function TeacherDirectoryPage() {
  const { data, loading } = useApi(api.getTeacherDirectory)
  const toast = useToast()
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState<TeacherRecord[]>([])
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('全部')
  const [status, setStatus] = useState('全部')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TeacherRecord | null>(null)
  const [draft, setDraft] = useState<TeacherDraft>(emptyDraft)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) setTeachers(data.teachers)
  }, [data])

  const subjects = useMemo(() => ['全部', ...Array.from(new Set(teachers.map((teacher) => teacher.subject)))], [teachers])

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return teachers.filter((teacher) => {
      const matchesQuery = !keyword || [teacher.name, teacher.employeeNo, teacher.subject, teacher.email, teacher.classes.join(' ')].join(' ').toLowerCase().includes(keyword)
      const matchesSubject = subject === '全部' || teacher.subject === subject
      const matchesStatus = status === '全部' || teacher.status === status
      return matchesQuery && matchesSubject && matchesStatus
    })
  }, [teachers, query, subject, status])

  const summary = useMemo(() => {
    const active = teachers.filter((teacher) => teacher.status === 'active').length
    const pending = teachers.filter((teacher) => teacher.status !== 'active').length
    const subjectCount = new Set(teachers.map((teacher) => teacher.subject)).size
    const weekly = teachers.reduce((sum, teacher) => sum + teacher.weeklyHours, 0)
    return [
      { label: '教师总数', value: String(teachers.length), detail: '当前在册', tone: 'teal', action: () => setStatus('全部') },
      { label: '在岗教师', value: String(active), detail: '承担教学任务', tone: 'blue', action: () => setStatus('active') },
      { label: '学科覆盖', value: String(subjectCount), detail: `${weekly} 节周课时`, tone: 'amber', action: () => setSubject('全部') },
      { label: '待完善', value: String(pending), detail: '资料或状态待确认', tone: 'coral', action: () => setStatus('pending') },
    ]
  }, [teachers])

  if (loading || !data) return <PageSkeleton />

  const openCreate = () => {
    setEditing(null)
    setDraft(emptyDraft)
    setOpen(true)
  }

  const openEdit = (teacher: TeacherRecord) => {
    setEditing(teacher)
    setDraft({
      name: teacher.name,
      employeeNo: teacher.employeeNo,
      subject: teacher.subject,
      title: teacher.title,
      phone: teacher.phone,
      email: teacher.email,
      classes: teacher.classes.join('、'),
      weeklyHours: teacher.weeklyHours,
      remainingHours: teacher.remainingHours,
      status: teacher.status,
    })
    setOpen(true)
  }

  const setField = <K extends keyof TeacherDraft,>(key: K, value: TeacherDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const save = async () => {
    if (!draft.name.trim() || !draft.employeeNo.trim()) {
      toast('请填写教师姓名和工号')
      return
    }
    setSaving(true)
    try {
      const saved = editing ? await api.updateTeacher(editing.id, draft) : await api.createTeacher(draft)
      setTeachers((current) => (editing ? current.map((teacher) => (teacher.id === saved.id ? saved : teacher)) : [saved, ...current]))
      setOpen(false)
      toast(editing ? '教师信息已更新' : '教师已加入名册')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (teacher: TeacherRecord) => {
    const updated = await api.toggleTeacherStatus(teacher.id)
    setTeachers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    toast(updated.status === 'active' ? `${updated.name} 已恢复在岗` : `${updated.name} 已转为休假 / 暂停`)
  }

  return (
    <div className="zx-page zx-teacher-directory-page">
      <PageHeader
        eyebrow="PEOPLE & PERMISSIONS · 管理者"
        title="教师信息，集中管理。"
        description="从基本资料、任课班级到周课时和剩余课时，统一维护。新增、编辑、状态调整都会留下记录。"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => toast('教师名册导出会在接入教务系统后开放')}>
              <Download size={15} /> 导出名册
            </Button>
            <Button size="sm" onClick={openCreate}><Plus size={15} /> 新增教师</Button>
          </>
        }
      />

      <div className="zx-teacher-summary">
        {summary.map((item, index) => (
          <motion.button
            className={`zx-metric-card tone-${item.tone}`}
            key={item.label}
            onClick={item.action}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
            <em>筛选查看 <ArrowUpRight size={12} /></em>
          </motion.button>
        ))}
      </div>

      <div className="zx-card zx-teacher-card">
        <div className="zx-card-head">
          <div>
            <span className="zx-eyebrow">FACULTY DIRECTORY</span>
            <h2>教师名册</h2>
            <p>共 {teachers.length} 位教师，当前显示 {filtered.length} 位。</p>
          </div>
          <div className="zx-teacher-filters">
            <label className="zx-search-box">
              <Search size={15} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索姓名、工号、班级" />
            </label>
            <select value={subject} onChange={(event) => setSubject(event.target.value)}>
              {subjects.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>

        <div className="zx-filter-chips">
          {[
            ['全部', '全部教师'],
            ['active', '在岗'],
            ['pending', '待完善'],
            ['leave', '休假 / 暂停'],
          ].map(([value, label]) => (
            <button key={value} className={status === value ? 'is-active' : ''} onClick={() => setStatus(value)}>
              {label}
            </button>
          ))}
        </div>

        <div className="zx-teacher-table">
          <div className="zx-teacher-row is-head">
            <span>教师</span>
            <span>任课与班级</span>
            <span>联系方式</span>
            <span>周课时</span>
            <span>剩余</span>
            <span>状态</span>
            <span>操作</span>
          </div>
          {filtered.map((teacher) => (
            <div className={`zx-teacher-row ${teacher.status === 'leave' ? 'is-paused' : ''}`} key={teacher.id}>
              <div className="zx-teacher-person">
                <span className={`zx-avatar tone-${teacher.tone}`}>{teacher.avatar}</span>
                <div>
                  <strong>{teacher.name}</strong>
                  <small>{teacher.employeeNo} · {teacher.title}</small>
                </div>
              </div>
              <div className="zx-teacher-classes">
                <span>{teacher.subject}</span>
                <small>{teacher.classes.join(' · ') || '暂未分配班级'}</small>
              </div>
              <div className="zx-teacher-contact">
                <span><Phone size={12} /> {teacher.phone || '未填写'}</span>
                <span><Mail size={12} /> {teacher.email || '未填写'}</span>
              </div>
              <div className="zx-teacher-hours"><strong>{teacher.weeklyHours}</strong><small>节 / 周</small></div>
              <div className="zx-teacher-hours"><strong>{teacher.remainingHours}</strong><small>节余额</small></div>
              <div><span className={`zx-status-pill is-${teacher.status}`}>{statusLabel[teacher.status]}</span><small className="zx-teacher-last">{teacher.lastActive}</small></div>
              <div className="zx-teacher-actions">
                <button className="zx-row-link" onClick={() => openEdit(teacher)}><Pencil size={13} /> 编辑</button>
                <button className="zx-row-link" onClick={() => navigate('/manager/schedule')}><CalendarDays size={13} /> 课表</button>
                <button className="zx-row-link" onClick={() => void toggleStatus(teacher)}>
                  {teacher.status === 'active' ? '暂停' : '恢复'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="zx-empty-state">
            <UsersRound size={26} />
            <strong>没有找到匹配的教师</strong>
            <p>试试清空搜索条件，或新增一位教师。</p>
            <Button size="sm" onClick={openCreate}><Plus size={14} /> 新增教师</Button>
          </div>
        )}
      </div>

      <div className="zx-directory-foot">
        <ShieldCheck size={16} />
        <p>教师信息仅管理者可见。修改工号、任课班级或状态会写入审计日志；教师本人只能看到自己的课表与课时。</p>
        <div>
          <button className="zx-block-link" onClick={() => toast('批量导入模板会在接入教务系统后开放')}><BookOpen size={14} /> 批量导入</button>
          <button className="zx-block-link" onClick={() => toast('成员权限配置会在接入统一身份服务后开放')}><UserRound size={14} /> 权限说明</button>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? '编辑教师信息' : '新增教师'}
        eyebrow={editing ? 'EDIT FACULTY' : 'NEW FACULTY'}
        wide
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={() => void save()} disabled={saving}>{saving ? '保存中…' : '保存信息'}</Button>
          </>
        }
      >
        <div className="zx-form-grid">
          <label className="zx-field">
            <span>姓名</span>
            <input value={draft.name} onChange={(event) => setField('name', event.target.value)} placeholder="教师姓名" />
          </label>
          <label className="zx-field">
            <span>工号</span>
            <input value={draft.employeeNo} onChange={(event) => setField('employeeNo', event.target.value)} placeholder="例如 T2026001" />
          </label>
          <label className="zx-field">
            <span>任教学科</span>
            <input value={draft.subject} onChange={(event) => setField('subject', event.target.value)} />
          </label>
          <label className="zx-field">
            <span>职称 / 岗位</span>
            <input value={draft.title} onChange={(event) => setField('title', event.target.value)} />
          </label>
          <label className="zx-field">
            <span>手机号</span>
            <input value={draft.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="用于校内通讯" />
          </label>
          <label className="zx-field">
            <span>邮箱</span>
            <input value={draft.email} onChange={(event) => setField('email', event.target.value)} />
          </label>
          <label className="zx-field is-full">
            <span>任课班级（用顿号或逗号分隔）</span>
            <input value={draft.classes} onChange={(event) => setField('classes', event.target.value)} placeholder="八年级 3 班、八年级 5 班" />
          </label>
          <label className="zx-field">
            <span>周课时</span>
            <input type="number" min="0" value={draft.weeklyHours} onChange={(event) => setField('weeklyHours', Number(event.target.value))} />
          </label>
          <label className="zx-field">
            <span>剩余课时</span>
            <input type="number" min="0" value={draft.remainingHours} onChange={(event) => setField('remainingHours', Number(event.target.value))} />
          </label>
          <label className="zx-field">
            <span>状态</span>
            <select value={draft.status} onChange={(event) => setField('status', event.target.value as TeacherStatus)}>
              <option value="active">在岗</option>
              <option value="pending">待完善</option>
              <option value="leave">休假 / 暂停</option>
            </select>
          </label>
          <div className="zx-form-note">
            <ShieldCheck size={14} />
            <span>保存后会同步到教师课表与课时统计。</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

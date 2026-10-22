import { ArrowUpRight, CheckCircle2, Clock3, Play } from 'lucide-react'
import type { AICourse } from '../lib/api/types'

const audienceLabel: Record<string, string> = {
  student: '学生',
  parent: '家长',
  teacher: '教师',
  manager: '管理者',
}

export function CourseCard({
  course,
  selected,
  onSelect,
  showProgress = true,
}: {
  course: AICourse
  selected?: boolean
  onSelect: () => void
  showProgress?: boolean
}) {
  return (
    <button
      className={`zx-course-card tone-${course.tone} ${selected ? 'is-selected' : ''}`}
      onClick={onSelect}
      type="button"
    >
      <span className="zx-course-cover">
        <span className="zx-course-cover-orbit" aria-hidden="true" />
        <span className="zx-course-play"><Play size={15} fill="currentColor" /></span>
        <span className="zx-course-duration"><Clock3 size={12} /> {course.duration}</span>
      </span>
      <span className="zx-course-card-body">
        <span className="zx-course-card-top">
          <em>{course.category}</em>
          {course.status === 'draft' ? <i className="is-draft">草稿</i> : <i>{course.level}</i>}
        </span>
        <strong>{course.title}</strong>
        <small>{course.subtitle}</small>
        <span className="zx-course-card-foot">
          <span>{course.audience.map((role) => audienceLabel[role]).join(' · ')}</span>
          <span className="zx-course-open">打开 <ArrowUpRight size={13} /></span>
        </span>
        {showProgress && course.progress > 0 && (
          <span className="zx-course-progress">
            <span style={{ width: `${course.progress}%` }} />
            <em>{course.progress}%</em>
          </span>
        )}
        {showProgress && course.progress === 100 && (
          <span className="zx-course-done"><CheckCircle2 size={12} /> 已完成</span>
        )}
      </span>
    </button>
  )
}

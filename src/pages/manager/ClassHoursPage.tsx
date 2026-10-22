import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, CalendarClock, Clock3, Download, FileSpreadsheet, Users } from 'lucide-react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { Ring } from '../../components/Ring'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import { toneHex, toneSoft } from '../../lib/tone'
import { useApi } from '../../lib/useApi'

export function ClassHoursPage() {
  const { data, loading } = useApi(api.getClassHours)
  const toast = useToast()

  if (loading || !data) return <PageSkeleton />

  return (
    <div className="zx-page">
      <PageHeader
        eyebrow="CLASS HOURS · 课时统计管理"
        title="排课、进度、缺口，一页看清。"
        description="按学科、年级、教师统计计划课时与实际课时；调课、代课自动留痕。用于排课与工作量管理，不单独作为教师排名依据。"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => toast('课时报表导出会在接后端后开放')}>
              <Download size={15} /> 导出报表
            </Button>
            <Button size="sm" onClick={() => toast('已打开课时调整面板')}>
              <CalendarClock size={15} /> 调整课时
            </Button>
          </>
        }
      />

      <div className="zx-hours-stats">
        {data.summary.map((item, index) => (
          <motion.div
            key={item.label}
            className={`zx-hours-stat tone-${item.tone}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
            <i style={{ background: toneSoft[item.tone] }} />
          </motion.div>
        ))}
      </div>

      <div className="zx-hours-grid">
        <Card className="zx-subject-hours-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">BY SUBJECT</span>
              <h3>学科课时进度</h3>
            </div>
            <span className="zx-soft-label">计划 vs 实际</span>
          </div>
          <div className="zx-subject-hours">
            {data.subjects.map((item, index) => (
              <div className="zx-subject-hour" key={item.name}>
                <div className="zx-subject-hour-head">
                  <strong>{item.name}</strong>
                  <span>{item.done} / {item.planned} 课时</span>
                  <em style={{ color: toneHex[item.tone] }}>{Math.round((item.done / item.planned) * 100)}%</em>
                </div>
                <div className="zx-hour-track">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.done / item.planned) * 100}%` }}
                    transition={{ delay: 0.15 + index * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: toneHex[item.tone] }}
                  />
                  <i style={{ left: `${(item.done / item.planned) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="zx-hours-legend"><span><i className="done" /> 已完成</span><span><i className="planned" /> 计划</span></div>
        </Card>

        <Card className="zx-hours-alert-card">
          <div className="zx-hours-alert-head">
            <span className="zx-alert-icon"><AlertTriangle size={19} /></span>
            <span className="zx-eyebrow light">GAP ALERT</span>
          </div>
          <h3>化学组缺口 14 课时</h3>
          <p>{data.alert}</p>
          <div className="zx-hours-ring-row">
            <Ring value={78} size={96} stroke={8} tone="amber" light label="78%" detail="化学完成" track="rgba(255,255,255,.12)" />
            <div>
              <strong>先核对实验课</strong>
              <span>再决定是否调整周课时</span>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => toast('已创建课时缺口处理任务')}>
            创建处理任务 <ArrowRight size={14} />
          </Button>
        </Card>
      </div>

      <div className="zx-hours-bottom">
        <Card className="zx-teacher-hours-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">BY TEACHER</span>
              <h3>教师课时明细</h3>
            </div>
            <span className="zx-soft-label"><Users size={13} /> 6 位教师</span>
          </div>
          <div className="zx-hours-table">
            <div className="zx-hours-table-head"><span>教师</span><span>学科</span><span>计划</span><span>实际</span><span>状态</span></div>
            {data.teachers.map((teacher, index) => (
              <motion.div
                className="zx-hours-table-row"
                key={teacher.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.04 }}
              >
                <strong>{teacher.name}</strong>
                <span>{teacher.subject}</span>
                <span>{teacher.planned}</span>
                <span>{teacher.done}</span>
                <span className={`zx-hours-status status-${teacher.status === '正常' ? 'ok' : teacher.status === '偏慢' ? 'warn' : 'danger'}`}>{teacher.status}</span>
              </motion.div>
            ))}
          </div>
          <p className="zx-fine-print">“计划”含国家课程与校本课程；“实际”含调课、代课，数据可追溯到课表。</p>
        </Card>

        <Card className="zx-change-card">
          <div className="zx-card-head compact">
            <div>
              <span className="zx-eyebrow">CHANGES</span>
              <h3>本周调课 / 代课</h3>
            </div>
            <Clock3 size={18} />
          </div>
          <div className="zx-change-list">
            {data.changes.map((change) => (
              <div className="zx-change-item" key={change.title}>
                <div>
                  <strong>{change.title}</strong>
                  <p>{change.detail}</p>
                </div>
                <span className={`zx-change-tag ${change.tag === '待确认' || change.tag === '待安排' ? 'is-warn' : ''}`}>{change.tag}</span>
              </div>
            ))}
          </div>
          <button className="zx-text-link" onClick={() => toast('课时调整记录会在接后端后开放')}>
            查看全部调整记录 <ArrowRight size={14} />
          </button>
        </Card>
      </div>

      <div className="zx-hours-export-note">
        <FileSpreadsheet size={16} />
        课时统计支持按区域、学校、学科、教师导出；口径统一，避免“同一个课时，四个部门四个算法”。
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Cloud,
  Download,
  Gauge,
  RefreshCw,
  Server,
  Sparkles,
  Users,
  Wallet,
  Wifi,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { PageHeader } from '../../components/PageHeader'
import { Ring } from '../../components/Ring'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import type { TrafficData } from '../../lib/api/types'
import { toneHex } from '../../lib/tone'
import { useApi } from '../../lib/useApi'

function TrafficChart({ data }: { data: TrafficData }) {
  const width = 680
  const height = 240
  const padX = 18
  const padY = 24
  const max = Math.max(...data.series.map((item) => item.requests), 1) * 1.12
  const point = (index: number, value: number) => {
    const x = padX + (index * (width - padX * 2)) / Math.max(data.series.length - 1, 1)
    const y = height - padY - (value / max) * (height - padY * 2)
    return `${x},${y}`
  }
  const line = data.series.map((item, index) => `${index === 0 ? 'M' : 'L'} ${point(index, item.requests)}`).join(' ')
  const aiLine = data.series.map((item, index) => `${index === 0 ? 'M' : 'L'} ${point(index, item.ai)}`).join(' ')
  const area = `${line} L ${width - padX},${height - padY} L ${padX},${height - padY} Z`

  return (
    <div className="zx-traffic-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="最近 7 天请求量趋势">
        <defs>
          <linearGradient id="traffic-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={toneHex.teal} stopOpacity="0.22" />
            <stop offset="100%" stopColor={toneHex.teal} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
          <line key={ratio} x1={padX} x2={width - padX} y1={height - padY - ratio * (height - padY * 2)} y2={height - padY - ratio * (height - padY * 2)} stroke="rgba(14,31,43,0.07)" strokeDasharray="4 6" />
        ))}
        <path d={area} fill="url(#traffic-fill)" />
        <path d={line} fill="none" stroke={toneHex.teal} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={aiLine} fill="none" stroke={toneHex.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5" />
        {data.series.map((item, index) => (
          <circle key={item.label} cx={point(index, item.requests).split(',')[0]} cy={point(index, item.requests).split(',')[1]} r="3.5" fill={toneHex.teal} stroke="#fbfaf6" strokeWidth="2" />
        ))}
      </svg>
      <div className="zx-traffic-chart-labels">
        {data.series.map((item) => <span key={item.label}>{item.label}</span>)}
      </div>
      <div className="zx-traffic-legend">
        <span><i style={{ background: toneHex.teal }} /> 请求量</span>
        <span><i style={{ background: toneHex.amber }} /> AI 调用</span>
        <em>单位：万次</em>
      </div>
    </div>
  )
}

const alertIcon = { info: CheckCircle2, warning: AlertTriangle, critical: AlertTriangle }

export function TrafficPage() {
  const { data, loading } = useApi(api.getTrafficOverview)
  const [range, setRange] = useState<'7' | '30'>('7')
  const toast = useToast()

  const totals = useMemo(() => {
    if (!data) return []
    return [
      { label: '总请求量', value: data.summary.requests, detail: data.summary.requestDelta, icon: Activity, tone: 'teal' as const },
      { label: '出口带宽', value: data.summary.bandwidth, detail: '本月累计', icon: Wifi, tone: 'blue' as const },
      { label: 'AI Token', value: data.summary.aiTokens, detail: '导师 + 课程摘要', icon: Sparkles, tone: 'amber' as const },
      { label: '活跃用户', value: data.summary.activeUsers, detail: '学生 / 家长 / 教师', icon: Users, tone: 'violet' as const },
    ]
  }, [data])

  if (loading || !data) return <PageSkeleton />

  return (
    <div className="zx-page zx-traffic-page">
      <PageHeader
        eyebrow="PLATFORM OPS · 管理者"
        title="流量、成本、延迟，一页看清。"
        description="监控页面、API、学习导师、视频与导出任务的用量。这里只做观测和预警，不展示学生个人内容。"
        actions={
          <>
            <div className="zx-range-toggle">
              <button className={range === '7' ? 'is-active' : ''} onClick={() => setRange('7')}>7 天</button>
              <button className={range === '30' ? 'is-active' : ''} onClick={() => setRange('30')}>30 天</button>
            </div>
            <Button variant="secondary" size="sm" onClick={() => toast('监控数据已刷新')}><RefreshCw size={14} /> 刷新</Button>
            <Button size="sm" onClick={() => toast('用量报告导出会在接后端后开放')}><Download size={14} /> 导出</Button>
          </>
        }
      />

      <div className="zx-traffic-summary">
        {totals.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div className={`zx-traffic-stat tone-${item.tone}`} key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <span className="zx-traffic-stat-icon"><Icon size={17} /></span>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.detail}</small>
            </motion.div>
          )
        })}
      </div>

      <div className="zx-traffic-top">
        <div className="zx-card zx-traffic-chart-card">
          <div className="zx-card-head">
            <div>
              <span className="zx-eyebrow">REQUEST VOLUME</span>
              <h2>请求量与 AI 调用</h2>
              <p>晚高峰 19:00–21:00 是主要压力来源。</p>
            </div>
            <span className="zx-muted-note">{range === '7' ? '最近 7 天' : '最近 30 天'}</span>
          </div>
          <TrafficChart data={data} />
        </div>

        <div className="zx-card zx-quota-card">
          <div className="zx-card-head">
            <div>
              <span className="zx-eyebrow">QUOTAS</span>
              <h2>本月配额</h2>
            </div>
            <Gauge size={18} className="zx-muted-icon" />
          </div>
          <div className="zx-quota-list">
            {data.quotas.map((quota) => (
              <div className="zx-quota-item" key={quota.label}>
                <Ring value={Math.round((quota.used / quota.total) * 100)} size={78} stroke={7} tone={quota.tone} label={`${Math.round((quota.used / quota.total) * 100)}%`} />
                <div>
                  <strong>{quota.label}</strong>
                  <span>{quota.used} / {quota.total} {quota.unit}</span>
                  <small>{quota.used > quota.total * 0.8 ? '接近上限，建议关注' : '在配额内'}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="zx-quota-cost">
            <Wallet size={16} />
            <span>本月预估成本</span>
            <strong>{data.summary.cost}</strong>
          </div>
        </div>
      </div>

      <div className="zx-traffic-bottom">
        <div className="zx-card zx-service-card">
          <div className="zx-card-head">
            <div>
              <span className="zx-eyebrow">SERVICE BREAKDOWN</span>
              <h2>服务用量明细</h2>
              <p>按请求量、带宽、延迟和错误率拆开看。</p>
            </div>
            <span className="zx-status-pill is-published"><span className="zx-live-dot" /> 实时</span>
          </div>
          <div className="zx-service-table">
            <div className="zx-service-row is-head">
              <span>服务</span><span>请求</span><span>带宽</span><span>延迟</span><span>错误率</span>
            </div>
            {data.services.map((service) => (
              <div className="zx-service-row" key={service.name}>
                <span className={`zx-service-name tone-${service.tone}`}><Server size={14} /> {service.name}</span>
                <span>{service.requests}</span>
                <span>{service.bandwidth}</span>
                <span>{service.latency}</span>
                <span className={Number.parseFloat(service.errorRate) > 0.5 ? 'is-warn' : ''}>{service.errorRate}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="zx-card zx-alert-card">
          <div className="zx-card-head">
            <div>
              <span className="zx-eyebrow">ALERTS</span>
              <h2>需要处理</h2>
            </div>
            <span className="zx-alert-count">{data.alerts.length}</span>
          </div>
          <div className="zx-alert-list">
            {data.alerts.map((alert) => {
              const Icon = alertIcon[alert.level]
              return (
                <div className={`zx-alert-item is-${alert.level}`} key={alert.title}>
                  <span className="zx-alert-icon"><Icon size={15} /></span>
                  <div>
                    <strong>{alert.title}</strong>
                    <p>{alert.detail}</p>
                    <small>{alert.time}</small>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="zx-traffic-foot">
            <span><Cloud size={14} /> 存储 {data.summary.storage}</span>
            <span><ArrowDownRight size={14} /> 错误率 {data.summary.errorRate}</span>
            <span><ArrowUpRight size={14} /> 请求 {data.summary.requestDelta}</span>
          </div>
        </div>
      </div>

      <div className="zx-traffic-note">
        <BarChart3 size={17} />
        <p>流量监控只统计聚合指标；不记录学生对话原文、不按学生个人做行为分析。真实版本由后端指标服务提供。</p>
      </div>
    </div>
  )
}

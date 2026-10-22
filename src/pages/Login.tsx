import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { useAuth } from '../lib/auth/AuthProvider'
import { DEMO_ROLES, homeForRole, ROLE_META } from '../lib/auth/permissions'
import type { Role } from '../lib/auth/types'

const roleIcons: Record<Role, typeof GraduationCap> = {
  student: GraduationCap,
  parent: HeartHandshake,
  teacher: BookOpen,
  manager: SlidersHorizontal,
}

const roleTone: Record<Role, string> = {
  student: 'teal',
  parent: 'amber',
  teacher: 'blue',
  manager: 'ink',
}

export function Login() {
  const { session, login, logout } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = params.get('next') ?? ''

  useEffect(() => {
    document.title = '登录 · 知序'
    return () => {
      document.title = '知序 · 让学习被看见'
    }
  }, [])

  const enter = (role: Role) => {
    login(role)
    const prefix = role === 'student' ? '/student' : role === 'parent' ? '/family' : '/manager'
    const target = next.startsWith(prefix) ? next : homeForRole(role)
    navigate(target)
  }

  return (
    <div className="zx-login-page">
      <div className="zx-login-ambient" aria-hidden="true" />
      <aside className="zx-login-aside">
        <Link to="/" aria-label="返回知序首页"><Brand light /></Link>
        <div className="zx-login-aside-copy">
          <span className="zx-eyebrow light">SECURE ENTRY · PREVIEW</span>
          <h1>先确认身份，<br />再开始学习。</h1>
          <p>真实版本使用同域 HttpOnly Cookie 会话，不把 token 放在浏览器 localStorage 里。当前预览用身份卡片模拟登录。</p>
          <div className="zx-login-assurance">
            <span><ShieldCheck size={15} /> 角色权限隔离</span>
            <span><KeyRound size={15} /> 服务端会话校验</span>
          </div>
        </div>
        <div className="zx-login-aside-foot">
          <span>知序 · 登录入口</span>
          <span>V1.2</span>
        </div>
      </aside>

      <main className="zx-login-main">
        <div className="zx-login-top">
          <Link to="/" className="zx-quiet-link">← 返回入口页</Link>
          {session && (
            <div className="zx-login-current">
              <span>当前身份：{session.name}</span>
              <button onClick={() => { logout(); navigate('/login') }}>退出</button>
            </div>
          )}
        </div>

        <div className="zx-login-heading">
          <span className="zx-eyebrow">CHOOSE A DEMO ROLE</span>
          <h2>你是哪一种使用者？</h2>
          <p>选择身份进入预览。每个角色看到的菜单、页面和数据范围不同；真实权限由后端再次校验。</p>
        </div>

        <div className="zx-login-grid">
          {DEMO_ROLES.map((item, index) => {
            const Icon = roleIcons[item.role]
            const meta = ROLE_META[item.role]
            return (
              <motion.button
                className={`zx-role-card tone-${roleTone[item.role]}`}
                key={item.role}
                onClick={() => enter(item.role)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.05, duration: 0.45 }}
              >
                <span className="zx-role-card-icon"><Icon size={20} /></span>
                <span className="zx-role-card-body">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                  <em>{meta.name} · {meta.detail}</em>
                </span>
                <ArrowRight size={17} className="zx-role-card-arrow" />
              </motion.button>
            )
          })}
        </div>

        <div className="zx-login-note">
          <ShieldCheck size={15} />
          <p>预览不会发送密码。真实登录：账号 + 密码 / 学校 SSO；家长使用邀请码绑定；所有权限在服务端按角色和组织校验。</p>
        </div>

        <Link to="/" className="zx-login-back">先看看产品介绍 <ArrowRight size={14} /></Link>
      </main>
    </div>
  )
}

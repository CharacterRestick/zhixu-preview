import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUp,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth/AuthProvider'
import type { Permission } from '../lib/auth/types'
import { Brand } from './Brand'
import { useToast } from './Toast'
import type { LucideIcon } from 'lucide-react'

export type NavSection = 'learn' | 'teach' | 'admin'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  permission?: Permission
  section?: NavSection
  badge?: string
}

const SECTION_META: { key: NavSection; label: string }[] = [
  { key: 'learn', label: '学习空间' },
  { key: 'teach', label: '教学工作台' },
  { key: 'admin', label: '平台管理' },
]

export function AppShell({ navItems, children }: { navItems: NavItem[]; children?: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const { session, logout, can } = useAuth()
  const [roleOpen, setRoleOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)

  const visibleNav = navItems.filter((item) => !item.permission || can(item.permission))
  const active = visibleNav.find((item) => (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)))
  const groups = SECTION_META.map((meta) => ({
    ...meta,
    items: visibleNav.filter((item) => (item.section ?? 'learn') === meta.key),
  })).filter((group) => group.items.length > 0)
  const primary = visibleNav.slice(0, 4)
  const hasMore = visibleNav.length > 4
  const activeInPrimary = primary.some((item) => item.to === active?.to)

  const profile = session ?? {
    name: '知序用户',
    detail: '登录身份',
    avatar: '知',
    roleLabel: '访客',
    school: '',
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(scrollTop > 8)
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0)
      setShowTop(scrollTop > 420)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const signOut = () => {
    setRoleOpen(false)
    setMoreOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) => `zx-nav-item ${isActive ? 'is-active' : ''}`}
        onClick={() => setMoreOpen(false)}
      >
        {({ isActive }) => (
          <>
            {isActive && <motion.span className="zx-nav-pill" layoutId="zx-nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <Icon size={18} strokeWidth={1.8} />
            <span>{item.label}</span>
            {item.badge && <em className="zx-nav-badge">{item.badge}</em>}
          </>
        )}
      </NavLink>
    )
  }

  return (
    <div className="zx-shell">
      <div className="zx-scroll-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <div className="zx-ambient" aria-hidden="true" />

      <aside className="zx-sidebar">
        <Link to="/" className="zx-sidebar-brand" aria-label="返回知序首页">
          <Brand light />
        </Link>

        <div className="zx-nav-scroll">
          {groups.map((group) => (
            <div className="zx-nav-group" key={group.key}>
              <div className="zx-side-label">{group.label}</div>
              <nav className="zx-nav">{group.items.map(renderNavItem)}</nav>
            </div>
          ))}
        </div>

        <div className="zx-side-footer">
          <div className="zx-side-role-card">
            <div className="zx-avatar small">{profile.avatar}</div>
            <div>
              <strong>{profile.name}</strong>
              <span>{profile.detail}</span>
            </div>
          </div>
          <button className="zx-side-exit" onClick={signOut}>
            <ArrowLeft size={15} />
            切换身份 / 退出
          </button>
        </div>
      </aside>

      <div className="zx-main">
        <header className={`zx-topbar ${scrolled ? 'is-scrolled' : ''}`}>
          <div className="zx-topbar-title">
            <span className="zx-topbar-kicker">{profile.roleLabel}</span>
            <strong>{active?.label ?? '知序'}</strong>
          </div>

          <div className="zx-topbar-actions">
            <button className="zx-search-pill" onClick={() => toast('搜索课程、学生、资源会在接入后端后开放')}>
              <Search size={16} />
              <span>搜索课程、学生、资源</span>
              <kbd>⌘ K</kbd>
            </button>
            <button className="zx-icon-btn" aria-label="通知" onClick={() => toast('3 条待处理提醒：2 份资源待审、1 个课时缺口')}>
              <Bell size={18} />
              <span className="zx-dot" />
            </button>
            <div className="zx-role-switch">
              <button className="zx-role-btn" onClick={() => setRoleOpen((open) => !open)}>
                <span className="zx-avatar small">{profile.avatar}</span>
                <span className="zx-role-btn-copy">
                  <strong>{profile.name}</strong>
                  <small>{profile.roleLabel}</small>
                </span>
                <ChevronDown size={15} className={roleOpen ? 'is-open' : ''} />
              </button>
              <AnimatePresence>
                {roleOpen && (
                  <motion.div
                    className="zx-role-menu"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="zx-role-menu-label">当前身份</div>
                    <div className="zx-role-menu-current">
                      <span className="zx-avatar small">{profile.avatar}</span>
                      <div>
                        <strong>{profile.name}</strong>
                        <small>{profile.roleLabel} · {profile.detail}</small>
                      </div>
                    </div>
                    <div className="zx-role-menu-sep" />
                    <button onClick={signOut}>
                      <LogOut size={16} />
                      <span>切换身份 / 退出登录</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="zx-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {children ?? <Outlet />}
            </motion.div>
          </AnimatePresence>
        </main>

        <nav className="zx-mobile-nav">
          {primary.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
          {hasMore && (
            <button className={!activeInPrimary ? 'is-active' : ''} onClick={() => setMoreOpen(true)}>
              <Menu size={19} />
              <span>更多</span>
            </button>
          )}
        </nav>

        <AnimatePresence>
          {moreOpen && (
            <>
              <motion.button
                className="zx-more-backdrop"
                aria-label="关闭菜单"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMoreOpen(false)}
              />
              <motion.div
                className="zx-more-sheet"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 18, opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <div className="zx-more-head">
                  <div>
                    <span className="zx-eyebrow">ALL PAGES</span>
                    <strong>更多页面</strong>
                  </div>
                  <button className="zx-icon-btn" onClick={() => setMoreOpen(false)} aria-label="关闭">
                    <X size={18} />
                  </button>
                </div>
                <div className="zx-more-grid">
                  {visibleNav.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink key={item.to} to={item.to} end={item.end} className="zx-more-link" onClick={() => setMoreOpen(false)}>
                        <Icon size={18} />
                        <span>{item.label}</span>
                        {item.badge && <em>{item.badge}</em>}
                      </NavLink>
                    )
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTop && (
            <motion.button
              className="zx-scroll-top"
              aria-label="回到顶部"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowUp size={17} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

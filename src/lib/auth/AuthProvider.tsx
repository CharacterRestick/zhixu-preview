import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { hasPermission, homeForRole, ROLE_META } from './permissions'
import type { Permission, Role, Session } from './types'

const STORAGE_KEY = 'zx-demo-session-v1'

type AuthValue = {
  session: Session | null
  login: (role: Role) => Session
  logout: () => void
  can: (permission: Permission) => boolean
}

const AuthContext = createContext<AuthValue | null>(null)

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed?.role || !(parsed.role in ROLE_META)) return null
    return { ...parsed, ...ROLE_META[parsed.role] }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession())

  const login = useCallback((role: Role) => {
    const nextSession: Session = { role, ...ROLE_META[role] }
    // 预览版使用 sessionStorage 模拟登录态。
    // 接后端时改为 POST /api/v1/auth/login（HttpOnly Cookie），
    // 再由 GET /api/v1/auth/session 恢复会话，见 docs/api-contract.md。
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
    return nextSession
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  const can = useCallback(
    (permission: Permission) => (session ? hasPermission(session.role, permission) : false),
    [session],
  )

  const value = useMemo(() => ({ session, login, logout, can }), [session, login, logout, can])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}

export function RequireAuth({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { session } = useAuth()
  const location = useLocation()

  if (!session) {
    const next = `${location.pathname}${location.search}`
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }

  if (!roles.includes(session.role)) {
    return <Navigate to={homeForRole(session.role)} replace />
  }

  return children
}

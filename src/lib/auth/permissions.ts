import type { Permission, Role, Session } from './types'

/**
 * 权限矩阵（只控制前端可见性）。
 * 最终权限必须由后端按 role + orgId + resourceId 再次校验。
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  student: [
    'student.home',
    'student.map',
    'student.tutor',
    'student.analysis',
    'student.growth',
    'student.courses',
  ],
  parent: ['family.report', 'family.analysis', 'family.courses'],
  teacher: [
    'manager.dashboard',
    'manager.teaching',
    'manager.assignments',
    'manager.analysis',
    'manager.hours',
    'manager.resources',
    'manager.courses.view',
  ],
  manager: [
    'manager.dashboard',
    'manager.teaching',
    'manager.assignments',
    'manager.analysis',
    'manager.hours',
    'manager.resources',
    'manager.courses.view',
    'manager.courses.manage',
    'manager.traffic',
  ],
}

export const MANAGER_ROLES: Role[] = ['teacher', 'manager']

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

export function homeForRole(role: Role): string {
  return role === 'student' ? '/student' : role === 'parent' ? '/family' : '/manager'
}

export const ROLE_META: Record<Role, Omit<Session, 'role'>> = {
  student: {
    name: '周予安',
    detail: '八年级 3 班',
    avatar: '安',
    roleLabel: '学生端',
    school: '云川实验中学',
  },
  parent: {
    name: '周予安家长',
    detail: '家长视图',
    avatar: '家',
    roleLabel: '家长端',
    school: '云川实验中学',
  },
  teacher: {
    name: '李明',
    detail: '数学教师 · 八年级 3 班',
    avatar: '李',
    roleLabel: '教师端',
    school: '云川实验中学',
  },
  manager: {
    name: '王砚',
    detail: '副校长 · 管理者',
    avatar: '王',
    roleLabel: '管理者端',
    school: '云川实验中学',
  },
}

export const DEMO_ROLES: { role: Role; title: string; description: string }[] = [
  { role: 'student', title: '学生', description: '学习地图、AI 导师、学科分析、AI 课程' },
  { role: 'parent', title: '家长', description: '成长周报、陪伴建议、AI 课程' },
  { role: 'teacher', title: '教师', description: '备课、课堂、作业、学情与课程学习' },
  { role: 'manager', title: '管理者', description: '全部管理权限、课程发布、流量监控' },
]

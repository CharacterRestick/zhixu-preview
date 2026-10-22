export type Role = 'student' | 'parent' | 'teacher' | 'manager'

export type Permission =
  | 'student.home'
  | 'student.map'
  | 'student.tutor'
  | 'student.analysis'
  | 'student.growth'
  | 'student.courses'
  | 'family.report'
  | 'family.analysis'
  | 'family.courses'
  | 'manager.dashboard'
  | 'manager.teaching'
  | 'manager.assignments'
  | 'manager.analysis'
  | 'manager.hours'
  | 'manager.resources'
  | 'manager.courses.view'
  | 'manager.courses.manage'
  | 'manager.traffic'

export interface Session {
  role: Role
  name: string
  detail: string
  avatar: string
  roleLabel: string
  school: string
}

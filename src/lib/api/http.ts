import type {
  AICourse,
  ChatMessage,
  CourseCatalogData,
  TeacherDraft,
  TeacherDirectoryData,
  TeacherRecord,
  TeacherScheduleData,
  TrafficData,
} from './types'
import type { Role, Session } from '../auth/types'

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  code: string
  requestId?: string

  constructor(status: number, code: string, message: string, requestId?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.requestId = requestId
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    let code = `HTTP_${response.status}`
    let message = response.statusText || '请求失败'
    let requestId: string | undefined
    try {
      const body = (await response.json()) as {
        code?: string
        message?: string
        requestId?: string
      }
      code = body.code ?? code
      message = body.message ?? message
      requestId = body.requestId
    } catch {
      // non-JSON error response
    }
    throw new ApiError(response.status, code, message, requestId)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const authHttp = {
  login: (payload: { account: string; password: string; roleHint?: string; schoolCode?: string }) =>
    request<{ user: Session; permissionCodes: string[]; expiresAt: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  session: () => request<{ user: Session; permissionCodes: string[] }>('/auth/session'),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
}

/**
 * 真实后端适配器。
 * 页面只依赖 src/lib/api/index.ts 暴露的 api 对象，切换 mock/http 不需要改页面。
 * 认证使用同域 HttpOnly Cookie，见 docs/api-contract.md。
 */
export const httpApi = {
  getStudentDashboard: () => request('/student/dashboard'),
  getLearningMap: () => request('/student/learning-map'),
  getTutorSession: () => request('/student/tutor/session'),
  sendTutorMessage: (text: string, hintLevel: number) =>
    request<ChatMessage>('/student/tutor/messages', {
      method: 'POST',
      body: JSON.stringify({ text, hintLevel }),
    }),
  getSubjectAnalysis: () => request('/student/subject-analysis'),
  getFamilySubjectAnalysis: () => request('/family/subject-analysis'),
  getGrowth: () => request('/student/growth'),
  getParentReport: () => request('/family/weekly-report'),
  getManagerDashboard: () => request('/manager/dashboard'),
  getTeachingOverview: () => request('/manager/teaching'),
  getAssignmentOverview: () => request('/manager/assignments'),
  getManagerSubjectAnalysis: () => request('/manager/subject-analysis'),
  getClassHours: () => request('/manager/class-hours'),
  getResources: () => request('/manager/resources'),
  getCourseCatalog: (role: Role) => request<CourseCatalogData>(`/courses?audience=${role}`),
  getCourseManagement: () => request<CourseCatalogData>('/manager/courses'),
  createCourse: (payload: unknown) =>
    request<AICourse>('/manager/courses', { method: 'POST', body: JSON.stringify(payload) }),
  toggleCourseStatus: (id: string) =>
    request<AICourse>(`/manager/courses/${id}/publish`, { method: 'PATCH' }),
  getTrafficOverview: () => request<TrafficData>('/manager/traffic'),
  getTeacherSchedule: () => request<TeacherScheduleData>('/manager/schedule'),
  getTeacherDirectory: () => request<TeacherDirectoryData>('/manager/teachers'),
  createTeacher: (payload: TeacherDraft) =>
    request<TeacherRecord>('/manager/teachers', { method: 'POST', body: JSON.stringify(payload) }),
  updateTeacher: (id: string, payload: TeacherDraft) =>
    request<TeacherRecord>(`/manager/teachers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  toggleTeacherStatus: (id: string) =>
    request<TeacherRecord>(`/manager/teachers/${id}/status`, { method: 'PATCH' }),
}

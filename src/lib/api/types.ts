import type { Role } from '../auth/types'

export type Tone = 'teal' | 'amber' | 'coral' | 'blue' | 'violet'

export interface StudentProfile {
  name: string
  grade: string
  className: string
  avatar: string
  streak: number
}

export interface Task {
  id: string
  title: string
  subject: string
  duration: string
  type: string
  done: boolean
  tone: Tone
}

export interface SubjectStat {
  name: string
  mastery: number
  delta: number
  tone: Tone
  weakPoint: string
}

export interface StudentDashboard {
  profile: StudentProfile
  today: {
    focus: string
    progress: number
    minutes: number
    tasks: Task[]
    quote: string
  }
  subjects: SubjectStat[]
  week: number[]
  suggestion: string
  project: {
    title: string
    summary: string
    progress: number
    tags: string[]
  }
  moments: { label: string; detail: string; time: string }[]
}

export interface LearningNode {
  id: string
  label: string
  x: number
  y: number
  status: 'mastered' | 'learning' | 'todo'
  mastery: number
  description: string
  prerequisite: string
  next: string
}

export interface LearningMapData {
  subject: string
  nodes: LearningNode[]
  edges: { from: string; to: string }[]
}

export interface ChatMessage {
  id: string
  role: 'ai' | 'user'
  text: string
  hintLevel?: number
  time: string
}

export interface TutorData {
  goal: string
  answerLocked: boolean
  messages: ChatMessage[]
  hints: { level: string; title: string; detail: string }[]
}

export interface AnalysisData {
  subject: string
  mastery: number
  delta: number
  radar: { label: string; value: number }[]
  strengths: string[]
  gaps: string[]
  nextSteps: string[]
  heatmap: { label: string; value: number }[]
  parentNote: string
}

export interface ProjectItem {
  id: string
  title: string
  summary: string
  tags: string[]
  progress: number
  tone: Tone
  updated: string
}

export interface Badge {
  id: string
  title: string
  detail: string
  tone: Tone
}

export interface GrowthData {
  projects: ProjectItem[]
  badges: Badge[]
  timeline: { title: string; detail: string; date: string }[]
}

export interface ParentReportData {
  child: string
  week: string
  highlights: { title: string; detail: string; tone: Tone }[]
  challenge: { title: string; detail: string }
  activities: { title: string; detail: string; duration: string }[]
  quote: string
}

export interface Intervention {
  id: string
  student: string
  initials: string
  reason: string
  evidence: string
  action: string
  tone: Tone
}

export interface ManagerDashboard {
  profile: { name: string; role: string; school: string; avatar: string }
  stats: { label: string; value: string; delta: string; tone: Tone }[]
  interventions: Intervention[]
  heatmap: { label: string; value: number }[]
  subjectTrends: { label: string; values: number[]; tone: Tone }[]
  hours: { label: string; value: number; total: number; tone: Tone }[]
  todos: { title: string; detail: string; tag: string }[]
}

export interface TeachingData {
  lesson: {
    title: string
    subject: string
    grade: string
    objective: string
    status: string
    blocks: { label: string; detail: string; duration: string }[]
  }
  pulse: { label: string; value: number; tone: Tone }[]
  misconceptions: { title: string; detail: string; ratio: string }[]
  summary: string
}

export interface AssignmentData {
  batches: { title: string; className: string; submitted: number; total: number; status: string; tone: Tone }[]
  errors: { title: string; detail: string; ratio: number; tone: Tone }[]
  feedback: string
}

export interface ManagerAnalysisData {
  subject: string
  grade: string
  mastery: number
  delta: number
  trend: number[]
  classes: { name: string; value: number; delta: number; tone: Tone }[]
  topics: { label: string; value: number }[]
  actions: string[]
}

export interface ClassHoursData {
  summary: { label: string; value: string; detail: string; tone: Tone }[]
  subjects: { name: string; planned: number; done: number; tone: Tone }[]
  teachers: { name: string; subject: string; planned: number; done: number; status: string }[]
  changes: { title: string; detail: string; tag: string }[]
  alert: string
}

export interface ResourceItem {
  id: string
  title: string
  type: string
  subject: string
  grade: string
  status: '已审核' | '待审核'
  tags: string[]
  tone: Tone
  usage: string
}

export type CourseStatus = 'published' | 'draft' | 'review'

export interface AICourse {
  id: string
  title: string
  subtitle: string
  category: string
  audience: Role[]
  duration: string
  lessons: number
  level: string
  instructor: string
  tone: Tone
  status: CourseStatus
  progress: number
  views: number
  completion: number
  description: string
  aiSummary: string
  objectives: string[]
  videoLabel: string
  updated: string
}

export interface CourseCatalogData {
  featured: AICourse
  courses: AICourse[]
  categories: string[]
  stats: { label: string; value: string; detail: string }[]
  totalViews: number
  averageCompletion: number
}

export interface CourseDraft {
  title: string
  subtitle: string
  category: string
  audience: Role[]
  duration: string
  level: string
  description: string
  videoLabel: string
}

export interface TrafficData {
  rangeLabel: string
  summary: {
    requests: string
    bandwidth: string
    aiTokens: string
    activeUsers: string
    storage: string
    errorRate: string
    cost: string
    requestDelta: string
  }
  series: { label: string; requests: number; ai: number; bandwidth: number }[]
  services: {
    name: string
    requests: string
    bandwidth: string
    latency: string
    errorRate: string
    tone: Tone
  }[]
  quotas: { label: string; used: number; total: number; unit: string; tone: Tone }[]
  alerts: { level: 'info' | 'warning' | 'critical'; title: string; detail: string; time: string }[]
}


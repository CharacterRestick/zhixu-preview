import { lazy, Suspense, type ReactNode } from 'react'
import {
  Activity,
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  FolderOpen,
  HeartHandshake,
  Home,
  LayoutDashboard,
  Map,
  Sparkles,
  Trophy,
  UsersRound,
  Video,
} from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell, type NavItem } from './components/AppShell'
import { PageSkeleton } from './components/Skeleton'
import { ToastProvider } from './components/Toast'
import { AuthProvider, RequireAuth, useAuth } from './lib/auth/AuthProvider'
import { MANAGER_ROLES } from './lib/auth/permissions'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'

const StudentHome = lazy(() => import('./pages/student/StudentHome').then((module) => ({ default: module.StudentHome })))
const LearningMapPage = lazy(() => import('./pages/student/LearningMapPage').then((module) => ({ default: module.LearningMapPage })))
const TutorPage = lazy(() => import('./pages/student/TutorPage').then((module) => ({ default: module.TutorPage })))
const SubjectAnalysisPage = lazy(() => import('./pages/student/SubjectAnalysisPage').then((module) => ({ default: module.SubjectAnalysisPage })))
const GrowthPage = lazy(() => import('./pages/student/GrowthPage').then((module) => ({ default: module.GrowthPage })))
const ParentReport = lazy(() => import('./pages/student/ParentReport').then((module) => ({ default: module.ParentReport })))
const ManagerHome = lazy(() => import('./pages/manager/ManagerHome').then((module) => ({ default: module.ManagerHome })))
const TeachingPage = lazy(() => import('./pages/manager/TeachingPage').then((module) => ({ default: module.TeachingPage })))
const AssignmentsPage = lazy(() => import('./pages/manager/AssignmentsPage').then((module) => ({ default: module.AssignmentsPage })))
const ManagerAnalysisPage = lazy(() => import('./pages/manager/ManagerAnalysisPage').then((module) => ({ default: module.ManagerAnalysisPage })))
const ClassHoursPage = lazy(() => import('./pages/manager/ClassHoursPage').then((module) => ({ default: module.ClassHoursPage })))
const ResourcesPage = lazy(() => import('./pages/manager/ResourcesPage').then((module) => ({ default: module.ResourcesPage })))
const CourseLearningPage = lazy(() => import('./pages/courses/CourseLearningPage').then((module) => ({ default: module.CourseLearningPage })))
const CourseManagePage = lazy(() => import('./pages/courses/CourseManagePage').then((module) => ({ default: module.CourseManagePage })))
const TrafficPage = lazy(() => import('./pages/manager/TrafficPage').then((module) => ({ default: module.TrafficPage })))
const TeacherSchedulePage = lazy(() => import('./pages/manager/TeacherSchedulePage').then((module) => ({ default: module.TeacherSchedulePage })))
const TeacherDirectoryPage = lazy(() => import('./pages/manager/TeacherDirectoryPage').then((module) => ({ default: module.TeacherDirectoryPage })))

function Page({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
}

const studentNav: NavItem[] = [
  { to: '/student', label: '今天', icon: Home, end: true, permission: 'student.home', section: 'learn' },
  { to: '/student/map', label: '学习地图', icon: Map, permission: 'student.map', section: 'learn' },
  { to: '/student/tutor', label: 'AI 导师', icon: Sparkles, permission: 'student.tutor', section: 'learn' },
  { to: '/student/analysis', label: '学科分析', icon: BarChart3, permission: 'student.analysis', section: 'learn' },
  { to: '/student/growth', label: '项目与成长', icon: Trophy, permission: 'student.growth', section: 'learn' },
  { to: '/student/courses', label: 'AI 课程', icon: Video, permission: 'student.courses', section: 'learn', badge: 'AI' },
]

const parentNav: NavItem[] = [
  { to: '/family', label: '家长周报', icon: HeartHandshake, end: true, permission: 'family.report', section: 'learn' },
  { to: '/family/analysis', label: '学科分析', icon: BarChart3, permission: 'family.analysis', section: 'learn' },
  { to: '/family/courses', label: 'AI 课程', icon: Video, permission: 'family.courses', section: 'learn', badge: 'AI' },
]

const teachingNav: NavItem[] = [
  { to: '/manager', label: '总览', icon: LayoutDashboard, end: true, permission: 'manager.dashboard', section: 'teach' },
  { to: '/manager/teaching', label: '备课与课堂', icon: BookOpen, permission: 'manager.teaching', section: 'teach' },
  { to: '/manager/schedule', label: '排课与课时', icon: CalendarDays, permission: 'manager.schedule', section: 'teach' },
  { to: '/manager/assignments', label: '作业与学情', icon: ClipboardCheck, permission: 'manager.assignments', section: 'teach' },
  { to: '/manager/analysis', label: '学科分析', icon: BarChart3, permission: 'manager.analysis', section: 'teach' },
  { to: '/manager/hours', label: '课时统计', icon: Clock3, permission: 'manager.hours', section: 'teach' },
  { to: '/manager/resources', label: '资源中心', icon: FolderOpen, permission: 'manager.resources', section: 'teach' },
]

const learningNav: NavItem = {
  to: '/manager/learning',
  label: '课程学习',
  icon: Video,
  permission: 'manager.courses.view',
  section: 'teach',
  badge: 'AI',
}

const teacherNav: NavItem[] = [...teachingNav, learningNav]

const managerNav: NavItem[] = [
  ...teachingNav,
  learningNav,
  { to: '/manager/teachers', label: '教师管理', icon: UsersRound, permission: 'manager.teachers', section: 'admin' },
  { to: '/manager/courses', label: '课程管理', icon: Video, permission: 'manager.courses.manage', section: 'admin' },
  { to: '/manager/traffic', label: '流量监控', icon: Activity, permission: 'manager.traffic', section: 'admin', badge: '实时' },
]

function ManagerShell() {
  const { session } = useAuth()
  return <AppShell navItems={session?.role === 'manager' ? managerNav : teacherNav} />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/student"
            element={
              <RequireAuth roles={['student']}>
                <AppShell navItems={studentNav} />
              </RequireAuth>
            }
          >
            <Route index element={<Page><StudentHome /></Page>} />
            <Route path="map" element={<Page><LearningMapPage /></Page>} />
            <Route path="tutor" element={<Page><TutorPage /></Page>} />
            <Route path="analysis" element={<Page><SubjectAnalysisPage /></Page>} />
            <Route path="growth" element={<Page><GrowthPage /></Page>} />
            <Route path="courses" element={<Page><CourseLearningPage /></Page>} />
          </Route>

          <Route
            path="/family"
            element={
              <RequireAuth roles={['parent']}>
                <AppShell navItems={parentNav} />
              </RequireAuth>
            }
          >
            <Route index element={<Page><ParentReport /></Page>} />
            <Route path="analysis" element={<Page><SubjectAnalysisPage /></Page>} />
            <Route path="courses" element={<Page><CourseLearningPage /></Page>} />
          </Route>

          <Route
            path="/manager"
            element={
              <RequireAuth roles={MANAGER_ROLES}>
                <ManagerShell />
              </RequireAuth>
            }
          >
            <Route index element={<Page><ManagerHome /></Page>} />
            <Route path="teaching" element={<Page><TeachingPage /></Page>} />
            <Route path="schedule" element={<Page><TeacherSchedulePage /></Page>} />
            <Route path="assignments" element={<Page><AssignmentsPage /></Page>} />
            <Route path="analysis" element={<Page><ManagerAnalysisPage /></Page>} />
            <Route path="hours" element={<Page><ClassHoursPage /></Page>} />
            <Route path="resources" element={<Page><ResourcesPage /></Page>} />
            <Route
              path="teachers"
              element={
                <RequireAuth roles={['manager']}>
                  <Page><TeacherDirectoryPage /></Page>
                </RequireAuth>
              }
            />
            <Route path="learning" element={<Page><CourseLearningPage /></Page>} />
            <Route path="courses" element={<Page><CourseManagePage /></Page>} />
            <Route
              path="traffic"
              element={
                <RequireAuth roles={['manager']}>
                  <Page><TrafficPage /></Page>
                </RequireAuth>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}

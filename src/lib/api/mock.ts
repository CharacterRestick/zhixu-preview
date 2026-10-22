import type { Role } from '../auth/types'
import type {
  AICourse,
  AnalysisData,
  AssignmentData,
  ChatMessage,
  ClassHoursData,
  CourseCatalogData,
  CourseDraft,
  GrowthData,
  LearningMapData,
  ManagerAnalysisData,
  ManagerDashboard,
  ParentReportData,
  ResourceItem,
  StudentDashboard,
  TeachingData,
  TrafficData,
  TutorData,
} from './types'

const wait = (ms = 320) => new Promise((resolve) => window.setTimeout(resolve, ms))

const studentDashboard: StudentDashboard = {
  profile: {
    name: '周予安',
    grade: '八年级',
    className: '3 班',
    avatar: '安',
    streak: 12,
  },
  today: {
    focus: '一次函数 · 图像与性质',
    progress: 68,
    minutes: 18,
    quote: '卡住不是失败，是线索。',
    tasks: [
      { id: 't1', title: '复习：斜率与截距', subject: '数学', duration: '6 分钟', type: '复习', done: true, tone: 'teal' },
      { id: 't2', title: '新学：图像平移', subject: '数学', duration: '12 分钟', type: '新学', done: false, tone: 'amber' },
      { id: 't3', title: '回讲：讲清一道题', subject: '数学', duration: '5 分钟', type: '回讲', done: false, tone: 'coral' },
    ],
  },
  subjects: [
    { name: '数学', mastery: 78, delta: 6, tone: 'teal', weakPoint: '图像平移' },
    { name: '物理', mastery: 72, delta: 3, tone: 'blue', weakPoint: '电路图识别' },
    { name: '化学', mastery: 65, delta: -2, tone: 'amber', weakPoint: '方程式配平' },
  ],
  week: [42, 58, 51, 66, 74, 68, 81],
  suggestion: '今晚先拿下「图像平移」，不要急着开新章。你上周在这个点上已经有过一次突破。',
  project: {
    title: '校园节能方案',
    summary: '用一次函数估算教学楼照明用电，给学校写一份可执行的节能建议。',
    progress: 64,
    tags: ['数学建模', '团队协作', '数据可视化'],
  },
  moments: [
    { label: '第一次用两种方法验证结论', detail: '在「一次函数」练习中主动检查了斜率与图像', time: '今天' },
    { label: '把错题讲给同桌听', detail: '回讲评分 4.6 / 5，表达比上周更清楚', time: '昨天' },
    { label: '项目提案通过', detail: '校园节能方案进入数据采集阶段', time: '3 天前' },
  ],
}

const learningMap: LearningMapData = {
  subject: '数学',
  nodes: [
    { id: 'n1', label: '变量与函数', x: 90, y: 230, status: 'mastered', mastery: 92, description: '理解变量、函数与对应关系，是本章的起点。', prerequisite: '无', next: '一次函数' },
    { id: 'n2', label: '一次函数', x: 250, y: 150, status: 'mastered', mastery: 88, description: '掌握 y = kx + b 的结构与基本性质。', prerequisite: '变量与函数', next: '图像与性质' },
    { id: 'n3', label: '图像与性质', x: 430, y: 210, status: 'learning', mastery: 68, description: '能根据 k、b 判断增减性与位置，是今天的重点。', prerequisite: '一次函数', next: '图像平移' },
    { id: 'n4', label: '图像平移', x: 610, y: 140, status: 'learning', mastery: 54, description: '理解 b 的变化如何影响图像上下平移。', prerequisite: '图像与性质', next: '待定系数法' },
    { id: 'n5', label: '待定系数法', x: 730, y: 280, status: 'todo', mastery: 12, description: '用已知点求函数解析式，下一步会用到。', prerequisite: '图像平移', next: '一次函数应用' },
    { id: 'n6', label: '一次函数应用', x: 590, y: 360, status: 'todo', mastery: 8, description: '把函数用于分段计费、行程与方案选择。', prerequisite: '待定系数法', next: '项目任务' },
    { id: 'n7', label: '方案选择', x: 390, y: 380, status: 'todo', mastery: 5, description: '比较不同方案，用图像与方程做决策。', prerequisite: '一次函数应用', next: '校园节能方案' },
    { id: 'n8', label: '校园节能方案', x: 210, y: 330, status: 'todo', mastery: 0, description: '真实任务：用函数估算照明用电并提出建议。', prerequisite: '方案选择', next: '作品与答辩' },
  ],
  edges: [
    { from: 'n1', to: 'n2' },
    { from: 'n2', to: 'n3' },
    { from: 'n3', to: 'n4' },
    { from: 'n4', to: 'n5' },
    { from: 'n5', to: 'n6' },
    { from: 'n6', to: 'n7' },
    { from: 'n7', to: 'n8' },
  ],
}

const tutorData: TutorData = {
  goal: '用图像判断一次函数的增减性，并解释 b 的作用',
  answerLocked: true,
  hints: [
    { level: 'L1', title: '先说说卡点', detail: '你卡在读图，还是不知道 k、b 分别管什么？' },
    { level: 'L2', title: '换一种表征', detail: '把两条直线画在同一张图上，只看它们的倾斜方向。' },
    { level: 'L3', title: '拆成两步', detail: '先看 k 的符号，再看 b 把图像往上还是往下挪。' },
    { level: 'L4', title: '相似例示范', detail: '看一个 y = 2x + 1 的例子，再把数据换掉重做。' },
  ],
  messages: [
    { id: 'm1', role: 'ai', text: '晚上好，小周。今天我们不急着要答案。先说说：你觉得 y = 2x + 1 和 y = 2x - 3 的图像，哪里一样，哪里不一样？', time: '20:16' },
    { id: 'm2', role: 'user', text: '我知道 k > 0 是上升的，但 b 变了，为什么两条线还是平行的？', time: '20:17' },
    { id: 'm3', role: 'ai', text: '问得很好。你已经看到“k 决定倾斜方向”。那 b 改变的时候，直线的“倾斜”变了吗？先不急着算，试着用“上下平移”描述一下。', time: '20:17', hintLevel: 2 },
  ],
}

const analysisData: AnalysisData = {
  subject: '数学',
  mastery: 78,
  delta: 6,
  radar: [
    { label: '概念理解', value: 84 },
    { label: '图像识别', value: 76 },
    { label: '步骤推理', value: 72 },
    { label: '计算准确', value: 81 },
    { label: '迁移应用', value: 63 },
    { label: '表达回讲', value: 70 },
  ],
  strengths: ['能快速判断 k 的符号与增减性', '计算准确率稳定在 80% 以上', '愿意用两种方法验证结论'],
  gaps: ['图像平移的方向容易混淆', '迁移到分段计费情境时建模不稳', '回讲时步骤顺序偶尔跳跃'],
  nextSteps: ['先做 2 道“上下平移”变式，再做 1 道分段计费迁移题', '回讲时按“先看 k，再看 b，最后看交点”的顺序', '周五前把错题本里的 3 道同错因题重做一遍'],
  heatmap: [
    { label: '函数概念', value: 92 },
    { label: '解析式', value: 86 },
    { label: '图像画法', value: 81 },
    { label: '增减性', value: 78 },
    { label: '图像平移', value: 54 },
    { label: '交点问题', value: 69 },
    { label: '待定系数', value: 46 },
    { label: '实际应用', value: 38 },
  ],
  parentNote: '本周数学的进步主要来自“图像识别”。目前最值得练的是“图像平移”，不需要加量刷题，先把方向弄清。',
}

const growthData: GrowthData = {
  projects: [
    { id: 'p1', title: '校园节能方案', summary: '用一次函数估算教学楼照明用电，提出可执行的节能建议。', tags: ['数学建模', '团队协作'], progress: 64, tone: 'teal', updated: '今天更新' },
    { id: 'p2', title: '社区水质小调查', summary: '采集 3 个点位的数据，用图表比较并给出结论。', tags: ['科学探究', '数据可视化'], progress: 82, tone: 'blue', updated: '3 天前' },
    { id: 'p3', title: '方言里的数学', summary: '记录方言中的计量表达，做一张“数学与语言”小报。', tags: ['文化理解', '表达'], progress: 35, tone: 'amber', updated: '上周' },
  ],
  badges: [
    { id: 'b1', title: '回讲达人', detail: '连续 5 次回讲评分 ≥ 4.5', tone: 'teal' },
    { id: 'b2', title: '错因侦探', detail: '独立定位 10 个错因', tone: 'amber' },
    { id: 'b3', title: '项目协作', detail: '完成一次团队项目答辩', tone: 'blue' },
    { id: 'b4', title: '迁移挑战', detail: '在新情境中正确应用一次函数', tone: 'coral' },
  ],
  timeline: [
    { title: '回讲评分创新高', detail: '「图像平移」回讲 4.6 / 5', date: '今天' },
    { title: '完成第 12 次连续学习', detail: '不是打卡，是 12 次真的坐下来学', date: '昨天' },
    { title: '项目进入数据采集', detail: '校园节能方案完成第一轮测量', date: '3 天前' },
  ],
}

const parentReport: ParentReportData = {
  child: '小周',
  week: '第 8 周 · 10 月 19 日 — 10 月 25 日',
  highlights: [
    { title: '数学：图像识别更稳了', detail: '能独立判断 k 的符号与增减性，本周相关练习正确率 84%。', tone: 'teal' },
    { title: '第一次主动回讲', detail: '用自己的话讲清了“为什么两条线平行”，表达比上周完整。', tone: 'amber' },
    { title: '项目里承担了数据整理', detail: '在校园节能方案中负责测量与图表，团队评价很积极。', tone: 'blue' },
  ],
  challenge: {
    title: '还需要练：图像平移',
    detail: '不是不认真，而是“b 改变方向”这个点还没稳。建议先做 2 道变式，不用加量刷题。',
  },
  activities: [
    { title: '一起看一张水电费账单', detail: '让孩子用一次函数解释“用得多，为什么单价会变”。', duration: '10 分钟' },
    { title: '散步时聊一个“方案选择”', detail: '比如两种打车计价方式，哪种更划算？让他说理由。', duration: '15 分钟' },
  ],
  quote: '这周最值得肯定的，不是分数，是他开始愿意把“为什么”讲出来。',
}

const managerDashboard: ManagerDashboard = {
  profile: { name: '李明', role: '数学教研组长', school: '云川实验中学', avatar: '李' },
  stats: [
    { label: '班级掌握度', value: '74%', delta: '+5.2%', tone: 'teal' },
    { label: '待批作业', value: '28', delta: '3 个班', tone: 'amber' },
    { label: '课时进度', value: '92%', delta: '超前 2 课时', tone: 'blue' },
    { label: '学科预警', value: '2', delta: '需本周处理', tone: 'coral' },
  ],
  interventions: [
    { id: 'i1', student: '林一然', initials: '林', reason: '一次函数图像平移连续 2 次同错因', evidence: '练习 3 次，2 次把 b 的方向判断反了', action: '推送 2 道变式 + 回讲', tone: 'amber' },
    { id: 'i2', student: '陈可', initials: '陈', reason: '电路图识别在课堂投票中集中出错', evidence: '42% 选错“串联/并联”判断', action: '课堂追问 + 演示实验', tone: 'teal' },
    { id: 'i3', student: '赵沐', initials: '赵', reason: '方程式配平 3 题同错', evidence: '错因均为“守恒顺序”', action: '分层任务 + 同伴讲解', tone: 'coral' },
  ],
  heatmap: [
    { label: '函数概念', value: 92 }, { label: '解析式', value: 86 }, { label: '图像画法', value: 81 }, { label: '增减性', value: 76 },
    { label: '图像平移', value: 52 }, { label: '交点问题', value: 68 }, { label: '待定系数', value: 44 }, { label: '实际应用', value: 36 },
    { label: '电路识别', value: 58 }, { label: '欧姆定律', value: 71 }, { label: '方程式', value: 64 }, { label: '实验设计', value: 49 },
  ],
  subjectTrends: [
    { label: '数学', values: [62, 65, 64, 69, 72, 76], tone: 'teal' },
    { label: '物理', values: [58, 60, 63, 62, 66, 70], tone: 'blue' },
    { label: '化学', values: [55, 57, 56, 60, 59, 63], tone: 'amber' },
  ],
  hours: [
    { label: '数学', value: 92, total: 100, tone: 'teal' },
    { label: '物理', value: 88, total: 96, tone: 'blue' },
    { label: '化学', value: 78, total: 92, tone: 'amber' },
    { label: '语文', value: 94, total: 100, tone: 'violet' },
  ],
  todos: [
    { title: '审核 6 份校本资源', detail: '其中 2 份涉及 AI 生成内容，需要重点看引用', tag: '今天' },
    { title: '确认下周调课', detail: '数学组 2 位老师涉及代课，课时统计待更新', tag: '待处理' },
    { title: '准备学科分析会', detail: '周五前整理八年级“图像平移”共性问题', tag: '本周' },
  ],
}

const teachingData: TeachingData = {
  lesson: {
    title: '一次函数的图像与性质',
    subject: '数学',
    grade: '八年级 · 3 班',
    objective: '能根据 k、b 判断图像位置与增减性，并用图像解释实际问题。',
    status: 'AI 初稿 · 待教师终审',
    blocks: [
      { label: '情境导入', detail: '用校园照明用电账单引出“两个变量之间的关系”。', duration: '5 分钟' },
      { label: '图像探究', detail: '分组画 y = 2x + 1 与 y = 2x - 3，比较平行与平移。', duration: '12 分钟' },
      { label: '分层任务', detail: 'A 组：判断增减性；B 组：解释 b 的几何意义；C 组：迁移到分段计费。', duration: '15 分钟' },
      { label: '出口卡', detail: '用一句话解释“b 变了，什么没变”。', duration: '5 分钟' },
    ],
  },
  pulse: [
    { label: '听懂了', value: 68, tone: 'teal' },
    { label: '有点晕', value: 24, tone: 'amber' },
    { label: '想再练', value: 8, tone: 'blue' },
  ],
  misconceptions: [
    { title: 'b 变，倾斜也变', detail: '把“上下平移”误认为“倾斜变化”，集中在图像平移第 2 题。', ratio: '38%' },
    { title: 'k 为负仍上升', detail: '符号判断与图像方向没有建立稳定联系。', ratio: '21%' },
    { title: '交点坐标读反', detail: '读图时把横纵坐标顺序弄反。', ratio: '14%' },
  ],
  summary: '今天班级对“k 决定倾斜方向”掌握较好；下一步把“b 决定上下平移”做成 3 分钟微讲解，再用一道账单情境题检验迁移。',
}

const assignmentData: AssignmentData = {
  batches: [
    { title: '一次函数 · 分层作业', className: '八年级 3 班', submitted: 42, total: 45, status: 'AI 预批中', tone: 'teal' },
    { title: '电路图识别 · 周末练习', className: '八年级 3 班', submitted: 45, total: 45, status: '待教师终审', tone: 'amber' },
    { title: '方程式配平 · 错题重做', className: '八年级 2 班', submitted: 38, total: 44, status: '已终审', tone: 'blue' },
  ],
  errors: [
    { title: '图像平移方向', detail: 'b 增加时，图像应向上平移；38% 的学生选反。', ratio: 38, tone: 'coral' },
    { title: '斜率符号判断', detail: 'k < 0 时仍判断为上升，集中在第 3、5 题。', ratio: 21, tone: 'amber' },
    { title: '交点坐标顺序', detail: '横纵坐标读反，步骤正确但答案写反。', ratio: 14, tone: 'blue' },
  ],
  feedback: 'AI 已按 rubric 完成 42 份预批，建议教师重点复核 6 份“步骤跳跃”的作业，不需要逐份重改。',
}

const managerAnalysis: ManagerAnalysisData = {
  subject: '数学',
  grade: '八年级',
  mastery: 76,
  delta: 5,
  trend: [62, 65, 64, 69, 72, 76],
  classes: [
    { name: '3 班', value: 78, delta: 6, tone: 'teal' },
    { name: '5 班', value: 76, delta: 4, tone: 'teal' },
    { name: '2 班', value: 73, delta: 3, tone: 'blue' },
    { name: '4 班', value: 71, delta: 2, tone: 'blue' },
    { name: '1 班', value: 69, delta: 5, tone: 'amber' },
    { name: '6 班', value: 66, delta: 7, tone: 'amber' },
  ],
  topics: [
    { label: '函数概念', value: 92 }, { label: '解析式', value: 86 }, { label: '图像画法', value: 81 }, { label: '增减性', value: 76 },
    { label: '图像平移', value: 52 }, { label: '交点问题', value: 68 }, { label: '待定系数', value: 44 }, { label: '实际应用', value: 36 },
  ],
  actions: ['本周一次教研：用“上下平移”做 15 分钟同课异构', '给 1 班、6 班推送同一组变式题，不做班级排名', '把 3 班的回讲样例收进学科资源库'],
}

const classHours: ClassHoursData = {
  summary: [
    { label: '计划课时', value: '320', detail: '本学期 · 八年级数学', tone: 'blue' },
    { label: '已完成', value: '296', detail: '含调课 8 课时', tone: 'teal' },
    { label: '完成率', value: '92.5%', detail: '较上周 +2.1%', tone: 'amber' },
    { label: '课时缺口', value: '24', detail: '需在月底前补齐', tone: 'coral' },
  ],
  subjects: [
    { name: '数学', planned: 100, done: 92, tone: 'teal' },
    { name: '物理', planned: 96, done: 88, tone: 'blue' },
    { name: '化学', planned: 92, done: 78, tone: 'amber' },
    { name: '语文', planned: 100, done: 94, tone: 'violet' },
  ],
  teachers: [
    { name: '李明', subject: '数学', planned: 18, done: 17, status: '正常' },
    { name: '王珂', subject: '数学', planned: 16, done: 16, status: '正常' },
    { name: '陈一帆', subject: '物理', planned: 16, done: 14, status: '偏慢' },
    { name: '赵清', subject: '化学', planned: 15, done: 12, status: '缺口' },
    { name: '林晓', subject: '语文', planned: 16, done: 15, status: '正常' },
    { name: '周宁', subject: '数学', planned: 15, done: 14, status: '正常' },
  ],
  changes: [
    { title: '周三 · 数学 3 班', detail: '王珂老师调课至周四第 2 节，已同步课时。', tag: '已调整' },
    { title: '周五 · 化学 2 班', detail: '赵清老师代课 1 节，待确认工作量归属。', tag: '待确认' },
    { title: '下周一 · 物理 4 班', detail: '陈一帆老师请假，需安排代课。', tag: '待安排' },
  ],
  alert: '化学组当前进度比计划慢 14 课时，建议先核对实验课安排，再决定是否调整周课时，不要直接压缩复习时间。',
}

const resources: ResourceItem[] = [
  { id: 'r1', title: '一次函数图像平移 · 3 分钟微课', type: '微课', subject: '数学', grade: '八年级', status: '已审核', tags: ['课标对齐', 'AI 辅助', '可离线'], tone: 'teal', usage: '本周使用 126 次' },
  { id: 'r2', title: '分段计费：从账单到函数', type: '项目', subject: '数学', grade: '八年级', status: '已审核', tags: ['真实情境', '迁移', 'rubric'], tone: 'amber', usage: '本周使用 48 次' },
  { id: 'r3', title: '电路图识别 · 交互练习', type: '互动题', subject: '物理', grade: '八年级', status: '待审核', tags: ['AI 生成', '需复核'], tone: 'coral', usage: '待发布' },
  { id: 'r4', title: '方程式配平 · 错因微课', type: '微课', subject: '化学', grade: '九年级', status: '已审核', tags: ['错因', '变式', '短时'], tone: 'blue', usage: '本周使用 73 次' },
  { id: 'r5', title: '校园节能方案 · 项目包', type: '项目', subject: '跨学科', grade: '八年级', status: '已审核', tags: ['PBL', '数据', '协作'], tone: 'violet', usage: '本周使用 31 次' },
  { id: 'r6', title: '一次函数 · 分层作业模板', type: '作业', subject: '数学', grade: '八年级', status: '待审核', tags: ['分层', '校本', 'rubric'], tone: 'teal', usage: '待发布' },
]

let courses: AICourse[] = [
  {
    id: 'c1',
    title: '用 AI 学会提问',
    subtitle: '不是让 AI 给答案，而是让它帮你想得更清楚。',
    category: '学习方法',
    audience: ['student', 'parent', 'teacher', 'manager'],
    duration: '18 分钟',
    lessons: 5,
    level: '入门',
    instructor: '小序教研组',
    tone: 'teal',
    status: 'published',
    progress: 42,
    views: 1280,
    completion: 76,
    description: '从一次真实的“卡住”开始，练习把模糊的问题改写成可追问的问题，再用 AI 做反例、做类比、做检查。',
    aiSummary: '好问题不是“这题怎么做”，而是“我卡在哪一步、我试过什么、还差哪一个条件”。',
    objectives: ['把“我不会”改写成一个具体问题', '用反例检验自己的理解', '让 AI 只给提示，不给最终答案'],
    videoLabel: '5 段微视频 · AI 字幕',
    updated: '今天',
  },
  {
    id: 'c2',
    title: '一次函数：图像会说话',
    subtitle: '从 k 和 b 开始，读懂一条直线的性格。',
    category: '数学',
    audience: ['student', 'teacher'],
    duration: '24 分钟',
    lessons: 6,
    level: '八年级',
    instructor: '李明 · 数学组',
    tone: 'blue',
    status: 'published',
    progress: 68,
    views: 964,
    completion: 71,
    description: '用图像平移、斜率比较和真实情境，把一次函数的性质串成一条线，而不是背结论。',
    aiSummary: 'k 决定方向和倾斜，b 决定与 y 轴的交点；图像平移不改变 k。',
    objectives: ['根据 k、b 判断图像位置', '解释“上下平移”与解析式的关系', '用图像解决一个真实的分段计费问题'],
    videoLabel: '6 段微视频 · 动态图像',
    updated: '昨天',
  },
  {
    id: 'c3',
    title: '电路识别的三个陷阱',
    subtitle: '串联、并联、短路，先看清路径再动笔。',
    category: '物理',
    audience: ['student', 'teacher'],
    duration: '16 分钟',
    lessons: 4,
    level: '八年级',
    instructor: '陈一帆 · 物理组',
    tone: 'amber',
    status: 'published',
    progress: 20,
    views: 612,
    completion: 64,
    description: '用“描路径”的方法识别电路，集中处理课堂里最容易混淆的三个判断。',
    aiSummary: '先找电源正极出发的路径，再看电流在哪里分叉、在哪里汇合。',
    objectives: ['区分串联与并联的路径', '识别局部短路的特征', '用电流路径解释开关作用'],
    videoLabel: '4 段微视频 · 电路动画',
    updated: '2 天前',
  },
  {
    id: 'c4',
    title: '家长如何陪一次复盘',
    subtitle: '不追问分数，先让孩子把“为什么”讲出来。',
    category: '家庭教育',
    audience: ['parent'],
    duration: '12 分钟',
    lessons: 3,
    level: '家长课',
    instructor: '知序家长学院',
    tone: 'coral',
    status: 'published',
    progress: 55,
    views: 438,
    completion: 82,
    description: '用一次 10 分钟的亲子对话，替代“考了多少分”的追问。给家长一套能直接照着用的复盘脚本。',
    aiSummary: '复盘的目标不是找出错误，而是让孩子感到“我的思考被听见了”。',
    objectives: ['用三个问题开启复盘', '区分“事实”和“评价”', '把下一次行动缩小到一个具体动作'],
    videoLabel: '3 段微视频 · 对话示范',
    updated: '3 天前',
  },
  {
    id: 'c5',
    title: '教师如何用 AI 备课',
    subtitle: '让 AI 做初稿，教师保留判断。',
    category: '教师发展',
    audience: ['teacher', 'manager'],
    duration: '22 分钟',
    lessons: 5,
    level: '教师课',
    instructor: '王砚 · 教学发展中心',
    tone: 'violet',
    status: 'published',
    progress: 0,
    views: 356,
    completion: 69,
    description: '从学情出发生成教案初稿，再用“错因—任务—出口卡”的结构做二次设计。',
    aiSummary: 'AI 适合做素材整理和初稿，不适合替代教师对课堂的判断。',
    objectives: ['用学情生成分层任务', '识别 AI 初稿里的空泛表述', '设计一个可观察的课堂出口卡'],
    videoLabel: '5 段微视频 · 备课示例',
    updated: '本周',
  },
  {
    id: 'c6',
    title: '项目式学习：从问题到作品',
    subtitle: '一个好的项目，从一个真实的问题开始。',
    category: '项目学习',
    audience: ['student', 'teacher', 'manager'],
    duration: '28 分钟',
    lessons: 6,
    level: '进阶',
    instructor: '课程中心',
    tone: 'teal',
    status: 'draft',
    progress: 0,
    views: 0,
    completion: 0,
    description: '把“做一个小报”升级成“解决一个真实问题”：如何定驱动问题、如何做过程证据、如何答辩。',
    aiSummary: '项目不是加一个作品，而是让学生经历“提问—取证—迭代—表达”的完整过程。',
    objectives: ['写出一个可探究的驱动问题', '设计过程性证据', '用 rubric 支持学生自评'],
    videoLabel: '待上传视频',
    updated: '草稿',
  },
]

function buildCatalog(source: AICourse[], role?: Role): CourseCatalogData {
  const visible = source.filter((course) => !role || course.audience.includes(role))
  const published = visible.filter((course) => course.status === 'published')
  const featured = published[0] ?? visible[0]
  return {
    featured,
    courses: visible,
    categories: Array.from(new Set(visible.map((course) => course.category))),
    stats: [
      { label: '已发布课程', value: String(source.filter((course) => course.status === 'published').length), detail: '面向学生 / 家长 / 教师' },
      { label: '累计学习', value: '3.6k', detail: '本月 +18%' },
      { label: '平均完成率', value: '72%', detail: '比上月 +6%' },
    ],
    totalViews: source.reduce((sum, course) => sum + course.views, 0),
    averageCompletion: Math.round(source.reduce((sum, course) => sum + course.completion, 0) / Math.max(source.length, 1)),
  }
}

const trafficData: TrafficData = {
  rangeLabel: '最近 7 天',
  summary: {
    requests: '184.2 万',
    bandwidth: '326 GB',
    aiTokens: '41.8 M',
    activeUsers: '2,416',
    storage: '78.4 GB',
    errorRate: '0.42%',
    cost: '¥ 1,286',
    requestDelta: '+12.4%',
  },
  series: [
    { label: '周四', requests: 21, ai: 8, bandwidth: 28 },
    { label: '周五', requests: 26, ai: 11, bandwidth: 34 },
    { label: '周六', requests: 18, ai: 7, bandwidth: 22 },
    { label: '周日', requests: 16, ai: 6, bandwidth: 19 },
    { label: '周一', requests: 29, ai: 13, bandwidth: 41 },
    { label: '周二', requests: 32, ai: 16, bandwidth: 46 },
    { label: '今天', requests: 27, ai: 14, bandwidth: 38 },
  ],
  services: [
    { name: '页面与静态资源', requests: '112.4 万', bandwidth: '184 GB', latency: '42 ms', errorRate: '0.18%', tone: 'teal' },
    { name: '学习数据 API', requests: '38.6 万', bandwidth: '62 GB', latency: '86 ms', errorRate: '0.32%', tone: 'blue' },
    { name: 'AI 导师 / 课程摘要', requests: '18.2 万', bandwidth: '41 GB', latency: '1.4 s', errorRate: '0.64%', tone: 'amber' },
    { name: '视频与对象存储', requests: '9.8 万', bandwidth: '31 GB', latency: '120 ms', errorRate: '0.21%', tone: 'violet' },
    { name: '导出与报表任务', requests: '5.2 万', bandwidth: '8 GB', latency: '2.2 s', errorRate: '0.18%', tone: 'coral' },
  ],
  quotas: [
    { label: '月度带宽', used: 326, total: 500, unit: 'GB', tone: 'teal' },
    { label: 'AI Token', used: 41.8, total: 80, unit: 'M', tone: 'amber' },
    { label: '对象存储', used: 78.4, total: 120, unit: 'GB', tone: 'blue' },
  ],
  alerts: [
    { level: 'warning', title: 'AI 导师晚高峰延迟上升', detail: '19:00–21:00 P95 延迟 2.6s，建议开启流式响应与结果缓存。', time: '今天 20:10' },
    { level: 'info', title: '视频带宽接近月度 65%', detail: '按当前趋势，月底预计使用 462GB，仍在配额内。', time: '今天 18:40' },
    { level: 'critical', title: '导出任务堆积 3 个', detail: '课时统计导出队列等待超过 5 分钟，建议扩容 worker。', time: '今天 16:22' },
  ],
}

export const mockApi = {
  async getStudentDashboard(): Promise<StudentDashboard> {
    await wait()
    return studentDashboard
  },
  async getLearningMap(): Promise<LearningMapData> {
    await wait(260)
    return learningMap
  },
  async getTutorSession(): Promise<TutorData> {
    await wait(280)
    return tutorData
  },
  async sendTutorMessage(text: string, hintLevel: number): Promise<ChatMessage> {
    await wait(680)
    const replies = [
      '先别急着算。你能用自己的话说说：当 b 从 1 变成 -3 时，直线整体发生了什么？',
      '对，方向没变，位置变了。那如果 b 增加 2，图像会往哪边挪？试着画一条虚线对比一下。',
      '你已经抓住关键了：k 决定倾斜，b 决定上下。现在把 y = 2x - 3 向上平移 4 个单位，新的解析式会是什么？',
    ]
    return {
      id: `m-${Date.now()}`,
      role: 'ai',
      text: replies[Math.min(hintLevel, replies.length - 1)],
      hintLevel,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
  },
  async getSubjectAnalysis(): Promise<AnalysisData> {
    await wait(300)
    return analysisData
  },
  async getFamilySubjectAnalysis(): Promise<AnalysisData> {
    await wait(300)
    return analysisData
  },
  async getGrowth(): Promise<GrowthData> {
    await wait(260)
    return growthData
  },
  async getParentReport(): Promise<ParentReportData> {
    await wait(260)
    return parentReport
  },
  async getManagerDashboard(): Promise<ManagerDashboard> {
    await wait(340)
    return managerDashboard
  },
  async getTeachingOverview(): Promise<TeachingData> {
    await wait(300)
    return teachingData
  },
  async getAssignmentOverview(): Promise<AssignmentData> {
    await wait(300)
    return assignmentData
  },
  async getManagerSubjectAnalysis(): Promise<ManagerAnalysisData> {
    await wait(300)
    return managerAnalysis
  },
  async getClassHours(): Promise<ClassHoursData> {
    await wait(320)
    return classHours
  },
  async getResources(): Promise<ResourceItem[]> {
    await wait(260)
    return resources
  },
  async getCourseCatalog(role: Role): Promise<CourseCatalogData> {
    await wait(280)
    return buildCatalog(courses.filter((course) => course.status === 'published'), role)
  },
  async getCourseManagement(): Promise<CourseCatalogData> {
    await wait(300)
    return buildCatalog(courses)
  },
  async createCourse(draft: CourseDraft): Promise<AICourse> {
    await wait(620)
    const next: AICourse = {
      id: `c-${Date.now()}`,
      title: draft.title,
      subtitle: draft.subtitle,
      category: draft.category,
      audience: draft.audience,
      duration: draft.duration,
      lessons: 1,
      level: draft.level,
      instructor: '王砚 · 教学发展中心',
      tone: draft.audience.includes('parent') ? 'coral' : draft.audience.includes('teacher') ? 'violet' : 'teal',
      status: 'published',
      progress: 0,
      views: 0,
      completion: 0,
      description: draft.description,
      aiSummary: '课程已发布，AI 摘要会在视频转写完成后自动生成。',
      objectives: ['完成课程视频上传', '补充 3 个学习目标', '设置课程受众与可见范围'],
      videoLabel: draft.videoLabel || '待上传视频',
      updated: '刚刚发布',
    }
    courses = [next, ...courses]
    return next
  },
  async toggleCourseStatus(id: string): Promise<AICourse> {
    await wait(300)
    const course = courses.find((item) => item.id === id)
    if (!course) throw new Error('课程不存在')
    course.status = course.status === 'published' ? 'draft' : 'published'
    course.updated = '刚刚更新'
    return { ...course }
  },
  async getTrafficOverview(): Promise<TrafficData> {
    await wait(360)
    return trafficData
  },
}

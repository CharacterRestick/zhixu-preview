# 知序 · 登录、权限与接口契约（V2）

> 前端与后端的共同约定。字段名、类型以 `src/lib/api/types.ts` 为准；改字段必须同步改这里。

## 1. 基础约定

- **Base URL**：`/api/v1`
- **内容类型**：`application/json; charset=utf-8`
- **时间**：ISO 8601，例如 `2026-10-22T20:16:00+08:00`
- **ID**：字符串；不暴露自增主键
- **错误结构**：

```json
{
  "code": "AUTH_FORBIDDEN",
  "message": "当前角色没有该操作权限",
  "requestId": "req_01J...",
  "details": {}
}
```

- **分页**：`?cursor=xxx&limit=20`，返回 `{ "items": [], "nextCursor": "..." }`
- **幂等**：创建类 `POST` 支持 `Idempotency-Key`
- **追踪**：响应头 `X-Request-Id`

## 2. 登录方式（已定）

**同域 HttpOnly Cookie + 服务端会话**。不使用 localStorage 存 JWT。

```text
浏览器
  └─ https://your-domain.com/       静态前端
  └─ https://your-domain.com/api/v1 反向代理到后端
```

```text
Set-Cookie: __Host-zx_session=<opaque-id>;
  Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=28800
```

- 前端所有请求 `credentials: 'include'`。
- 后端按会话查 `userId`、`role`、`orgId`、`permissions`。
- 写操作校验 `Origin` 与 `X-CSRF-Token`（可读 Cookie `zx_csrf`）。
- 登录失败统一返回 `AUTH_INVALID_CREDENTIALS`，不区分账号不存在/密码错误。
- 连续失败限流；生产必须 HTTPS。

### 登录标识

| 角色 | 登录方式 |
|---|---|
| 学生 | 学号/手机号 + 密码；学校 SSO 可选 |
| 家长 | 手机号 + 验证码；首次用学校邀请码绑定孩子 |
| 教师 | 手机号/邮箱 + 密码；学校 SSO 可选 |
| 管理者 | 手机号/邮箱 + 密码 + 学校组织 |

> 前端的四张身份卡片用于本地开发，不发送密码；正式版由学校统一身份服务完成认证。

## 3. 角色与权限

**只有四个身份：学生、家长、教师、管理者。**

| 权限 | 学生 | 家长 | 教师 | 管理者 |
|---|---:|---:|---:|---:|
| 学生首页 / 学习地图 / 学习导师 / 学生学科分析 / 项目成长 | ✓ |  |  |  |
| 家长周报 / 家长学科分析 |  | ✓ |  |  |
| AI 课程学习 | ✓ | ✓ | ✓（只读） | ✓ |
| 管理者总览 / 备课课堂 / 作业学情 / 学科分析 / 课时统计 / 资源中心 |  |  | ✓ | ✓ |
| 排课日程 / 学生人数 / 剩余课时 |  |  | ✓ | ✓ |
| 教师信息名册、新增、编辑、状态调整 |  |  |  | ✓ |
| 课程发布、下架、可见范围 |  |  |  | ✓ |
| 平台流量、配额、告警 |  |  |  | ✓ |
| 成员、角色、审计（后续） |  |  |  | ✓ |

原则：

- 前端 `ROLE_PERMISSIONS` 只控制菜单和路由。
- 后端必须按 `role + orgId + resourceId` 再次校验。
- 教师可以看课程内容和学情，但不能发布/下架课程。
- 管理者拥有全部管理修改权限；所有发布、下架、导出、权限变更写审计日志。
- 家长只看自己孩子的聚合数据，不看原始对话。

## 4. 认证接口

### `POST /api/v1/auth/login`

```json
{ "account": "13800000000", "password": "******", "roleHint": "teacher", "schoolCode": "YCSY" }
```

响应：

```json
{
  "user": {
    "id": "usr_01",
    "role": "teacher",
    "name": "李明",
    "avatar": "李",
    "roleLabel": "教师端",
    "detail": "数学教师 · 八年级 3 班",
    "school": "云川实验中学",
    "orgId": "org_ycsy"
  },
  "permissionCodes": ["manager.dashboard", "manager.teaching", "manager.courses.view"],
  "expiresAt": "2026-10-23T04:16:00+08:00"
}
```

### `GET /api/v1/auth/session`

返回当前用户和权限；未登录 `401 AUTH_REQUIRED`。

### `POST /api/v1/auth/logout`

清除会话与 Cookie，返回 `204`。

### 可选：学校 SSO

```text
GET /api/v1/auth/sso/authorize?provider=school&redirect=/manager
GET /api/v1/auth/sso/callback?code=...
```

### 可选：家长绑定

```text
POST /api/v1/family/bind
{ "inviteCode": "XXXX", "studentNo": "20260001" }
```

## 5. 业务接口

所有接口要求登录，并按角色/组织过滤。

| 方法 | 路径 | 用途 | 角色 |
|---|---|---|---|
| GET | `/student/dashboard` | 学生首页 | 学生 |
| GET | `/student/learning-map` | 学习地图 | 学生 |
| GET | `/student/tutor/session` | AI 导师会话 | 学生 |
| POST | `/student/tutor/messages` | 发送消息 | 学生 |
| GET | `/student/subject-analysis` | 学生学科分析 | 学生 |
| GET | `/student/growth` | 项目与成长 | 学生 |
| GET | `/family/weekly-report` | 家长周报 | 家长 |
| GET | `/family/subject-analysis` | 家长学科分析 | 家长 |
| GET | `/manager/dashboard` | 管理者总览 | 教师 / 管理者 |
| GET | `/manager/teaching` | 备课与课堂 | 教师 / 管理者 |
| GET | `/manager/assignments` | 作业与学情 | 教师 / 管理者 |
| GET | `/manager/subject-analysis` | 学科分析 | 教师 / 管理者 |
| GET | `/manager/class-hours` | 课时统计 | 教师 / 管理者 |
| GET | `/manager/resources` | 资源中心 | 教师 / 管理者 |
| GET | `/manager/schedule` | 排课、学生人数、班级剩余课时 | 教师 / 管理者 |
| GET | `/manager/teachers` | 教师名册 | 管理者 |
| POST | `/manager/teachers` | 新增教师 | 管理者 |
| PATCH | `/manager/teachers/:id` | 编辑教师信息 | 管理者 |
| PATCH | `/manager/teachers/:id/status` | 在岗 / 休假状态调整 | 管理者 |
| GET | `/courses?audience=student` | 课程目录 | 登录用户 |
| GET | `/manager/courses` | 课程管理列表 | 教师只读 / 管理者 |
| POST | `/manager/courses` | 发布课程 | 管理者 |
| PATCH | `/manager/courses/:id/publish` | 发布/下架 | 管理者 |
| GET | `/manager/traffic` | 流量与配额 | 管理者 |

### 课程契约

```ts
interface AICourse {
  id: string
  title: string
  subtitle: string
  category: string
  audience: ('student' | 'parent' | 'teacher' | 'manager')[]
  duration: string
  lessons: number
  level: string
  instructor: string
  tone: 'teal' | 'amber' | 'coral' | 'blue' | 'violet'
  status: 'published' | 'draft' | 'review'
  progress: number
  views: number
  completion: number
  description: string
  aiSummary: string
  objectives: string[]
  videoLabel: string
  updated: string
}
```

发布请求：

```json
{
  "title": "用 AI 学会提问",
  "subtitle": "不是让 AI 给答案，而是让它帮你想得更清楚。",
  "category": "学习方法",
  "audience": ["student", "parent", "teacher"],
  "duration": "18 分钟",
  "level": "入门",
  "description": "……",
  "videoLabel": "5 段微视频 · AI 字幕"
}
```

真实视频上传走对象存储预签名，前端不直接把大文件传给业务 API：

```text
POST /api/v1/uploads/presign
{ "filename": "course.mp4", "contentType": "video/mp4", "purpose": "course" }
-> { "uploadUrl": "...", "fileId": "file_01", "expiresIn": 600 }
```

### 教师排课与课时契约

```ts
interface TeacherScheduleData {
  summary: { label: string; value: string; detail: string; tone: Tone }[]
  week: { label: string; date: string; isToday: boolean }[]
  lessons: {
    id: string; day: number; start: string; end: string
    title: string; className: string; subject: string; room: string; tone: Tone
  }[]
  classes: {
    name: string; students: number; subject: string
    planned: number; done: number; remaining: number; tone: Tone
  }[]
  notes: { title: string; detail: string; time: string }[]
  totalStudents: number
  totalRemainingHours: number
}
```

- `day` 使用 0–6 表示周一到周日。
- `remaining = planned - done`，班级合计必须与 `totalRemainingHours` 一致。
- 管理者看全校范围；教师只看自己任课班级。

### 教师名册契约

```ts
interface TeacherRecord {
  id: string
  name: string
  employeeNo: string
  subject: string
  title: string
  phone: string
  email: string
  classes: string[]
  weeklyHours: number
  remainingHours: number
  status: 'active' | 'leave' | 'pending'
  joinedAt: string
  avatar: string
  tone: Tone
  lastActive: string
}
```

新增/编辑请求包含 `name`、`employeeNo`、`subject`、`title`、`phone`、`email`、`classes`（顿号或逗号分隔字符串）、`weeklyHours`、`remainingHours`、`status`。  
只有管理者可写；教师读取自己的信息时由后端过滤字段。

### 流量监控契约

```ts
interface TrafficData {
  rangeLabel: string
  summary: {
    requests: string; bandwidth: string; aiTokens: string; activeUsers: string
    storage: string; errorRate: string; cost: string; requestDelta: string
  }
  series: { label: string; requests: number; ai: number; bandwidth: number }[]
  services: { name: string; requests: string; bandwidth: string; latency: string; errorRate: string; tone: Tone }[]
  quotas: { label: string; used: number; total: number; unit: string; tone: Tone }[]
  alerts: { level: 'info' | 'warning' | 'critical'; title: string; detail: string; time: string }[]
}
```

监控只统计聚合指标：请求量、带宽、AI token、存储、延迟、错误率、成本。**不记录学生对话原文，不按学生个人做行为分析。**

### AI 导师流式（后续）

```text
POST /api/v1/student/tutor/messages/stream
Accept: text/event-stream

event: delta
data: {"text":"先别急着算，"}

event: done
data: {"messageId":"msg_01","usage":{"input":1200,"output":180}}
```

## 6. 课时统计口径

- **计划课时**：课程计划内应授课时，含国家课程与校本课程。
- **实际课时**：课表实际发生课时，含调课、代课；不含取消且未补的课。
- **完成率**：实际 / 计划。
- **缺口**：计划 − 实际。
- **代课归属**：默认计入实际授课教师工作量，原教师记“调出”；区域可配置。
- **权限**：教师看自己；管理者看全校。
- **审计**：调课、代课、删除、导出都写操作日志。

## 7. 安全与合规

- 同域 Cookie；生产 HTTPS。
- `HttpOnly`、`Secure`、`SameSite=Lax`；跨站嵌入再评估 `SameSite=None`。
- 写操作校验 CSRF token 与 `Origin`。
- 登录、导出、发布、权限变更限流。
- 未成年人数据最小化；不采集人脸、不做表情识别、不做注意力打分。
- 日志脱敏；不记录密码、完整 Cookie、完整聊天原文。
- 备份与恢复演练；敏感操作双人审批。
- 生产环境关闭 mock；`VITE_USE_MOCK` 不能由用户输入控制。

## 8. 前端对接顺序

1. 后端先实现 `POST /auth/login`、`GET /auth/session`、`POST /auth/logout`。
2. 前端把 `AuthProvider` 的本地 `login()` 换成 `authHttp.login()`，启动时用 `authHttp.session()` 恢复。
3. 先接一条端到端链路：`学生练习 → 学习画像 → 教师干预 → 家长周报`。
4. 再接 AI 课程、流量监控、课时统计、资源中心。
5. 最后接 AI 流式、上传、导出、私有化配置。

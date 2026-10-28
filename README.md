# 知序 · 前端 V1.3

面向中学的 AI 个性化学习与教学协同平台。  
本版统一为 **学生、家长、教师、管理者** 四种身份；新增教师排课/学生人数/剩余课时、管理者教师名册、AI 课程学习、课程发布、平台流量监控和分组导航。所有数据通过统一 API 层访问，方便后续接入后端。

## 在线访问

**https://characterrestick.github.io/zhixu-preview-demo/**

公开构建仓库存放静态产物；源码在当前仓库。GitHub Pages 构建使用：

```bash
node node_modules/vite/bin/vite.js build --base=/zhixu-preview-demo/ --outDir dist-pages
```

## 本地运行

```bash
# 安装依赖（若尚未安装）
pnpm install
# 如果提示 esbuild 的 build script 被忽略：
pnpm approve-builds --all

# 开发模式
pnpm dev
# http://127.0.0.1:4173

# 生产构建 + 本地运行
pnpm build
pnpm preview
# http://127.0.0.1:4173
```

> 如果使用本机已有的 Node，可以直接用 `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4173` 启动。

## 手机访问

1. 手机和电脑连同一个 Wi-Fi。
2. 电脑上启动时监听所有网卡：

```bash
pnpm build
node node_modules/vite/bin/vite.js preview --host 0.0.0.0 --port 4173
```

3. 手机浏览器打开电脑的局域网地址，例如：

```text
http://192.168.2.20:4173/
```

当前这台机器的地址是 `192.168.2.20`。如果 IP 变了，运行 `ipconfig` 查看 WLAN 的 IPv4 地址，或看启动日志里的 `Network:` 一行。

如果手机打不开：

- 确认 Windows 防火墙允许 `node.exe` 的入站访问（当前已存在 Public 网络的允许规则）。
- 或在 Windows 防火墙高级设置中新增入站规则：TCP，端口 `4173`，作用域“本地子网”。
- 确认路由器没有开启“AP 隔离 / 访客网络隔离”。
- 不要使用 `127.0.0.1` 或 `localhost`，手机访问不到电脑的本机回环地址。

## 长期部署

> 当前环境没有 Vercel / Cloudflare / Netlify / 阿里云账号凭证，所以还没有发布长期公网地址。  
> `dist/` 构建包、`vercel.json`、`netlify.toml`、`_redirects` 都已准备好；你登录任一平台或提供部署 Token 后即可发布。

这是一个 Vite SPA，构建产物在 `dist/`。可以直接部署到静态托管：

- **Vercel**：仓库导入后，Build Command 填 `pnpm build`，Output Directory 填 `dist`。
- **Netlify**：`netlify.toml` 已配置好构建命令、发布目录和 SPA 回退。
- **Cloudflare Pages**：Build Command 填 `pnpm build`，Output Directory 填 `dist`；`public/_redirects` 已处理深链接。
- **国内长期访问**：建议阿里云 OSS + CDN、腾讯云 COS + CDN，或自有云服务器，并完成域名 ICP 备案。Vercel / Netlify 在中国大陆的访问速度和稳定性不稳定。

已加入：

- `vercel.json`：SPA 路由回退
- `netlify.toml`：构建 + SPA 回退
- `public/_redirects`：Cloudflare Pages 深链接回退
- `public/_headers`：基础安全响应头

### 接后端时的部署方式

推荐同一个域名下：

```text
https://your-domain.com/        -> 静态前端
https://your-domain.com/api/*   -> 反向代理到后端
```

这样前端不需要跨域，Cookie / 登录态也更简单。若前后端分开域名，则后端必须配置 CORS、凭证和 CSRF 策略。

> 前端构建时的 `VITE_*` 变量会进入浏览器代码，**不要放任何密钥**。模型密钥、数据库密码、JWT 签名密钥只能放后端。

## 页面

| 端 | 路由 | 页面 |
|---|---|---|
| 入口 | `/` | 角色入口 / 产品介绍 |
| 登录 | `/login` | 4 种身份：学生、家长、教师、管理者 |
| 学生 / 家长 | `/student` | 今天：今日任务、学习节奏、学科状态、项目、成长瞬间 |
| 学生 / 家长 | `/student/map` | 学习地图：知识节点、前后关系、下一步路径 |
| 学生 / 家长 | `/student/tutor` | 学习导师：思考支架、答案锁、回讲 |
| 学生 / 家长 | `/student/analysis` | 学科分析：六维画像、知识点热力、下一步 |
| 学生 / 家长 | `/student/growth` | 项目与成长：作品、徽章、时间线 |
| 学生 | `/student/courses` | AI 课程：推荐课程、视频学习、内容摘要、学习进度 |
| 家长 | `/family` | 家长周报：3+1+2、陪伴建议、使用契约 |
| 家长 | `/family/analysis` | 家长学科分析：趋势、薄弱点、陪伴建议 |
| 家长 | `/family/courses` | AI 课程：家庭教育、亲子复盘、家长学习 |
| 管理者 | `/manager` | 总览：三个关键干预、课时进度、班级热力、学科趋势 |
| 教师 / 管理者 | `/manager/teaching` | 备课与课堂：教案、课堂脉搏、高频迷思 |
| 教师 / 管理者 | `/manager/schedule` | 排课与课时：周课表、学生总数、班级剩余课时 |
| 教师 / 管理者 | `/manager/assignments` | 作业与学情：预批、共性错因、教师终审 |
| 管理者 | `/manager/analysis` | 学科分析：趋势、班级增值、知识点热力、教研建议 |
| 管理者 | `/manager/hours` | 课时统计：学科进度、教师明细、调课/代课、缺口预警 |
| 管理者 | `/manager/resources` | 资源中心：内容营养标签、审核状态 |
| 教师 / 管理者 | `/manager/learning` | AI 课程学习：教师先学，再用于备课 |
| 教师 / 管理者 | `/manager/courses` | 课程管理：管理者发布、下架、设置可见范围 |
| 管理者 | `/manager/teachers` | 教师信息管理：名册、搜索筛选、新增/编辑、状态、课时 |
| 管理者 | `/manager/traffic` | 流量监控：请求、带宽、AI Token、配额、延迟、告警 |

## 后端接入方式

所有页面只依赖 `src/lib/api/index.ts` 暴露的 `api` 对象。

```env
# 本地开发：使用本地数据
VITE_USE_MOCK=true

# 正式环境：切换为真实接口
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://127.0.0.1:8080/api/v1
```

- `src/lib/api/mock.ts`：本地开发数据与模拟延迟。
- `src/lib/api/http.ts`：真实后端适配器，含 Cookie 会话和错误结构。
- `src/lib/api/types.ts`：页面与接口共用的类型定义。
- `src/lib/auth/`：前端登录占位、角色、权限矩阵和路由守卫。
- `docs/api-contract.md`：登录方式、权限矩阵、接口契约、课时口径、AI 流式约定。
- `src/lib/useApi.ts`：统一加载 / 错误状态。

### 登录与权限

- 前端登录：`/login`，4 种身份卡片，使用 `sessionStorage` 保存前端会话。
- 生产登录：**同域 HttpOnly Cookie + 服务端会话**，不使用 localStorage 存 JWT。
- 角色：学生、家长、教师、管理者。
- 管理者拥有全部管理权限：课程发布/下架、可见范围、流量监控、课时与资源管理。
- 教师可查看课程与学情，但不能发布/下架课程。
- 前端菜单和路由按权限过滤；**后端必须再次校验角色、组织和资源范围**。
- 真实登录流程、Cookie 属性、CSRF、接口字段见 [`docs/api-contract.md`](docs/api-contract.md)。

### 已预留接口

```text
GET  /student/dashboard
GET  /student/learning-map
GET  /student/tutor/session
POST /student/tutor/messages
GET  /student/subject-analysis
GET  /student/growth
GET  /family/weekly-report
GET  /family/subject-analysis
GET  /manager/dashboard
GET  /manager/teaching
GET  /manager/assignments
GET  /manager/subject-analysis
GET  /manager/class-hours
GET  /manager/resources
GET  /manager/schedule
GET  /manager/teachers
POST /manager/teachers
PATCH /manager/teachers/:id
PATCH /manager/teachers/:id/status
GET  /courses?audience=student
GET  /manager/courses
POST /manager/courses
PATCH /manager/courses/:id/publish
GET  /manager/traffic
```

## 视觉与交互

- 暖纸色 + 墨蓝 + 青绿 + 琥珀，衬线标题 + 无衬线正文。
- Framer Motion 页面过渡、卡片入场、提示阶梯、进度环。
- 支持 `?static=1` 静态截图模式；系统开启“减少动态效果”时自动进入静态模式。
- 响应式：桌面分组侧边栏 / 平板图标栏 / 手机底部导航 + “更多”抽屉。
- 导航增强：滚动进度条、吸顶工具栏、回到顶部、手机端分组菜单。
- 页面按路由懒加载，首屏 JS 约 133 KB gzip。

## 说明

- 本地开发数据不包含真实学生信息。
- 所有按钮都有交互反馈，但导出、上传、语音回讲、真实对话等需要后端支持。
- 当前登录是**前端身份选择**，正式部署必须接学校统一身份服务。
- 本版本不包含数据库、文件上传、真实模型服务和后端业务实现。
- 已清理旧构建文件与临时隧道；只保留本地运行服务、源码、构建包和截图。
- 当前构建体积：首屏 JS 约 133 KB gzip，CSS 约 15 KB gzip；页面按路由拆分。

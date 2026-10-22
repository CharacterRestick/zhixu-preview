import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, MousePointer2, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { OrbitVisual } from '../components/OrbitVisual'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + index * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Landing() {
  return (
    <div className="zx-landing">
      <div className="zx-landing-ambient" aria-hidden="true" />
      <header className="zx-landing-nav">
        <Brand />
        <nav className="zx-landing-links" aria-label="页面导航">
          <a href="#why">为什么是知序</a>
          <a href="#two-ends">四种身份</a>
          <a href="#handoff">后端准备</a>
        </nav>
        <div className="zx-landing-nav-right">
          <span className="zx-preview-pill"><span /> PREVIEW · MOCK DATA</span>
          <Link to="/login" className="zx-btn zx-btn-dark zx-btn-sm">
            进入预览 <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <main>
        <section className="zx-hero">
          <div className="zx-hero-copy">
            <motion.span className="zx-hero-eyebrow" variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <Sparkles size={14} />
              AI 个性化学习与教学协同平台
            </motion.span>
            <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}>
              让学习
              <br />
              <em>被看见。</em>
            </motion.h1>
            <motion.p className="zx-hero-lead" variants={fadeUp} initial="hidden" animate="show" custom={2}>
              不是又一个题库。知序把每一次学习变成证据，
              <br />
              让学生知道下一步，让老师看见真正要帮的人。
            </motion.p>
            <motion.div className="zx-hero-actions" variants={fadeUp} initial="hidden" animate="show" custom={3}>
              <Link to="/login?next=/student" className="zx-btn zx-btn-primary zx-btn-lg">
                学生 / 家长登录
                <ArrowUpRight size={18} />
              </Link>
              <Link to="/login?next=/manager" className="zx-btn zx-btn-secondary zx-btn-lg">
                教师 / 管理者登录
                <ArrowRight size={17} />
              </Link>
            </motion.div>
            <motion.div className="zx-hero-note" variants={fadeUp} initial="hidden" animate="show" custom={4}>
              <span><MousePointer2 size={13} /> 可点击的真实页面</span>
              <span><ShieldCheck size={13} /> 已预留后端 API 层</span>
            </motion.div>
          </div>
          <motion.div
            className="zx-hero-visual"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <OrbitVisual />
          </motion.div>
        </section>

        <section className="zx-landing-values" id="why">
          {[
            {
              num: '01',
              title: '学生：知道下一步',
              text: '一张会解释的学习地图，一个会克制的 AI 导师。不直接给答案，先给思考的台阶。',
              tone: 'teal',
            },
            {
              num: '02',
              title: '教师：看见干预点',
              text: '不是更多报表，是三个真正需要帮助的学生，和一条可以马上执行的教学动作。',
              tone: 'amber',
            },
            {
              num: '03',
              title: '管理者：看见真实进步',
              text: '看学科结构、看增值、看课时缺口。不排名，不监控，不用使用时长考核。',
              tone: 'blue',
            },
          ].map((item, index) => (
            <motion.article
              className={`zx-value-card tone-${item.tone}`}
              key={item.num}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
            >
              <span className="zx-value-num">{item.num}</span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <span className="zx-value-line" />
            </motion.article>
          ))}
        </section>

        <section className="zx-landing-two-ends" id="two-ends">
          <div>
            <span className="zx-eyebrow">TWO ENDS · ONE EVIDENCE</span>
            <h2>四种身份，<br />同一份学习证据。</h2>
          </div>
          <div className="zx-end-links">
            <Link to="/login?next=/student" className="zx-end-link">
              <div>
                <span>学生 / 家长</span>
                <strong>今天，只做三件事</strong>
              </div>
              <ArrowUpRight size={22} />
            </Link>
            <Link to="/login?next=/manager" className="zx-end-link is-manager">
              <div>
                <span>教师 / 管理者</span>
                <strong>本周，三个关键干预</strong>
              </div>
              <ArrowUpRight size={22} />
            </Link>
          </div>
        </section>

        <section className="zx-landing-handoff" id="handoff">
          <div className="zx-handoff-copy">
            <span className="zx-eyebrow">FRONTEND READY FOR BACKEND</span>
            <h2>页面是预览，<br />接口不是临时拼的。</h2>
            <p>所有数据都通过 <code>src/lib/api</code> 访问。预览读 mock，接后端时切换一个环境变量即可，页面组件不需要改。</p>
          </div>
          <div className="zx-handoff-code" aria-label="前后端切换示例">
            <div className="zx-code-dots"><span /><span /><span /></div>
            <pre>{`# 预览
VITE_USE_MOCK=true

# 接后端
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api/v1`}</pre>
            <div className="zx-code-foot">
              <span>已预留 19 个接口</span>
              <span>Typed API layer</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="zx-landing-footer">
        <Brand />
        <span>知序 · 前端预览 V1.2</span>
        <span>页面内数据为演示，不包含真实学生信息</span>
      </footer>
    </div>
  )
}

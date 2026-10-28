import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Lightbulb, Lock, Mic, RotateCcw, Send, Sparkles, Target } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { PageSkeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { api } from '../../lib/api'
import type { ChatMessage } from '../../lib/api/types'
import { useApi } from '../../lib/useApi'

export function TutorPage() {
  const { data, loading } = useApi(api.getTutorSession)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [hintLevel, setHintLevel] = useState(2)
  const toast = useToast()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (data) setMessages(data.messages)
  }, [data])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, sending])

  if (loading || !data) return <PageSkeleton />

  const send = async (text: string) => {
    if (!text.trim() || sending) return
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((current) => [...current, userMessage])
    setInput('')
    setSending(true)
    try {
      const reply = await api.sendTutorMessage(text, hintLevel)
      setMessages((current) => [...current, reply])
      setHintLevel((level) => Math.min(3, level + 1))
    } finally {
      setSending(false)
    }
  }

  const useHint = (level: number, detail: string) => {
    setHintLevel(level)
    setMessages((current) => [
      ...current,
      {
        id: `hint-${Date.now()}`,
        role: 'ai',
        text: detail,
        hintLevel: level,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    toast(`已展开 L${level} 提示：只给支架，不给最终答案`)
  }

  return (
    <div className="zx-page">
      <PageHeader
        eyebrow="LEARNING TUTOR · 小序"
        title="先说说你的想法。"
        description="小序不会抢走你的思考。它会追问、给提示、等你回讲；练习和测评时，答案锁默认开启。"
        actions={
          <>
            <span className="zx-answer-lock"><Lock size={14} /> 答案锁已开启</span>
            <Button variant="secondary" size="sm" onClick={() => toast('已切换到「一次函数 · 图像平移」练习')}>
              <RotateCcw size={15} /> 换一道
            </Button>
          </>
        }
      />

      <div className="zx-tutor-layout">
        <Card className="zx-chat-card">
          <div className="zx-chat-head">
            <div className="zx-chat-person">
              <span className="zx-spark-badge large"><Sparkles size={18} /></span>
              <div>
                <strong>小序 <span className="zx-online-dot" /></strong>
                <small>学科导师 · 正在陪你学「图像平移」</small>
              </div>
            </div>
            <span className="zx-chat-mode">练习模式</span>
          </div>

          <div className="zx-chat-body">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`zx-message ${message.role === 'user' ? 'is-user' : 'is-ai'}`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {message.role === 'ai' && <span className="zx-message-avatar"><Sparkles size={14} /></span>}
                <div className="zx-message-bubble">
                  {message.hintLevel && <span className="zx-message-hint">提示 L{message.hintLevel}</span>}
                  <p>{message.text}</p>
                  <time>{message.time}</time>
                </div>
              </motion.div>
            ))}
            <AnimatePresence>
              {sending && (
                <motion.div className="zx-message is-ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span className="zx-message-avatar"><Sparkles size={14} /></span>
                  <div className="zx-typing"><span /><span /><span /></div>
                </motion.div>
              )}
            </AnimatePresence>
            {!sending && (
              <motion.div className="zx-chat-scaffold" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <span><Lightbulb size={15} /></span>
                <div>
                  <strong>先不用算</strong>
                  <p>用一句话说说：b 变了，直线的“倾斜”变了吗？</p>
                </div>
              </motion.div>
            )}
            <div ref={endRef} />
          </div>

          <div className="zx-chat-quick">
            {['我还不太明白 b 的作用', '给我一点提示', '我想自己再试试'].map((text) => (
              <button key={text} onClick={() => send(text)}>{text}</button>
            ))}
          </div>

          <div className="zx-composer">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') send(input)
              }}
              placeholder="先说说你的思路，或者问一个具体的问题…"
              aria-label="给小序发消息"
            />
            <button className="zx-composer-mic" onClick={() => toast('语音回讲会在接后端后开放')} aria-label="语音输入"><Mic size={17} /></button>
            <button className="zx-composer-send" onClick={() => send(input)} disabled={sending || !input.trim()} aria-label="发送">
              {input.trim() ? <Send size={17} /> : <ArrowUp size={17} />}
            </button>
          </div>
        </Card>

        <div className="zx-tutor-side">
          <Card className="zx-hint-card">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">THINKING SCAFFOLD</span>
                <h3>思考支架</h3>
              </div>
              <Lightbulb size={18} />
            </div>
            <div className="zx-hint-list">
              {data.hints.map((hint, index) => {
                const level = index + 1
                const active = level <= hintLevel
                return (
                  <button key={hint.level} className={`zx-hint-item ${active ? 'is-active' : ''}`} onClick={() => useHint(level, hint.detail)}>
                    <span className="zx-hint-level">{hint.level}</span>
                    <div>
                      <strong>{hint.title}</strong>
                      <small>{hint.detail}</small>
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="zx-hint-foot">L4 示范只在提交后或教师解锁时出现。</p>
          </Card>

          <Card className="zx-recall-card">
            <span className="zx-eyebrow">TEACH BACK</span>
            <h3>讲一遍，才是真的会。</h3>
            <p>用 30–60 秒讲讲：b 变了，什么没变？</p>
            <button className="zx-recall-btn" onClick={() => toast('回讲录音会在接后端后开放')}>
              <span><Mic size={19} /></span>
              开始回讲
            </button>
          </Card>

          <Card className="zx-goal-card">
            <div className="zx-card-head compact">
              <div>
                <span className="zx-eyebrow">GOAL</span>
                <h3>本页目标</h3>
              </div>
              <Target size={18} />
            </div>
            <p>{data.goal}</p>
            <div className="zx-goal-checks">
              <span className="is-done">能说出 k 的作用</span>
              <span>能解释 b 的平移</span>
              <span>能完成一道变式</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

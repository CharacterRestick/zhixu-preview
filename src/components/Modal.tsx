import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="zx-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.div
            className={`zx-modal ${wide ? 'is-wide' : ''}`}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="zx-modal-head">
              <div>
                {eyebrow && <span className="zx-eyebrow">{eyebrow}</span>}
                <h2>{title}</h2>
              </div>
              <button className="zx-icon-btn" onClick={onClose} aria-label="关闭">
                <X size={18} />
              </button>
            </div>
            <div className="zx-modal-body">{children}</div>
            {footer && <div className="zx-modal-foot">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

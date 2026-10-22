import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type ToastItem = { id: number; message: string }

const ToastContext = createContext<(message: string) => void>(() => undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setItems((current) => [...current, { id, message }])
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id))
    }, 2600)
  }, [])

  const value = useMemo(() => toast, [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="zx-toast-stack" aria-live="polite">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="zx-toast"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            >
              <CheckCircle2 size={16} />
              {item.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

import type { HTMLAttributes, ReactNode } from 'react'

export function Card({ children, className = '', ...rest }: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section className={`zx-card ${className}`} {...rest}>
      {children}
    </section>
  )
}

export function CardHead({
  eyebrow,
  title,
  detail,
  action,
}: {
  eyebrow?: string
  title: string
  detail?: string
  action?: ReactNode
}) {
  return (
    <div className="zx-card-head">
      <div>
        {eyebrow && <span className="zx-eyebrow">{eyebrow}</span>}
        <h3>{title}</h3>
        {detail && <p>{detail}</p>}
      </div>
      {action && <div className="zx-card-action">{action}</div>}
    </div>
  )
}

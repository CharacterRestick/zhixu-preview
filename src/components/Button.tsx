import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
}

export function Button({ variant = 'primary', size = 'md', icon, className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={`zx-btn zx-btn-${variant} zx-btn-${size} ${className}`} {...rest}>
      {children}
      {icon && <span className="zx-btn-icon">{icon}</span>}
    </button>
  )
}

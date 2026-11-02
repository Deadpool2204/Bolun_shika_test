import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { ArrowRight, FileQuestion, LoaderCircle } from 'lucide-react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'soft' }

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>
}

export function SectionTitle({ title, link, onLink }: { title: string; link?: string; onLink?: () => void }) {
  return <div className="section-title"><h2>{title}</h2>{link && <button className="text-link" onClick={onLink}>{link}<ArrowRight size={14} /></button>}</div>
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty-state"><div className="empty-icon"><FileQuestion size={22} /></div><strong>{title}</strong><p>{text}</p></div>
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return <div className="loading-state"><LoaderCircle size={18} className="spin" />{label}</div>
}

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`card ${className}`}>{children}</section>
}

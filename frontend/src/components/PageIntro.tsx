import type { ReactNode } from 'react'

interface PageIntroProps {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}

export function PageIntro({ eyebrow, title, description, action }: PageIntroProps) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  )
}

import type { ReactNode } from 'react'

interface PageIntroProps {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}

export function PageIntro({ eyebrow, title, description, action }: PageIntroProps) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end sm:gap-6">
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-4 sm:text-base sm:leading-7">{description}</p>
      </div>
      {action ? <div className="w-full sm:w-auto">{action}</div> : null}
    </div>
  )
}

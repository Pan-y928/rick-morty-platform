import { PageIntro } from '../components/PageIntro'
import { useAuth } from '../auth/auth'

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <>
      <PageIntro eyebrow="Account" title="My profile" description="Your account details are protected and visible only after login." />
      <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-7">
        {[['Name', user?.name], ['Username', user?.username], ['Email', user?.email]].map(([label, value]) => (
          <div key={label} className="border-b border-white/10 py-5 first:pt-0 last:border-0 last:pb-0"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p><p className="mt-2 font-bold text-white">{value}</p></div>
        ))}
      </div>
    </>
  )
}

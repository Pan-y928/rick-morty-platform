import { useMemo, useState, type PropsWithChildren } from 'react'
import { AuthContext, type AuthContextValue, type DemoUser } from './auth'

const DEMO_USER: DemoUser = {
  name: 'Morty Smith',
  username: 'morty',
  email: 'morty@smith.family',
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<DemoUser | null>(() =>
    localStorage.getItem('demo-authenticated') === 'true' ? DEMO_USER : null,
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: () => {
        localStorage.setItem('demo-authenticated', 'true')
        setUser(DEMO_USER)
      },
      logout: () => {
        localStorage.removeItem('demo-authenticated')
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

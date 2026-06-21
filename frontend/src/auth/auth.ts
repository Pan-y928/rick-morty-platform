import { createContext, useContext } from 'react'

export interface DemoUser {
  name: string
  username: string
  email: string
}

export interface AuthContextValue {
  user: DemoUser | null
  login: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

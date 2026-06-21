import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'

const authState = vi.hoisted(() => ({
  user: null as { name: string } | null,
  isInitializing: false,
}))

vi.mock('../features/auth/hooks/useCurrentUser', () => ({
  useCurrentUser: () => authState,
}))

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/" element={<div>Login page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<div>Protected content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    authState.user = null
    authState.isInitializing = false
  })

  it('shows a session loader while authentication is initializing', () => {
    authState.isInitializing = true

    renderProtectedRoute()

    expect(screen.getByLabelText('Restoring session')).toBeInTheDocument()
  })

  it('redirects anonymous users to login', () => {
    renderProtectedRoute()

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('renders protected content for authenticated users', () => {
    authState.user = { name: 'Rick Sanchez' }

    renderProtectedRoute()

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })
})

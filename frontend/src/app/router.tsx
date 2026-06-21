import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { CharacterDetailsPage } from '../pages/CharacterDetailsPage'
import { CharactersPage } from '../pages/CharactersPage'
import { FavoritesPage } from '../pages/FavoritesPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RegistrationPage } from '../pages/RegistrationPage'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/', element: <LoginPage /> },
      { path: '/registration', element: <RegistrationPage /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/characters', element: <CharactersPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/characters/:id', element: <CharacterDetailsPage /> },
          { path: '/user/profile', element: <ProfilePage /> },
          { path: '/user/characters', element: <FavoritesPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

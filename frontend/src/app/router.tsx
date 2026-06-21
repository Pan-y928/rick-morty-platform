import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import {
  CharacterDetailsPage,
  CharactersPage,
  FavoritesPage,
  LoginPage,
  NotFoundPage,
  ProfilePage,
  RegistrationPage,
} from './lazyPages'

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

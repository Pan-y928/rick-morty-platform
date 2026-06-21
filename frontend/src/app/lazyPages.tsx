import { lazy } from 'react'

export const LoginPage = lazy(() =>
  import('../pages/LoginPage').then((module) => ({ default: module.LoginPage })),
)
export const RegistrationPage = lazy(() =>
  import('../pages/RegistrationPage').then((module) => ({
    default: module.RegistrationPage,
  })),
)
export const CharactersPage = lazy(() =>
  import('../pages/CharactersPage').then((module) => ({
    default: module.CharactersPage,
  })),
)
export const CharacterDetailsPage = lazy(() =>
  import('../pages/CharacterDetailsPage').then((module) => ({
    default: module.CharacterDetailsPage,
  })),
)
export const FavoritesPage = lazy(() =>
  import('../pages/FavoritesPage').then((module) => ({
    default: module.FavoritesPage,
  })),
)
export const ProfilePage = lazy(() =>
  import('../pages/ProfilePage').then((module) => ({
    default: module.ProfilePage,
  })),
)
export const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
)

const ACCESS_TOKEN_KEY = 'rickverse-access-token'

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

export const tokenStorage = {
  get: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  set: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  clear: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
}

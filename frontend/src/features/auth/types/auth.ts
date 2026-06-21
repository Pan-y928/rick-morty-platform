export interface AuthUser {
  id: string
  name: string
  username: string
  email: string
  createdAtUtc: string
}

export interface AuthResponse {
  accessToken: string
  expiresAtUtc: string
  user: AuthUser
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  name: string
  username: string
  email: string
  password: string
}

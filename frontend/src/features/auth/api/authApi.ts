import { apiClient } from '../../../lib/apiClient'
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../types/auth'

export async function login(request: LoginRequest) {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', request)
  return data
}

export async function register(request: RegisterRequest) {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', request)
  return data
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<AuthUser>('/users/me')
  return data
}

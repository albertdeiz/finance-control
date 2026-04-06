import { api } from '@/lib/api'
import type { AuthResponse, LoginDTO, RegisterDTO, User } from '@finance/types'

export const authApi = {
  register: (data: RegisterDTO) => api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
  login: (data: LoginDTO) => api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  me: () => api.get<User>('/auth/me').then((r) => r.data),
}

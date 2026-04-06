export interface User {
  id: string
  email: string
  createdAt: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: { id: string; email: string }
}

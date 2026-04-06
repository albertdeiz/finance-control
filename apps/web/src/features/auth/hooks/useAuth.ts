import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { api } from '@/lib/api'

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    retry: false,
    enabled: !!localStorage.getItem('token'),
  })
}

export function useLogin() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      qc.invalidateQueries()
      navigate('/dashboard')
    },
  })
}

export function useRegister() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      qc.invalidateQueries()
      navigate('/dashboard')
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  return () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    qc.clear()
    navigate('/login')
  }
}

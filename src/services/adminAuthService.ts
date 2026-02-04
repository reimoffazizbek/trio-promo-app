import { apiClient } from './GlobalVar'
import type { ApiResponse, AuthPayload } from '../types/api'

export type AdminLoginPayload = {
  phoneNumber: string
  password: string
}

export const adminAuthService = {
  async login(payload: AdminLoginPayload) {
    const response = await apiClient.post<ApiResponse<AuthPayload>>('/auth/login', payload)
    return response.data
  },
}

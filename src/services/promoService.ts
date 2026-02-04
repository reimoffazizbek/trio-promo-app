import { apiClient } from './GlobalVar'
import type {
  ApiResponse,
  PagedResponse,
  PromoCodeItem,
  PromoRegistrationPayload,
  PromoRegistrationResult,
  PromoStats,
} from '../types/api'

export const promoService = {
  async registerPromo(payload: PromoRegistrationPayload) {
    const response = await apiClient.post<ApiResponse<PromoRegistrationResult>>('/promo/registration', payload)
    return response.data
  },
  async getStats() {
    const response = await apiClient.get<ApiResponse<PromoStats>>('/promo/get-stats')
    return response.data
  },
  async findAll(params: { page: number; size: number; search?: string }) {
    const response = await apiClient.get<ApiResponse<PagedResponse<PromoCodeItem>>>('/promo/find-all', { params })
    return response.data
  },
}

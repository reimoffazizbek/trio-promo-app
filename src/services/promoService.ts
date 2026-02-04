import { apiClient } from './GlobalVar'
import type { ApiResponse, PromoRegistrationPayload, PromoRegistrationResult } from '../types/api'

export const promoService = {
  async registerPromo(payload: PromoRegistrationPayload) {
    const response = await apiClient.post<ApiResponse<PromoRegistrationResult>>('/promo/register', payload)
    return response.data
  },
}

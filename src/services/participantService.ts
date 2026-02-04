import { apiClient } from './GlobalVar'
import type { ApiResponse, PagedResponse, ParticipantItem, ParticipantStats } from '../types/api'

export const participantService = {
  async getStats() {
    const response = await apiClient.get<ApiResponse<ParticipantStats>>('/participant/get-stats')
    return response.data
  },
  async findAll(params: { page: number; size: number; search?: string }) {
    const response = await apiClient.get<ApiResponse<PagedResponse<ParticipantItem>>>('/participant/find-all', { params })
    return response.data
  },
}

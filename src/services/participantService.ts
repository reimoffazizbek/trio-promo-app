import { apiClient } from './GlobalVar'
import type { ApiResponse, PagedResponse, ParticipantItem, ParticipantStats, TopParticipant } from '../types/api'

export const participantService = {
  async getStats() {
    const response = await apiClient.get<ApiResponse<ParticipantStats>>('/participant/get-stats')
    return response.data
  },
  async findAll(params: { page: number; size: number; search?: string | null }) {
    const response = await apiClient.get<ApiResponse<PagedResponse<ParticipantItem>>>('/participant/find-all', { params })
    return response.data
  },
  async findTopParticipants() {
    const response = await apiClient.get<ApiResponse<TopParticipant[]>>('/participant/find-top-participant')
    return response.data
  },
}

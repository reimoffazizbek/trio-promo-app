import { useAuthStore } from '../stores/auth'
import type { AuthResponse } from '../types/api'

export const authService = {
  setSession(response: AuthResponse) {
    const store = useAuthStore()
    store.setAuthResponse(response)
  },
  clearSession() {
    const store = useAuthStore()
    store.clearAuth()
  },
}

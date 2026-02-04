import { defineStore } from 'pinia'
import type { AuthResponse } from '../types/api'

const STORAGE_KEY = 'trio-promo-auth'

const loadStoredAuth = (): AuthResponse | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return null
    }
    return JSON.parse(stored) as AuthResponse
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authResponse: loadStoredAuth(),
  }),
  getters: {
    accessToken: (state) => state.authResponse?.data?.token?.accessToken ?? null,
  },
  actions: {
    setAuthResponse(response: AuthResponse) {
      this.authResponse = response
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(response))
    },
    clearAuth() {
      this.authResponse = null
      window.localStorage.removeItem(STORAGE_KEY)
    },
  },
})

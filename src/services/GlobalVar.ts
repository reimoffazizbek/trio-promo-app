import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { useAuthStore } from '../stores/auth'
import type { ApiErrorResponse, ApiResponse } from '../types/api'

export type ApiResponseError = Error & {
  payload?: ApiErrorResponse | ApiResponse<unknown>
}

const resolveMessageFromPayload = (payload?: ApiErrorResponse | ApiResponse<unknown>) => {
  if (!payload) {
    return null
  }

  const errorPayload = payload as ApiErrorResponse
  if (errorPayload.data && typeof errorPayload.data === 'object' && 'errorMsg' in errorPayload.data) {
    return errorPayload.data.errorMsg
  }

  return payload.message ?? null
}

const createApiError = (payload?: ApiErrorResponse | ApiResponse<unknown>) => {
  const message = resolveMessageFromPayload(payload) ?? "Server bilan bog'lanishda xatolik yuz berdi."
  const error = new Error(message) as ApiResponseError
  error.payload = payload
  return error
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ?? 'https://api-promo.mytrio.uz',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = authStore.accessToken

  if (token) {
    const headers = config.headers ?? {}
    headers.Authorization = `Bearer ${token}`
    config.headers = headers
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResponse<unknown> | undefined

    if (payload && payload.success === false) {
      return Promise.reject(createApiError(payload))
    }

    return response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const payload = error.response?.data
    return Promise.reject(createApiError(payload))
  },
)

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return "Server bilan bog'lanishda xatolik yuz berdi."
}

export function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(date.getDate());
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}

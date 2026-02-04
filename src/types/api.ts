export type ApiResponse<T> = {
  success: boolean
  message?: string
  auditing?: string
  data: T
}

export type ApiErrorData = {
  errorMsg: string
  errorCode: number
  errorPath: string
}

export type ApiErrorResponse = {
  success: boolean
  auditing: string
  message?: string
  data: ApiErrorData
}

export type AuthPayload = {
  user: {
    id: number
    firstName: string
    lastName: string
    phoneNumber: string
    role: 'ADMIN' | 'USER' | string
  }
  token: {
    accessToken: string
    accessTokenExpire: number
    refreshToken: string
    refreshTokenExpire: number
  }
}

export type AuthResponse = ApiResponse<AuthPayload>

export type PromoRegistrationPayload = {
  firstName: string
  lastName: string
  phoneNumber: string
  promoCode: string
}

export type PromoRegistrationResult = {
  id?: number
  status?: string
}

export type PromoStats = {
  totalActivePromoCodes: number
  totalUsedPromoCodes: number
}

export type PromoCodeItem = {
  id: number
  code: string
  used: boolean
}

export type ParticipantStats = {
  totalRegistration: number
  totalParticipant: number
}

export type ParticipantItem = {
  id: number
  fullName: string
  phoneNumber: string
  promoCode: string
  createdAt?: string
  createdDate?: string
}

export type TopParticipant = {
  id: number
  fullName: string
  phoneNumber: string
  totalRegistrationCount: number
}

export type PagedResponse<T> = {
  totalPages: number
  totalElements: number
  size: number
  content: T[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

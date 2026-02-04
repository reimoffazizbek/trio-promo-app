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

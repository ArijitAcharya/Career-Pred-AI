import apiClient from './apiClient'

export const authApi = {
  register(payload) {
    return apiClient.post('/accounts/register/', payload)
  },
  login(payload) {
    // Send email as username for our custom JWT serializer
    return apiClient.post('/accounts/token/', { username: payload.email, password: payload.password })
  },
  refreshToken(refreshToken) {
    return apiClient.post('/accounts/token/refresh/', { refresh: refreshToken })
  },
  googleLogin(payload) {
    return apiClient.post('/accounts/google/', payload)
  },
  me() {
    return apiClient.get('/accounts/me/')
  },
  meUpdate(payload) {
    return apiClient.patch('/accounts/me/', payload)
  },
  logout(payload) {
    return apiClient.post('/accounts/logout/', payload)
  },
  requestPasswordReset(payload) {
    return apiClient.post('/accounts/auth/request-reset/', payload)
  },
  resetPasswordWithToken(payload) {
    return apiClient.post('/accounts/auth/reset-password/', payload)
  },
  resetPasswordWithOTP(payload) {
    return apiClient.post('/accounts/auth/verify-otp/', payload)
  },
}

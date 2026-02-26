import apiClient from './apiClient'

export const analyticsApi = {
  overview() {
    return apiClient.get('/analytics/overview/')
  },
  getOverview() {
    return apiClient.get('/analytics/overview/')
  },
  roles() {
    return apiClient.get('/analytics/roles/')
  },
  monthly(months = 6) {
    return apiClient.get('/analytics/monthly/', { params: { months } })
  },
  users() {
    return apiClient.get('/analytics/users/')
  },
}

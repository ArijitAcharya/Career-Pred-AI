import apiClient from './apiClient'

export const notificationsApi = {
  list() {
    return apiClient.get('/notifications/')
  },
  markRead(id) {
    return apiClient.post(`/notifications/${id}/read/`)
  },
}

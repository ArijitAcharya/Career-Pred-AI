import apiClient from './apiClient'

export const predictionsApi = {
  predictSkills(payload) {
    return apiClient.post('/predictions/skills/', payload)
  },
  uploadResume(file) {
    const form = new FormData()
    form.append('resume', file)
    return apiClient.post('/predictions/resume/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  history() {
    return apiClient.get('/predictions/history/')
  },
  getHistory() {
    return apiClient.get('/predictions/history/')
  },
  getAllHistory() {
    return apiClient.get('/predictions/all-history/')
  },
}

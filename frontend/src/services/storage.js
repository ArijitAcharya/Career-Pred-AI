const ACCESS_KEY = 'cpai_access'
const REFRESH_KEY = 'cpai_refresh'

export const tokenStorage = {
  getAccess() {
    return localStorage.getItem(ACCESS_KEY)
  },
  setAccess(token) {
    if (!token) localStorage.removeItem(ACCESS_KEY)
    else localStorage.setItem(ACCESS_KEY, token)
  },
  getRefresh() {
    return localStorage.getItem(REFRESH_KEY)
  },
  setRefresh(token) {
    if (!token) localStorage.removeItem(REFRESH_KEY)
    else localStorage.setItem(REFRESH_KEY, token)
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

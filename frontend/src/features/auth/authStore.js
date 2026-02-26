import { tokenStorage } from '../../services/storage'

export const authStore = {
  getAccess: tokenStorage.getAccess,
  setTokens({ access, refresh }) {
    tokenStorage.setAccess(access)
    tokenStorage.setRefresh(refresh)
  },
  clear() {
    tokenStorage.clear()
  },
}

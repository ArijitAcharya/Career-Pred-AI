import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/authApi'
import { authStore } from '../features/auth/authStore'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Silent refresh on app load
  useEffect(() => {
    async function initializeAuth() {
      try {
        const refresh = authStore.getAccess ? authStore.getAccess() : null
        
        if (!refresh) {
          setLoading(false)
          return
        }

        // Attempt to get user data with existing token
        try {
          const response = await authApi.me()
          setUser(response.data)
          setIsAuthenticated(true)
        } catch (error) {
          // Token is invalid, try refresh
          if (error.response?.status === 401) {
            try {
              const refreshResponse = await authApi.refreshToken(refresh)
              const { access, refresh: newRefresh } = refreshResponse.data
              
              authStore.setTokens({ access, refresh: newRefresh })
              
              // Retry getting user data
              const userResponse = await authApi.me()
              setUser(userResponse.data)
              setIsAuthenticated(true)
            } catch (refreshError) {
              // Refresh failed, clear tokens
              authStore.clear()
              setIsAuthenticated(false)
              setUser(null)
            }
          } else {
            // Other error, clear tokens
            authStore.clear()
            setIsAuthenticated(false)
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        authStore.clear()
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    setLoading(true)
    try {
      const response = await authApi.login(credentials)
      const { access, refresh } = response.data
      
      authStore.setTokens({ access, refresh })
      setUser(response.data.user || { email: credentials.email })
      setIsAuthenticated(true)
      
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async (googleData) => {
    setLoading(true)
    try {
      const response = await authApi.googleLogin(googleData)
      const { access, refresh, user } = response.data
      
      authStore.setTokens({ access, refresh })
      setUser(user || { email: googleData.email })
      setIsAuthenticated(true)
      
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.detail || error.response?.data?.message || 'Google login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout({})
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      authStore.clear()
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully')
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    googleLogin,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

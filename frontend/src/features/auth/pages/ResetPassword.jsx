import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle, Eye, EyeOff, Lock, Shield } from 'lucide-react'

import { authApi } from '../../../services/authApi'

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Check if token exists
  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link')
      navigate('/forgot-password')
    }
  }, [token, navigate])

  // Password strength checker
  useEffect(() => {
    let strength = 0
    if (newPassword.length >= 8) strength += 25
    if (/[a-z]/.test(newPassword)) strength += 25
    if (/[A-Z]/.test(newPassword)) strength += 25
    if (/[0-9]/.test(newPassword)) strength += 25
    setPasswordStrength(strength)
  }, [newPassword])

  function getPasswordStrengthColor() {
    if (passwordStrength < 50) return 'bg-red-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  function getPasswordStrengthText() {
    if (passwordStrength < 50) return 'Weak'
    if (passwordStrength < 75) return 'Medium'
    return 'Strong'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (passwordStrength < 50) {
      toast.error('Password is too weak. Please choose a stronger password.')
      return
    }
    
    setLoading(true)
    try {
      await authApi.resetPasswordWithToken({ token, new_password: newPassword })
      toast.success('Password reset successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      toast.error('Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Enter your new password below
          </p>
        </div>

        {/* Reset Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className={`relative transition-all duration-200 ${isFocused === 'password' ? 'scale-105' : ''}`}>
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isFocused === 'password' ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 border rounded-xl transition-all duration-200 ${
                  isFocused === 'password' 
                    ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setIsFocused('password')}
                onBlur={() => setIsFocused('')}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength < 50 ? 'text-red-600' : 
                    passwordStrength < 75 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className={`relative transition-all duration-200 ${isFocused === 'confirm' ? 'scale-105' : ''}`}>
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isFocused === 'confirm' ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 border rounded-xl transition-all duration-200 ${
                  isFocused === 'confirm' 
                    ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setIsFocused('confirm')}
                onBlur={() => setIsFocused('')}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Password Requirements:</strong>
                <ul className="mt-2 space-y-1 text-xs">
                  <li className={newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    ✓ At least 8 characters
                  </li>
                  <li className={/[a-z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    ✓ Contains lowercase letter
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    ✓ Contains uppercase letter
                  </li>
                  <li className={/[0-9]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    ✓ Contains number
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resetting Password...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Reset Password
                <CheckCircle className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          Remember your password?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors bg-transparent border-none cursor-pointer"
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  )
}

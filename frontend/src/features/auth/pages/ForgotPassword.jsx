import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, Shield, Key } from 'lucide-react'

import { authApi } from '../../../services/authApi'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState('token') // 'token' or 'otp'
  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      await authApi.requestPasswordReset({ email, method })
      toast.success('If an account exists, reset instructions have been sent to your email.')
      
      // Redirect based on method
      if (method === 'token') {
        navigate('/login')
      } else {
        navigate('/reset-password-otp')
      }
    } catch (err) {
      toast.error('Failed to send reset instructions. Please try again.')
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
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Choose how you'd like to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className={`relative transition-all duration-200 ${isFocused === 'email' ? 'scale-105' : ''}`}>
              <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isFocused === 'email' ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <input
                type="email"
                className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border rounded-xl transition-all duration-200 ${
                  isFocused === 'email' 
                    ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused('')}
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          {/* Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Reset Method
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group p-4 border rounded-xl transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                <input
                  type="radio"
                  name="method"
                  value="token"
                  checked={method === 'token'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Secure Link</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Receive a secure reset link via email (15 minutes expiry)
                  </div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group p-4 border rounded-xl transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                <input
                  type="radio"
                  name="method"
                  value="otp"
                  checked={method === 'otp'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">One-Time Password</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Receive a 6-digit OTP via email (10 minutes expiry)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Send Reset Instructions
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Security Notice:</strong> For your protection, we don't reveal whether an email address is registered in our system.
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          Remember your password?{' '}
          <Link 
            to="/login" 
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}

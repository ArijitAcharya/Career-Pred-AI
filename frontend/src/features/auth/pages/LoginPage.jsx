import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Brain, TrendingUp, Users, Shield, CheckCircle, ArrowRight, X, Mail, Lock, Eye, EyeOff } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import { GoogleButton } from '../../../components/ui/GoogleButton'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, googleLogin, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState('')

  const from = location.state?.from?.pathname || '/app'

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (response) => {
    console.log('Google OAuth success response:', response)
    try {
      const result = await googleLogin({ token: response.credential })
      console.log('Backend login result:', result)
      if (result.access && result.refresh) {
        toast.success('Welcome back!')
        navigate(from, { replace: true })
      } else {
        toast.error('Google login failed')
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Google login failed')
    }
  }

  const handleGoogleError = (error) => {
    console.log('Google OAuth error:', error)
    // The GoogleButton component already handles the error messages
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 dark:from-black dark:via-gray-950 dark:to-black">
      {/* Left Panel - Dark Purple Theme */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-900/90 via-indigo-900/50 to-violet-900/50 dark:from-purple-950/90 dark:via-indigo-950/50 dark:to-violet-950/50 border-r border-purple-800 dark:border-purple-900 p-8 flex flex-col justify-center relative overflow-hidden">
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-20 dark:opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/40 to-violet-600/40 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/40 to-purple-600/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-violet-600/30 to-purple-600/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-lg mx-auto relative z-10">
          {/* Enhanced Logo */}
          <div className="flex items-center gap-3 mb-6 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 dark:from-purple-400 dark:to-violet-500 rounded-lg flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-purple-500/50">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-purple-400 dark:group-hover:text-purple-300 transition-colors duration-300">Career AI</span>
          </div>

          {/* Enhanced Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight">
                Transform Your Career Journey
              </h1>
              <p className="text-purple-200 dark:text-purple-300 text-base leading-relaxed">
                Advanced AI-powered career intelligence platform designed to predict opportunities, guide decisions, and accelerate your professional growth.
              </p>
            </div>

            {/* Professional Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-900/30 dark:hover:bg-purple-800/30 transition-all duration-300 cursor-pointer group border border-purple-800/30 dark:border-purple-900/30">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 dark:from-purple-400 dark:to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-4 h-4 text-purple-200 dark:text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm group-hover:text-purple-300 dark:group-hover:text-purple-200 transition-colors">Predictive Analytics</h3>
                  <p className="text-purple-300 dark:text-purple-400 text-xs">Machine learning algorithms analyze market trends and predict optimal career paths</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-900/30 dark:hover:bg-violet-800/30 transition-all duration-300 cursor-pointer group border border-violet-800/30 dark:border-violet-900/30">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-4 h-4 text-violet-200 dark:text-violet-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm group-hover:text-violet-300 dark:group-hover:text-violet-200 transition-colors">Career Roadmapping</h3>
                  <p className="text-violet-300 dark:text-violet-400 text-xs">Personalized development plans with milestone tracking and skill gap analysis</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-900/30 dark:hover:bg-indigo-800/30 transition-all duration-300 cursor-pointer group border border-indigo-800/30 dark:border-indigo-900/30">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-4 h-4 text-indigo-200 dark:text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm group-hover:text-indigo-300 dark:group-hover:text-indigo-200 transition-colors">Enterprise Security</h3>
                  <p className="text-indigo-300 dark:text-indigo-400 text-xs">SOC 2 Type II certified with end-to-end encryption and GDPR compliance</p>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-800 dark:border-purple-900">
              <div className="text-center group cursor-pointer">
                <div className="text-2xl font-bold text-white group-hover:text-purple-400 dark:group-hover:text-purple-300 transition-colors duration-300">10K+</div>
                <div className="text-xs text-purple-300 dark:text-purple-400 group-hover:text-purple-400 dark:group-hover:text-purple-300 transition-colors duration-300">Professionals</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-2xl font-bold text-white group-hover:text-violet-400 dark:group-hover:text-violet-300 transition-colors duration-300">98.5%</div>
                <div className="text-xs text-purple-300 dark:text-purple-400 group-hover:text-violet-400 dark:group-hover:text-violet-300 transition-colors duration-300">Success Rate</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-2xl font-bold text-white group-hover:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors duration-300">24/7</div>
                <div className="text-xs text-purple-300 dark:text-purple-400 group-hover:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors duration-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Light Purple Theme */}
      <div className="w-full lg:w-1/2 xl:max-w-lg flex items-center justify-center p-8 bg-gradient-to-br from-purple-100 via-violet-50 to-purple-100 dark:from-purple-900/50 dark:via-violet-900/50 dark:to-purple-900/50">
        <div className="w-full max-w-sm">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-purple-200 dark:border-purple-800 p-6 relative overflow-hidden">
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 dark:from-purple-600/20 dark:to-violet-600/20 rounded-2xl" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-violet-400/20 dark:from-purple-600/30 dark:to-violet-600/30 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 dark:from-violet-600/30 dark:to-indigo-600/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 dark:from-purple-600 dark:to-violet-700 rounded-xl mb-3 shadow-lg shadow-purple-500/30">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Welcome Back</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to continue your journey</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                {/* Enhanced Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 transform -translate-y-1/2 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors duration-200" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused('email')}
                      onBlur={() => setIsFocused('')}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
                        isFocused === 'email' 
                          ? 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/20 dark:ring-purple-400/20 shadow-lg shadow-purple-500/20 dark:shadow-purple-400/20 bg-purple-50/50 dark:bg-purple-900/30' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20`}
                      placeholder="name@company.com"
                      disabled={loading}
                    />
                    {isFocused === 'email' && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 transform -translate-y-1/2 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors duration-200" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFocused('password')}
                      onBlur={() => setIsFocused('')}
                      className={`w-full pl-9 pr-9 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
                        isFocused === 'password' 
                          ? 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/20 dark:ring-purple-400/20 shadow-lg shadow-purple-500/20 dark:shadow-purple-400/20 bg-purple-50/50 dark:bg-purple-900/30' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20`}
                      placeholder="Enter password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Enhanced Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-purple-600 dark:text-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 group-hover:border-purple-500 dark:group-hover:border-purple-400 transition-colors duration-200"
                    />
                    <span className="ml-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">Remember me</span>
                  </label>
                </div>

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600 dark:from-purple-600 dark:to-violet-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:from-purple-600 hover:to-violet-700 dark:hover:from-purple-700 dark:hover:to-violet-800 hover:shadow-lg hover:shadow-purple-500/30 dark:hover:shadow-purple-400/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-600 dark:from-violet-500 dark:to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Enhanced Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px bg-gradient-to-r from-gray-300 dark:from-gray-600 to-gray-400 dark:to-gray-500 flex-1" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Or continue with</span>
                <div className="h-px bg-gradient-to-r from-gray-400 dark:from-gray-500 to-gray-300 dark:to-gray-600 flex-1" />
              </div>

              {/* Enhanced Google OAuth Button */}
              <GoogleButton 
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />

              {/* Enhanced Links */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-200 dark:border-purple-800">
                <Link to="/forgot-password" className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-all duration-300">
                  Forgot password?
                </Link>
                <Link className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-all duration-300" to="/register">
                  Create account
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300">
              © 2026 Career AI • <span className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors duration-300">Privacy</span> • <span className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors duration-300">Terms</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

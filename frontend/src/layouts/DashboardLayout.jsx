import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Menu, X, LogOut, LayoutDashboard, BarChart3, UserCircle, ShieldAlert, Brain, TrendingUp, ChevronRight, User } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { NotificationsWidget } from '../features/notifications/NotificationsWidget'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { authApi } from '../services/authApi'

const navItems = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/history', label: 'History', icon: ShieldAlert },
  { to: '/app/profile', label: 'Profile', icon: UserCircle },
]

export function DashboardLayout() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [me, setMe] = useState(null)

  async function loadMe() {
    try {
      const res = await authApi.me()
      setMe(res.data)
    } catch (e) {
      // silent
    }
  }

  function onLogout() {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/80 dark:bg-gray-900/80 supports-backdrop-blur:bg-white/60 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/app" className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-3 tracking-tight group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Brain className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold">Career Predictor AI</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">Smarter Career Decisions</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <NotificationsWidget />

            <div className="relative hidden sm:block" data-profile-root>
              <button
                type="button"
                onClick={async () => {
                  if (!me) await loadMe()
                  setProfileOpen((v) => !v)
                }}
                aria-label="Profile menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:scale-105 dark:border-slate-700/60 dark:bg-gray-900/40 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-gray-900 dark:hover:shadow-xl group"
              >
                {me?.email || me?.username ? (
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-all duration-300">
                    {me.email.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-3xl border border-slate-200/60 bg-white/98 shadow-2xl shadow-slate-900/20 overflow-hidden dark:border-slate-700/40 dark:bg-gray-900/98 backdrop-blur-2xl animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/40 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-blue-950/20">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {me?.email ? me.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Signed in as</div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={me?.email || me?.username || ''}>
                          {me?.email || me?.username || '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false)
                        onLogout()
                      }}
                      className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Navigation */}
          <aside
            className={`
              transition-all duration-300 ease-in-out z-30
              ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
              ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}
              absolute lg:static top-16 left-0 right-0 bg-white/90 dark:bg-gray-900/90 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-4 lg:p-0 border-b border-slate-200 dark:border-gray-800 lg:border-none shadow-lg lg:shadow-none
            `}
          >
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-indigo-600 text-white rounded-full items-center justify-center shadow-lg hover:bg-indigo-700 transition-all duration-200"
            >
              <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>

            <nav className="space-y-2 flex flex-col">
              {/* Logo Section for Desktop */}
              <div className={`hidden lg:flex items-center gap-3 mb-6 p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Career AI</div>
                    <div className="text-xs opacity-90">Predictions</div>
                  </div>
                )}
              </div>

              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/app'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200/50 dark:shadow-none'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    {/* Active State Indicator */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isSidebarCollapsed ? 'w-6 h-6' : ''}`} />
                    
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                      </>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isSidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                )
              })}

              <div className="flex-1" />
              
              {/* Mobile Logout */}
              <button
                onClick={onLogout}
                className="lg:hidden flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 mt-4"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
            <div className="animate-fadeIn">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

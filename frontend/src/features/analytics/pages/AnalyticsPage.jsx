import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, TrendingUp, Users, Target, BarChart3, TrendingDown } from 'lucide-react'

import { analyticsApi } from '../../../services/analyticsApi'
import { useTheme } from '../../../context/ThemeContext'
import { ROLE_CATEGORIES, getRoleCategory, TECHNICAL_ROLES, NON_TECHNICAL_ROLES } from '../../../constants/roles'

const COLORS = ['#6366f1', '#3b82f6', '#0ea5e9', '#14b8a6', '#10b981', '#f59e0b', '#ef4444', '#f97316', '#eab308']

export function AnalyticsPage() {
  const [roles, setRoles] = useState([])
  const [monthly, setMonthly] = useState({ months: [], counts: [] })
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState({ total_predictions: 0, total_users: 0 })
  const { isDarkMode } = useTheme()

  const textColor = isDarkMode ? '#9ca3af' : '#6b7280'
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb'
  const tooltipBg = isDarkMode ? '#1f2937' : '#ffffff'
  const tooltipBorder = isDarkMode ? '#374151' : '#f3f4f6'

  const monthlyData = useMemo(() => {
    return (monthly.months || []).map((m, idx) => ({ month: m, predictions: monthly.counts?.[idx] || 0 }))
  }, [monthly])

  // Group roles by category for analytics
  const categoryData = useMemo(() => {
    const categories = { technical: 0, non_technical: 0 }
    
    roles.forEach(role => {
      // Try different possible field names
      const roleName = role.predicted_role || role.role || role.name || Object.keys(role)[0]
      const category = getRoleCategory(roleName)
      
      if (categories[category] !== undefined) {
        categories[category] += role.count || 1
      }
    })
    
    const result = Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      ...ROLE_CATEGORIES[category]
    }))
    return result
  }, [roles])

  const topRoles = useMemo(() => {
    return roles.slice(0, 5).map((role, idx) => ({
      ...role,
      color: COLORS[idx % COLORS.length]
    }))
  }, [roles])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [r1, r2, r3] = await Promise.all([
          analyticsApi.roles(), 
          analyticsApi.monthly(6),
          analyticsApi.getOverview()
        ])
        
        const rolesData = r1.data.distribution || []
        setRoles(rolesData)
        setMonthly(r2.data)
        setOverview(r3.data)
      } catch (e) {
        console.error('Analytics fetch error:', e)
        toast.error('Failed to load analytics: ' + (e.response?.data?.message || e.message))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Compact Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500 dark:bg-indigo-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Platform insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Minimal Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Predictions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{overview.total_predictions || 0}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{overview.total_users || 0}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Roles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{roles.length}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Growth</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 flex items-center gap-1">
                  +24%
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Role Categories</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Technical</span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                <span>Non-Technical</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: tooltipBg, 
                      borderColor: tooltipBorder, 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: isDarkMode ? '#e5e7eb' : '#374151' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        {/* Monthly Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Monthly Trends</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>6 month overview</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="month" stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: tooltipBg, 
                    borderColor: tooltipBorder, 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                  cursor={{ fill: isDarkMode ? '#374151' : '#f3f4f6' }}
                />
                <Bar dataKey="predictions" fill={COLORS[0]} radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>  
        </div>  
      </div>    
    </div>      
  </div>        
  )
}

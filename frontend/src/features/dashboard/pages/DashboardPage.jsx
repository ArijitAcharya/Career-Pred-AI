import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Brain, TrendingUp, Target, FileText, BarChart3, Clock, CheckCircle, ArrowRight, Upload, Zap } from 'lucide-react'

import { predictionsApi } from '../../../services/predictionsApi'
import { analyticsApi } from '../../../services/analyticsApi'
import { RoleBadge } from '../../../components/ui/RoleBadge'

export function DashboardPage() {
  const [skillsText, setSkillsText] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [latest, setLatest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [kpis, setKpis] = useState({
    totalPredictions: 0,
    mostPredictedRole: '—',
    avgConfidence: 0,
    resumeUploadCount: 0
  })

  useEffect(() => {
    loadKpis()
  }, [])

  async function loadKpis() {
    setLoading(true)
    try {
      console.log('Loading KPIs...')
      const [historyRes, overviewRes] = await Promise.all([
        predictionsApi.getHistory(),
        analyticsApi.getOverview()
      ])
      
      console.log('History response:', historyRes)
      console.log('Overview response:', overviewRes)
      
      const history = Array.isArray(historyRes.data) ? historyRes.data : (historyRes.data?.results || [])
      const overview = overviewRes.data
      
      const roleCounts = history.reduce((acc, pred) => {
        acc[pred.predicted_role] = (acc[pred.predicted_role] || 0) + 1
        return acc
      }, {})
      
      const mostPredicted = Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
      const avgConf = history.length > 0 
        ? history.reduce((sum, pred) => sum + (pred.confidence || 0), 0) / history.length 
        : 0
      const resumeCount = history.filter(pred => pred.resume_text).length
      
      setKpis({
        totalPredictions: overview?.total_predictions || history.length || 0,
        mostPredictedRole: mostPredicted,
        avgConfidence: Math.round(avgConf * 100),
        resumeUploadCount: resumeCount
      })
    } catch (e) {
      console.error('Failed to load KPIs:', e)
      toast.error('Failed to load KPIs')
    } finally {
      setLoading(false)
    }
  }

  async function predictFromSkills() {
    setLoading(true)
    try {
      const skills = skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const res = await predictionsApi.predictSkills({ skills })
      setLatest(res.data)
      toast.success('Prediction complete!')
    } catch (e) {
      console.error('Prediction failed:', e)
      toast.error('Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  async function predictFromResume() {
    setLoading(true)
    try {
      const res = await predictionsApi.uploadResume(resumeFile)
      setLatest(res.data)
      toast.success('Resume analysis complete!')
    } catch (e) {
      console.error('Resume analysis failed:', e)
      toast.error('Resume analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
    if (confidence >= 60) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }

  const kpiItems = [
    {
      label: 'Total predictions',
      value: kpis.totalPredictions,
      icon: Brain,
      tone: 'text-indigo-600/90 dark:text-indigo-300',
      ring: 'group-hover:ring-indigo-500/20 dark:group-hover:ring-indigo-400/15',
      bg: 'group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-transparent dark:group-hover:from-indigo-950/25',
      hover: 'transform transition-all duration-300 hover:scale-105 hover:shadow-lg',
    },
    {
      label: 'Most predicted role',
      value: kpis.mostPredictedRole,
      icon: Target,
      tone: 'text-emerald-600/90 dark:text-emerald-300',
      ring: 'group-hover:ring-emerald-500/20 dark:group-hover:ring-emerald-400/15',
      bg: 'group-hover:bg-gradient-to-br group-hover:from-emerald-50 group-hover:to-transparent dark:group-hover:from-emerald-950/20',
      hover: 'transform transition-all duration-300 hover:scale-105 hover:shadow-lg',
    },
    {
      label: 'Avg confidence',
      value: `${kpis.avgConfidence}%`,
      icon: TrendingUp,
      tone: 'text-amber-600/90 dark:text-amber-300',
      ring: 'group-hover:ring-amber-500/20 dark:group-hover:ring-amber-400/15',
      bg: 'group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-transparent dark:group-hover:from-amber-950/20',
      hover: 'transform transition-all duration-300 hover:scale-105 hover:shadow-lg',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Overview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">A quick snapshot of your activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className={`group rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-900/30 backdrop-blur-sm p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/20 ring-1 ring-transparent ${item.ring} ${item.bg}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{item.label}</p>
                <Icon className={`w-4 h-4 ${item.tone} transition-transform duration-300 group-hover:scale-110`} />
              </div>
              <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors" title={String(item.value)}>
                {item.value}
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
        {/* Prediction Section */}
        <div className="xl:col-span-3 rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-900/30 backdrop-blur-sm p-6 sm:p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">New prediction</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Submit skills or a PDF resume</p>
            </div>
            <Zap className="w-5 h-5 text-indigo-600/90 dark:text-indigo-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-900/20 p-5 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/20">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-4 h-4 text-indigo-600/90 dark:text-indigo-300" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Skills</h3>
              </div>
              <div className="space-y-3">
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 transition-all resize-none"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="e.g. react, tailwind, nodejs, python, machine learning"
                />
                <button
                  disabled={loading}
                  onClick={predictFromSkills}
                  className="mt-4 w-full rounded-xl bg-indigo-600 text-white py-3 text-sm font-semibold transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/15 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Analyze Skills
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-900/20 p-5 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/20">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="w-4 h-4 text-emerald-600/90 dark:text-emerald-300" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resume</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-gray-300/80 dark:border-gray-600/70 rounded-xl cursor-pointer bg-white/60 dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">Upload resume (PDF)</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max 5MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                {resumeFile && (
                  <div className="mt-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <p className="text-sm text-gray-700 dark:text-gray-200 font-medium truncate">{resumeFile.name}</p>
                  </div>
                )}
                <button
                  disabled={loading || !resumeFile}
                  onClick={predictFromResume}
                  className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-3 text-sm font-semibold transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/15 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 dark:focus:ring-emerald-400/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Upload & Analyze
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Result (sticky on desktop) */}
        <div className="xl:col-span-2 xl:sticky xl:top-24">
          {latest ? (
            <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-900/30 backdrop-blur-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Latest prediction</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Most recent result</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-900/20 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Predicted Role</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{latest.predicted_role}</div>
                  <div className="mt-2">
                    <RoleBadge role={latest.predicted_role} size="sm" showCategory={true} />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-900/20 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Confidence</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {latest.confidence != null ? Math.round(latest.confidence * 100) + '%' : '—'}
                    </div>
                    {latest.confidence != null && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(Math.round(latest.confidence * 100))}`}>
                        {latest.confidence >= 0.8 ? 'High' : latest.confidence >= 0.6 ? 'Medium' : 'Low'}
                      </span>
                    )}
                  </div>
                  {latest.confidence != null && (
                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(latest.confidence * 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-900/20 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Analyzed On</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(latest.created_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-900/30 backdrop-blur-sm p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No predictions yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Create your first prediction to see results here</p>
                </div>
                <div className="mt-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg animate-pulse">
                    <Brain className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

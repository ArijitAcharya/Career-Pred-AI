import { Bell, ShieldCheck } from 'lucide-react'

export function FeatureUpdateNotification() {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-slate-200/60">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-base font-semibold text-slate-900">Feature Update</h3>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
              <ShieldCheck className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">Privacy Protected</span>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Analytics and History dashboards are now accessible to all users. Previously available only to administrators, these sections provide platform insights while maintaining strict data privacy standards. No personal or user-specific information is displayed.
          </p>
          
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>System Update</span>
            <span>•</span>
            <span>Always Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

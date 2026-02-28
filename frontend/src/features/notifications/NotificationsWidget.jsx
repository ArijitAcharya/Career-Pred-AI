import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Bell } from 'lucide-react'

import { notificationsApi } from '../../services/notificationsApi'
import { FeatureUpdateNotification } from '../../components/FeatureUpdateNotification'

export function NotificationsWidget() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  async function load() {
    try {
      const res = await notificationsApi.list()
      setItems(res.data || res.data?.results || res.data)
    } catch (e) {
      // silent
    }
  }

  useEffect(() => {
    load()
  }, [])

  const unread = items.filter((n) => !n.is_read).length

  async function markRead(id) {
    try {
      await notificationsApi.markRead(id)
      toast.success('Marked as read')
      await load()
    } catch (e) {
      toast.error('Failed')
    }
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }

    function onPointerDown(e) {
      if (!(e.target instanceof Element)) return
      const root = e.target.closest('[data-notifications-root]')
      if (!root) setOpen(false)
    }

    if (open) {
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('pointerdown', onPointerDown)
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div className="relative" data-notifications-root>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-105 dark:border-slate-700/60 dark:bg-gray-900/40 dark:text-slate-200 dark:hover:bg-gray-900 group"
      >
        <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-1 text-[11px] font-semibold text-white shadow-lg animate-pulse">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-3xl border border-slate-200/60 bg-white/98 shadow-2xl shadow-slate-900/20 overflow-hidden dark:border-slate-700/40 dark:bg-gray-900/98 backdrop-blur-2xl animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/40 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-blue-950/20">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</div>
              {unread > 0 && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-medium dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300">
                  {unread} unread
                </span>
              )}
            </div>
          </div>
          <div className="max-h-80 overflow-auto">
            <div className="p-4 border-b border-slate-100/80 dark:border-slate-700/80">
              <FeatureUpdateNotification />
            </div>
            {items.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-7 h-7 text-gray-400" />
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">No notifications</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">You're all caught up!</div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100/80 dark:divide-slate-700/80">
                {items.map((n) => (
                  <div key={n.id} className="px-5 py-4 hover:bg-slate-50/80 dark:hover:bg-gray-800/40 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 transition-all duration-200 ${!n.is_read ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-sm' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${!n.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {n.title}
                        </div>
                        {n.message && (
                          <div className={`text-xs mt-1 ${!n.is_read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}>
                            {n.message}
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(n.created_at).toLocaleString()}
                          </div>
                          {!n.is_read ? (
                            <button
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                              onClick={() => markRead(n.id)}
                            >
                              Mark read
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">Read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

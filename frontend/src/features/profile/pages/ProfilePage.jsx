import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { User, Key, Camera, Shield, Bell, Palette, Globe, Save, X } from 'lucide-react'

import { authApi } from '../../../services/authApi'

export function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('account')
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)
  const [privacyModeEnabled, setPrivacyModeEnabled] = useState(false)
  const [savingPreferences, setSavingPreferences] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await authApi.me()
        setProfile(res.data)
        setEmailNotificationsEnabled(res.data?.email_notifications_enabled ?? true)
        setPrivacyModeEnabled(res.data?.privacy_mode_enabled ?? false)
        setFormData({
          email: res.data.email || '',
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } catch (e) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const togglePrivacyMode = async () => {
    const next = !privacyModeEnabled
    setPrivacyModeEnabled(next)
    setSavingPreferences(true)
    try {
      const res = await authApi.meUpdate({ privacy_mode_enabled: next })
      setProfile(res.data)
      setPrivacyModeEnabled(res.data?.privacy_mode_enabled ?? next)
      toast.success('Preferences saved')
    } catch (e) {
      setPrivacyModeEnabled(!next)
      toast.error('Failed to save preference')
    } finally {
      setSavingPreferences(false)
    }
  }

  const toggleEmailNotifications = async () => {
    const next = !emailNotificationsEnabled
    setEmailNotificationsEnabled(next)
    setSavingPreferences(true)
    try {
      const res = await authApi.meUpdate({ email_notifications_enabled: next })
      setProfile(res.data)
      setEmailNotificationsEnabled(res.data?.email_notifications_enabled ?? next)
      toast.success('Preferences saved')
    } catch (e) {
      setEmailNotificationsEnabled(!next)
      toast.error('Failed to save preference')
    } finally {
      setSavingPreferences(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Avatar must be less than 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', avatarFile)
      
      // Mock upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Avatar updated successfully!')
      setAvatarPreview(null)
      setAvatarFile(null)
    } catch (e) {
      toast.error('Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.meUpdate({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name
      })
      setProfile(res.data)
      toast.success('Profile updated successfully!')
    } catch (e) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
    try {
      // Mock update - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Password changed successfully!')
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (e) {
      toast.error('Failed to change password')
    }
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette }
  ]

  if (loading) {
    return (
      <div className="max-w-4xl space-y-8">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Profile Settings</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-8 h-96 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Profile Settings</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card p-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="glass-card p-8">
        {activeTab === 'account' && (
          <div className="space-y-8">
            {/* Avatar Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {profile?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {avatarPreview && (
                    <div className="absolute inset-0 w-24 h-24 rounded-full overflow-hidden">
                      <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="absolute inset-0 w-24 h-24 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Upload a new avatar. JPG, PNG or GIF. Max size 5MB.
                  </p>
                  {avatarPreview && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="btn-primary flex items-center gap-2"
                      >
                        {uploadingAvatar ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Avatar
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setAvatarPreview(null)
                          setAvatarFile(null)
                        }}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                  placeholder="Confirm new password"
                />
              </div>
              
              <div className="flex justify-end">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your predictions</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleEmailNotifications}
                  disabled={savingPreferences}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  } ${savingPreferences ? 'opacity-60 cursor-not-allowed' : ''}`}
                  aria-pressed={emailNotificationsEnabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Privacy Mode</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hide your profile from public search</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={togglePrivacyMode}
                  disabled={savingPreferences}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacyModeEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  } ${savingPreferences ? 'opacity-60 cursor-not-allowed' : ''}`}
                  aria-pressed={privacyModeEnabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacyModeEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

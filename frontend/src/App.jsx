import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { LoginPage } from './features/auth/pages/LoginPage'
import { RegisterPage } from './features/auth/pages/RegisterPage'
import { ForgotPassword } from './features/auth/pages/ForgotPassword'
import { ResetPassword } from './features/auth/pages/ResetPassword'
import { ResetPasswordOTP } from './features/auth/pages/ResetPasswordOTP'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AnalyticsPage } from './features/analytics/pages/AnalyticsPage'
import { DashboardPage } from './features/dashboard/pages/DashboardPage'
import { HistoryPage } from './features/dashboard/pages/HistoryPage'
import { ProfilePage } from './features/profile/pages/ProfilePage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-otp" element={<ResetPasswordOTP />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthProvider>
  )
}

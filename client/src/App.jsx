import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import LoadingScreen from './components/common/LoadingScreen.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import GuestRoute from './routes/GuestRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';

// Public pages
const LandingPage = lazy(() => import('./pages/landing/LandingPage.jsx'));
const PublicProfilePage = lazy(() => import('./pages/portfolio/PublicProfilePage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.jsx'));
const OnboardingPage = lazy(() => import('./pages/auth/OnboardingPage.jsx'));

// Dashboard layout + pages
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout.jsx'));
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview.jsx'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage.jsx'));
const ProjectsPage = lazy(() => import('./pages/dashboard/ProjectsPage.jsx'));
const CertificatesPage = lazy(() => import('./pages/dashboard/CertificatesPage.jsx'));
const AchievementsPage = lazy(() => import('./pages/dashboard/AchievementsPage.jsx'));
const CodingPage = lazy(() => import('./pages/dashboard/CodingPage.jsx'));
const SkillsPage = lazy(() => import('./pages/dashboard/SkillsPage.jsx'));
const ResumePage = lazy(() => import('./pages/dashboard/ResumePage.jsx'));
const PortfolioPage = lazy(() => import('./pages/dashboard/PortfolioPage.jsx'));
const InternshipsPage = lazy(() => import('./pages/dashboard/InternshipsPage.jsx'));
const PlacementsPage = lazy(() => import('./pages/dashboard/PlacementsPage.jsx'));
const GoalsPage = lazy(() => import('./pages/dashboard/GoalsPage.jsx'));
const NotesPage = lazy(() => import('./pages/dashboard/NotesPage.jsx'));
const StreakPage = lazy(() => import('./pages/dashboard/StreakPage.jsx'));
const StorePage = lazy(() => import('./pages/dashboard/StorePage.jsx'));
const LeaderboardPage = lazy(() => import('./pages/dashboard/LeaderboardPage.jsx'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage.jsx'));

// Admin pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminStore = lazy(() => import('./pages/admin/AdminStore.jsx'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'));
const AdminRewardRules = lazy(() => import('./pages/admin/AdminRewardRules.jsx'));

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/u/:username" element={<PublicProfilePage />} />

          {/* Guest-only (redirect to /dashboard if logged in) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected: onboarding */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Protected: dashboard */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="coding" element={<CodingPage />} />
              <Route path="skills" element={<SkillsPage />} />
              <Route path="resume" element={<ResumePage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="internships" element={<InternshipsPage />} />
              <Route path="placements" element={<PlacementsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="notes" element={<NotesPage />} />
              <Route path="streak" element={<StreakPage />} />
              <Route path="store" element={<StorePage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Direct convenience aliases redirecting to dashboard modules */}
            <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
            <Route path="/projects" element={<Navigate to="/dashboard/projects" replace />} />
            <Route path="/certificates" element={<Navigate to="/dashboard/certificates" replace />} />
            <Route path="/achievements" element={<Navigate to="/dashboard/achievements" replace />} />
            <Route path="/coding" element={<Navigate to="/dashboard/coding" replace />} />
            <Route path="/skills" element={<Navigate to="/dashboard/skills" replace />} />
            <Route path="/resume" element={<Navigate to="/dashboard/resume" replace />} />
            <Route path="/portfolio" element={<Navigate to="/dashboard/portfolio" replace />} />
            <Route path="/internships" element={<Navigate to="/dashboard/internships" replace />} />
            <Route path="/placements" element={<Navigate to="/dashboard/placements" replace />} />
            <Route path="/goals" element={<Navigate to="/dashboard/goals" replace />} />
            <Route path="/notes" element={<Navigate to="/dashboard/notes" replace />} />
            <Route path="/streak" element={<Navigate to="/dashboard/streak" replace />} />
            <Route path="/store" element={<Navigate to="/dashboard/store" replace />} />
            <Route path="/leaderboard" element={<Navigate to="/dashboard/leaderboard" replace />} />
            <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="store" element={<AdminStore />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="rewards" element={<AdminRewardRules />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}


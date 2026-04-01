import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navigation } from './components/Navigation';
import { FloatingOctocat } from './components/FloatingOctocat';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { FAQPage } from './pages/FAQPage';
import { MaintainerPortal } from './pages/MaintainerPortal';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { TeamPage } from './pages/TeamPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AppActivityPage } from './pages/AppActivityPage';
import { AuthProvider } from './contexts/AuthContext';
import { WebsiteStructuredData, OrganizationStructuredData, WebApplicationStructuredData } from './components/StructuredData';
import { Toaster } from 'react-hot-toast';
import { ScrollToTop } from './components/ScrollToTop';
import { AppShell } from './components/app-shell/AppShell';
import { ProtectedRoute, PublicRoute } from './routes/RouteGuards';

import { useAudioInteraction } from './hooks/useAudioInteraction';

const PublicLayout = () => (
  <>
    <Navigation />
    <Outlet />
    <FloatingOctocat />
  </>
);

function App() {
  useAudioInteraction();

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#161B22',
                color: '#E6EDF3',
                border: '1px solid #30363D',
              },
            }}
          />
          <ScrollToTop />
          <div className="min-h-screen bg-[#0D1117] text-white font-mono">
            <WebsiteStructuredData />
            <OrganizationStructuredData />
            <WebApplicationStructuredData />
            
            <Routes>
              <Route element={<PublicLayout />}>
                <Route
                  path="/"
                  element={
                    <PublicRoute redirectAuthenticatedTo="/app/discover">
                      <LandingPage />
                    </PublicRoute>
                  }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/maintainer" element={<MaintainerPortal />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route path="/discover" element={<Navigate to="/app/discover" replace />} />
              <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/discover" replace />} />
                <Route path="discover" element={<DiscoverPage />} />
                <Route path="activity" element={<AppActivityPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;

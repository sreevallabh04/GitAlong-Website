import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { AuthProvider } from './contexts/AuthContext';
import { WebsiteStructuredData, OrganizationStructuredData, WebApplicationStructuredData } from './components/StructuredData';
// @ts-ignore
import { analytics } from './lib/firebase';

function App() {
  useEffect(() => {
    // Firebase Analytics is automatically initialized
    // You can add custom analytics events here if needed
    // @ts-ignore
    if (analytics && typeof analytics !== 'undefined') {
      console.log('Firebase Analytics initialized');
    } else {
      console.log('Firebase Analytics not available');
    }
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[#0D1117] text-white font-mono">
            {/* Global Structured Data */}
            <WebsiteStructuredData />
            <OrganizationStructuredData />
            <WebApplicationStructuredData />
            
            <Navigation />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/maintainer" element={<MaintainerPortal />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
            <FloatingOctocat />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;

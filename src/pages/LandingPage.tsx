import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal';
import { SEO } from '../components/SEO';
import { BenefitsSection } from '../components/SEOContent';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useAuth();

  const handleGetStartedClick = () => {
    if (currentUser) {
      // If user is signed in, navigate to about page or show a different action
      window.location.href = '/about';
    } else {
      setShowAuthModal(true);
    }
  };

  const handleDownloadApp = () => {
    // Mock app store links - in real app, these would link to actual app stores
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      window.open('https://apps.apple.com/app/gitalong', '_blank');
    } else if (isAndroid) {
      window.open('https://play.google.com/store/apps/details?id=com.gitalong.app', '_blank');
    } else {
      // Default to iOS for desktop users
      window.open('https://apps.apple.com/app/gitalong', '_blank');
    }
  };

  const handleLearnMore = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="GitAlong - Find Your Perfect Coding Partner"
        description="Connect with developers who share your passion for coding. Find collaborators, build projects together, and stop coding alone with GitAlong."
        keywords="developer collaboration, coding partners, GitHub, open source, programming, software development, remote work, coding community, tech collaboration, developer networking, pair programming, code review"
        url="https://gitalong.vercel.app"
        type="website"
      />
      
      <HeroSection onGetStarted={handleGetStartedClick} onLearnMore={handleLearnMore} />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection onDownload={handleDownloadApp} onLearnMore={handleLearnMore} />
      <Footer />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal';
import { SEO } from '../components/SEO';
import { BenefitsSection } from '../components/SEOContent';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    if (currentUser) {
      navigate('/discover');
    } else {
      setShowAuthModal(true);
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
        url="https://GitAlong.vercel.app"
        type="website"
      />
      
      <HeroSection onGetStarted={handleGetStartedClick} onLearnMore={handleLearnMore} />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection onDownload={handleGetStartedClick} onLearnMore={handleLearnMore} />
      <Footer />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

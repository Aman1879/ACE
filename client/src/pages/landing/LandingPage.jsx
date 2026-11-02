import React from 'react';
import Navbar from '../../components/layout/Navbar';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import GamificationSection from './GamificationSection';
import StorePreviewSection from './StorePreviewSection';
import CTASection from './CTASection';
import Footer from '../../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <GamificationSection />
        <StorePreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}


import React from 'react';

// Import all landing page sections
import Header from '../shared/components/landing-v2/header';
import Hero from '../shared/components/landing-v2/hero';
import SocialProof from '../shared/components/landing-v2/social-proof';
import Problems from '../shared/components/landing-v2/problems';
import SolutionPreview from '../shared/components/landing-v2/solution-preview';
import Features from '../shared/components/landing-v2/features';
import HowItWorks from '../shared/components/landing-v2/how-it-works';
import DualValueProps from '../shared/components/landing-v2/dual-value-props';
import EarlyAccessCTA from '../shared/components/landing-v2/early-access-cta';
import FAQ from '../shared/components/landing-v2/faq';
import FinalCTA from '../shared/components/landing-v2/final-cta';
import Footer from '../shared/components/landing-v2/footer';


export default function Page() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <Hero />
      <SocialProof />
      <Problems />
      <SolutionPreview />
      <Features />
      <HowItWorks />
      <DualValueProps />
      <EarlyAccessCTA />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
